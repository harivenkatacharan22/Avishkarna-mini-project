import http from 'http';

const payload = JSON.stringify({ username: 'ramesh', password: 'password123' });

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const parsed = JSON.parse(data);
    if (parsed.token) {
      console.log('✅ LOGIN SUCCESS!');
      console.log('   User:', parsed.user.name, '|', parsed.user.village);
      console.log('   Token (first 40 chars):', parsed.token.substring(0, 40) + '...');
    } else {
      console.log('❌ LOGIN FAILED:', parsed.message);
    }
  });
});

req.on('error', (e) => console.error('❌ Request error:', e.message));
req.write(payload);
req.end();
