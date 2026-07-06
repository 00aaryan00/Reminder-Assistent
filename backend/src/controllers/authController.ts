import { Request, Response, NextFunction } from 'express';
import { google } from 'googleapis';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import prisma from '../utils/prisma';

// HELPER: Always instantiate a new OAuth2 client per request to prevent race conditions.
// A global client would share state (credentials), causing session leaks under high concurrent usage.
const getOAuth2Client = () => {
  return new google.auth.OAuth2(
    config.google.clientId,
    config.google.clientSecret,
    config.google.redirectUri
  );
};

export const getGoogleAuthUrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = getOAuth2Client();
    
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/calendar.events',
    ];

    const url = client.generateAuthUrl({
      access_type: 'offline', // Requests a refresh token so we can query Google when the user is offline
      prompt: 'consent',     // Forces consent dialog to guarantee a refresh token is returned on every login
      scope: scopes,
    });

    res.status(200).json({ url });
  } catch (error) {
    next(error);
  }
};

export const handleGoogleCallback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { code } = req.query;

  if (!code || typeof code !== 'string') {
    res.redirect(`${config.frontendUrl}/login?error=missing_code`);
    return;
  }

  try {
    const client = getOAuth2Client();
    
    // Exchange temporary authorization code for credentials
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // Fetch user details from Google profile API
    const oauth2 = google.oauth2({ version: 'v2', auth: client });
    const userInfoResponse = await oauth2.userinfo.get();
    const googleUser = userInfoResponse.data;

    if (!googleUser.email || !googleUser.id) {
      res.redirect(`${config.frontendUrl}/login?error=profile_fetch_failed`);
      return;
    }

    // Database updates:
    // 1. Create or update User
    const user = await prisma.user.upsert({
      where: { googleId: googleUser.id },
      update: {
        name: googleUser.name || null,
        email: googleUser.email,
      },
      create: {
        googleId: googleUser.id,
        email: googleUser.email,
        name: googleUser.name || null,
      },
    });

    // 2. Upsert tokens securely (always update the refresh token if received)
    if (tokens.refresh_token) {
      await prisma.oAuthToken.upsert({
        where: { userId: user.id },
        update: {
          accessToken: tokens.access_token as string,
          refreshToken: tokens.refresh_token as string,
          expiry: new Date(tokens.expiry_date as number),
        },
        create: {
          userId: user.id,
          accessToken: tokens.access_token as string,
          refreshToken: tokens.refresh_token as string,
          expiry: new Date(tokens.expiry_date as number),
        },
      });
    } else {
      // If prompt consent didn't yield a refresh token but one exists, update only the access token
      await prisma.oAuthToken.update({
        where: { userId: user.id },
        data: {
          accessToken: tokens.access_token as string,
          expiry: new Date(tokens.expiry_date as number),
        },
      });
    }

    // 3. Ensure user settings exist
    await prisma.setting.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        displayTimezone: 'Asia/Kolkata',
        reminderTiming: 30,
        isEnabled: true,
      },
    });

    // Sign custom session JWT
    const sessionToken = jwt.sign(
      { userId: user.id, email: user.email },
      config.sessionSecret,
      { expiresIn: '7d' }
    );

    // Set secure session cookie. httpOnly prevents Client JS (React) from accessing it.
    res.cookie('session', sessionToken, {
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Fire off calendar synchronization in the background (no await so it doesn't block login)
    import('../utils/googleCalendar').then(({ syncUserCalendar }) => {
      syncUserCalendar(user.id);
    });

    // Redirect user back to frontend dashboard
    res.redirect(`${config.frontendUrl}/dashboard`);
  } catch (error) {
    console.error('[OAuth Callback Error]:', error);
    res.redirect(`${config.frontendUrl}/login?error=oauth_failed`);
  }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: {
        settings: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.clearCookie('session');
    res.status(200).json({ status: 'ok', message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};
