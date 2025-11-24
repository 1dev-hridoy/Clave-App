const deepimg = require('../lib/deepimg');
const { APIError, createValidationError, createServiceError } = require('../middleware/errorHandler');

const imageController = {
    generateImage: async (req, res, next) => {
        try {

            const { prompt, model = 'deepimg', style, size } = req.body;


            let result;
            try {
                result = await deepimg({
                    prompt: prompt,
                    style: style || 'default',
                    size: size || '1:1'
                });
            } catch (serviceError) {
                console.error('Image Generation Service Error:', serviceError);
                throw createServiceError('Image Generation', serviceError);
            }

            // Validate result
            if (!result || !result.status) {
                throw new APIError(
                    result?.message || 'Image generation failed',
                    500,
                    {
                        service: 'deepimg',
                        prompt: prompt.substring(0, 100),
                        reason: result?.message || 'Unknown error'
                    }
                );
            }




            //successful response
            res.json({
                success: true,
                model: 'deepimg',
                imageUrl: result.imageUrl,
                prompt: prompt.substring(0, 100)
            });

        } catch (error) {

            next(error);
        }
    }
};

module.exports = imageController;
