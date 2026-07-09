const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play>https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3</Play>
</Response>`;

fetch('https://webhook.site/token/5c5f071e-1f51-4c3b-9b7a-73d6011bd1e8', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    default_content: xml,
    default_content_type: 'application/xml',
    default_status: 200
  })
}).then(r => console.log(r.status));
