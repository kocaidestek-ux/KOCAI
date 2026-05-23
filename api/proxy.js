const https = require('https');

export default async function handler(req, res) {
  if(req.method !== 'POST') {
    return res.status(405).json({error:'Method Not Allowed'});
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if(!apiKey) {
    return res.status(500).json({error:{message:'API key not configured'}});
  }

  return new Promise((resolve) => {
    const body = JSON.stringify(req.body);
    const options = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const request = https.request(options, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        res.status(response.statusCode).json(JSON.parse(data));
        resolve();
      });
    });

    request.on('error', (e) => {
      res.status(500).json({error:{message:e.message}});
      resolve();
    });

    request.write(body);
    request.end();
  });
}
