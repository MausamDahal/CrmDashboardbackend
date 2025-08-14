import axios, { AxiosError } from 'axios';
import { loadSecrets } from '../utils/secretManager';

async function testSubscriptionAPI() {
    try {
        // Load secrets into environment
        await loadSecrets();
        console.log(' Secrets loaded successfully');

        // API configuration
        const baseUrl = process.env.API_URL || 'http://localhost:3000';
        const apiKey = process.env.API_KEY;
        const subdomain = 'test';
        const hostname = 'testmausamcrm.site';

        if (!apiKey) {
            throw new Error('API_KEY must be set in .env file');
        }

        // First, get a token by logging in
        console.log('\n1. Getting authentication token...');
        const loginResponse = await axios.post(`${baseUrl}/api/login`, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Host': hostname,
                'Origin': `https://${hostname}`
            },
            withCredentials: true
        });
        console.log('Login Response:', loginResponse.data);

        // Get the token from the cookie
        const cookies = loginResponse.headers['set-cookie'];
        if (!cookies) {
            throw new Error('No token received from login');
        }
        const tokenCookie = cookies.find(cookie => cookie.startsWith('token='));
        if (!tokenCookie) {
            throw new Error('Token cookie not found');
        }

        
        const headers = {
            'Content-Type': 'application/json',
            'Host': hostname,
            'X-API-Key': apiKey,
            'Origin': `https://${hostname}`,
            'Cookie': tokenCookie
        };

        console.log('\n2. Getting subscription status...');
        const statusResponse = await axios.get(`${baseUrl}/api/subscription/status`, { 
            headers,
            withCredentials: true 
        });
        console.log('Status Response:', statusResponse.data);

        //  Switch subscription
        console.log('\n3. Switching subscription...');
        const switchResponse = await axios.post(
            `${baseUrl}/api/subscription/switch`,
            {
                newPlanId: 'plan_basic',
                immediate: true
            },
            { 
                headers,
                withCredentials: true 
            }
        );
        console.log('Switch Response:', switchResponse.data);

        //  Cancel subscription
        console.log('\n4. Canceling subscription...');
        const cancelResponse = await axios.post(
            `${baseUrl}/api/subscription/cancel`,
            {
                immediate: false
            },
            { 
                headers,
                withCredentials: true 
            }
        );
        console.log('Cancel Response:', cancelResponse.data);

        // Verify status
        console.log('\n5. Verifying  status...');
        const finalStatusResponse = await axios.get(`${baseUrl}/api/subscription/status`, { 
            headers,
            withCredentials: true 
        });
        console.log('Final Status Response:', finalStatusResponse.data);

        console.log('\n All subscription API tests completed successfully!');
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error(' Error testing subscription API:', error.response?.data || error.message);
        } else {
            console.error(' Error testing subscription API:', error);
        }
    }
}

testSubscriptionAPI(); 