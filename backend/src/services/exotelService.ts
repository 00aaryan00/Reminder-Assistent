import { config } from '../config';

/**
 * Triggers a reminder call using the Exotel API.
 * @param userPhone The user's phone number to call (e.g., "9876543210")
 * @param meetingTitle The title of the meeting
 * @param timeUntilStart Minutes until the meeting starts
 * @param meetingStartTime The exact Date when the meeting starts
 */
export const triggerReminderCall = async (userPhone: string, meetingTitle: string, timeUntilStart: number, meetingStartTime: Date) => {
  const { sid, apiKey, apiToken, subdomain, callerId } = config.exotel;

  // Basic validation
  if (!userPhone) {
    console.error(`[ExotelService] Cannot place call for "${meetingTitle}" - User phone number is missing.`);
    return;
  }

  if (!sid || !apiKey || !apiToken || !callerId) {
    console.warn(`[ExotelService] Exotel credentials missing. Mocking call to ${userPhone} for "${meetingTitle}".`);
    return;
  }

  console.log(`[ExotelService] Initiating call to ${userPhone} from CallerID ${callerId}...`);

  // Exotel API Endpoint
  // Format: https://api.exotel.com/v1/Accounts/<your_sid>/Calls/connect.json
  const url = `https://${subdomain}/v1/Accounts/${sid}/Calls/connect.json`;

  // Basic Authentication header
  const authHeader = 'Basic ' + Buffer.from(`${apiKey}:${apiToken}`).toString('base64');

  // Format the phone number to E.164 if it is a 10-digit Indian number
  let formattedPhone = userPhone.replace(/[\s-]/g, '');
  if (formattedPhone.length === 10) {
    formattedPhone = '+91' + formattedPhone;
  }

  // Prepare the URL-encoded payload
  const params = new URLSearchParams();
  params.append('From', formattedPhone); // The number we are calling
  params.append('CallerId', callerId); // The Exotel Virtual Number
  
  // Build a detailed spoken message with meeting title, time remaining, and exact start time.
  // We format the exact start time into a human-readable string in the user's local timezone.
  const exactTime = meetingStartTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  });

  const spokenMessage =
    `Hello! This is your reminder. ` +
    `Your meeting, ${meetingTitle}, ` +
    `starts in ${timeUntilStart} minutes, ` +
    `at ${exactTime}. ` +
    `Have a great meeting! Goodbye.`;

  // We use our own live Render backend to serve the XML to Exotel!
  const messageUrl = `https://reminder-assistent.onrender.com/api/exotel/say?message=${encodeURIComponent(spokenMessage)}`;
  params.append('Url', messageUrl);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: params.toString()
    });

    const data: any = await response.json();

    if (!response.ok) {
      console.error(`[ExotelService] Call failed! Exotel Error:`, data);
      return;
    }

    console.log(`[ExotelService] Call successfully initiated! Call SID: ${data?.Call?.Sid}`);
  } catch (error) {
    console.error(`[ExotelService] Network error while placing call:`, error);
  }
};
