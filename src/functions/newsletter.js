// https://github.com/netlify/functions/blob/master/src/lambda/hello_slack.js

import querystring from 'querystring';
import fetch from 'node-fetch';

exports.handler = async (event, context) => {
    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const params = querystring.parse(event.body);
    const email = params.email;
    const email2 = params.email2;

    if(email2 === undefined) {
        // Send the form to the ESP.
        return fetch(process.env.NEWSLETTER_URL, {
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(
                {
                    email,
                    [`group_${process.env.GROUP}`]: process.env.GROUP,
                }
            )
        })
            .then(() => ({
                statusCode: 200,

                // Redirect to success page.
                body: `Hopefully you see this message.`
            }))
            .catch(error => ({
                // Still redirect to success page.

                // statusCode: 422,
                // body: `Oops! Something went wrong. ${error}`
            }));
    } else {
        // Still redirect to success page without posting the form.
    }
};
