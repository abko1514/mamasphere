import https from 'https';

const BREVO_API_KEY = process.env.BREVO_API_KEY;

if (!BREVO_API_KEY) {
    console.error('Please set BREVO_API_KEY in your environment variables');
    process.exit(1);
}

// Test Brevo API connection
const testBrevoConnection = () => {
    const data = JSON.stringify({
        sender: {
            name: "MamaSphere",
            email: "noreply@mamasphere.com"
        },
        to: [{
            email: "your-test-email@example.com",
            name: "Test User"
        }],
        subject: "MamaSphere Setup Test",
        htmlContent: "<html><body><h1>Your email service is working!</h1><p>Brevo integration successful.</p></body></html>"
    });

    const options = {
        hostname: 'api.brevo.com',
        port: 443,
        path: '/v3/smtp/email',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': BREVO_API_KEY,
            'Content-Length': data.length
        }
    };

    const req = https.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
            responseData += chunk;
        });

        res.on('end', () => {
            if (res.statusCode === 201) {
                console.log('✅ Brevo setup successful! Test email sent.');
                console.log('Response:', JSON.parse(responseData));
            } else {
                console.error('❌ Brevo setup failed:', res.statusCode);
                console.error('Response:', responseData);
            }
        });
    });

    req.on('error', (error) => {
        console.error('❌ Connection error:', error);
    });

    req.write(data);
    req.end();
};

testBrevoConnection();