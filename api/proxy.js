const https = require('https');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if(req.method === 'OPTIONS') return res.status(200).end();
  if(req.method !== 'POST') return res.status(405).json({error:'Method Not Allowed'});

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if(!apiKey) return res.status(500).json({error:{message:'API key not configured'}});

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
        try {
          res.status(response.statusCode).json(JSON.parse(data));
        } catch(e) {
          res.status(500).json({error:{message:'Parse error: '+e.message}});
        }
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
};
