// https://github.com/netlify/functions/blob/master/src/lambda/hello_slack.js
const querystring = require('querystring');
const fetch = require('node-fetch');

exports.handler = async (event, context, callback) => {
    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const params = querystring.parse(event.body);
    const email = params.email;
    const email2 = params.email2;

    console.log('email', email);
    console.log('email2', email2);
    console.log('url', process.env.NEWSLETTER_URL);
    console.log('key', `group_${process.env.GROUP}`);
    console.log('value', process.env.GROUP);

    const formData = new URLSearchParams();

    formData.append('email', email);
    formData.append([`group_${process.env.GROUP}`], process.env.GROUP);
    console.log('form data', formData);

    if(email2 === '') {
        // Send the form to the ESP.
        return fetch(process.env.NEWSLETTER_URL, {
            method: 'POST',
            body: formData,
        })
            .then(() => ({
                // Redirect to success page.
                statusCode: 302,
                headers: {
                    Location: '/?signedup=true',
                    'Cache-Control': 'no-cache',
                },
                body: JSON.stringify({})
            }))
            .catch(error => ({
                // Still redirect to success page.

                statusCode: 422,
                body: `Oops! Something went wrong. ${error}`
            }));
    } else {
        // Still redirect to success page without posting the form.
        callback(null, {
            statusCode: 302,
            headers: {
                Location: '/?signedup=true',
                'Cache-Control': 'no-cache',
            },
            body: JSON.stringify({})
        });
    }
};
