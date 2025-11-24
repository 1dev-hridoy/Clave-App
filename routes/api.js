const express = require('express');
const router = express.Router();

/* ===============================
Import Controllers
=============================== */
const chatController = require('../controllers/chatController');
const imageController = require('../controllers/imageController');
const utilityController = require('../controllers/utilityController');


const {
    validateChatRequest,
    validateImageRequest,
    validateSessionId
} = require('../middleware/validator');


router.post('/chat', validateSessionId, validateChatRequest, chatController.handleChat);
router.post('/reset', validateSessionId, chatController.resetConversation);


router.post('/image', validateImageRequest, imageController.generateImage);


router.get('/status', utilityController.getStatus);

module.exports = router;
