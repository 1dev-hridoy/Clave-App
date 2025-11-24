const models = require('../config/models');
const { APIError, createValidationError, createServiceError } = require('../middleware/errorHandler');


const conversationHistory = new Map();

const chatController = {
    handleChat: async (req, res, next) => {
        try {

            const { message, model, systemPrompt } = req.body;
            const sessionId = req.headers['x-session-id'] || 'default';
            const selectedModel = model || 'default';


            if (!conversationHistory.has(sessionId)) {
                conversationHistory.set(sessionId, []);
            }
            const history = conversationHistory.get(sessionId);


            history.push({ role: 'user', content: message });


            let messages = [...history];


            if (systemPrompt) {
                messages = [
                    { role: 'system', content: systemPrompt },
                    ...messages
                ];
            }




            // Call model
            const aiModel = models[selectedModel];
            let response;

            try {
                if (selectedModel === 'gpt-3.5') {
                    response = await aiModel(messages, systemPrompt || "Be a helpful assistant");
                } else {
                    response = await aiModel({
                        messages: messages,
                        systemInstruction: systemPrompt || undefined,
                        temperature: 0.9,
                        max_tokens: 2048
                    });
                }
            } catch (aiError) {
                console.error(`AI Model Error (${selectedModel}):`, aiError);
                throw createServiceError(`AI Model (${selectedModel})`, aiError);
            }


            if (!response || !response.success) {
                throw new APIError(
                    'Failed to get response from ' + selectedModel,
                    500,
                    { model: selectedModel, reason: response?.error || 'Unknown error' }
                );
            }


            history.push({ role: 'assistant', content: response.answer });


            if (history.length > 20) {
                history.splice(0, history.length - 20);
            }


            res.json({
                text: response.answer,
                model: selectedModel,
                citations: []
            });

        } catch (error) {
            // Pass error to global error handler
            next(error);
        }
    },

    resetConversation: (req, res, next) => {
        try {
            const sessionId = req.headers['x-session-id'] || 'default';


            const existed = conversationHistory.has(sessionId);


            conversationHistory.delete(sessionId);

            res.json({
                status: 'ok',
                message: 'Conversation reset',
                sessionId: sessionId,
                hadHistory: existed
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = chatController;
