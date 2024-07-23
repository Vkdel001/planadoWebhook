const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
    const webhookData = req.body;

    console.log('Webhook received:', webhookData);

    // Extract the happened_at value from the webhook data
    const happenedAt = webhookData?.context?.happened_at || 'Unknown';

    // Dynamically import node-fetch
    const fetch = await import('node-fetch').then(module => module.default);

    // Prepare the data for the POST request
    const postData = {
        appId: "LDF100199",
        workplaceId: "EMT052658",
        submissionId: "LXQ10686354",
        requestingUserEmailAddress: "vikas.khanna@emtel.com",
        data: {
            completion: happenedAt
        }
    };

    try {
        const response = await fetch('https://api-public-v3.clappia.com/submissions/edit', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-api-key': 'emt052658999e58772f1d44b7a920796d0863a90b'
            },
            body: JSON.stringify(postData)
        });

        const responseData = await response.json();
        console.log('Response from Clappia API:', responseData);

        res.status(200).send('Webhook received and processed');
    } catch (error) {
        console.error('Error making POST request:', error);
        res.status(500).send('Error processing webhook');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
