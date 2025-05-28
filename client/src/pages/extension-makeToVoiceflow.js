export const makeToVoiceflow = {
    name: 'ext_getMakeData',
    type: 'response',
    match: ({ trace }) => trace.type === 'ext_getMakeData' || trace.payload.name === 'ext_getMakeData',
    render: ({ trace, element }) => {
        try {
            let blogContent="types of nature is 1.ai 2.fire 3.soil"
            if (!blogContent) {
                throw new Error('No blog content provided');
            }

            // Directly send blog content to Voiceflow
            window.voiceflow.chat.load({
                type: 'complete',
                payload: {
                    blog_content: blogContent,
                },
            });
                 // RETURN data to Voiceflow directly
                //  return {
                //     type: 'path',
                //     path: 'complete',
                //     payload: {
                //         blog_content: blogContent
                //     }
                // };
         

        } catch (error) {
            console.error('There was a problem:', error.message);
            return {
                next: { path: 'error' },
                trace: [{ type: 'debug', payload: { message: "Error: " + error.message } }]
            };
        }
    }
};
