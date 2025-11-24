const gpt4o = require('../lib/gpt4o');
const chatgpt35 = require('../lib/chatgpt35');

const models = {
    'gpt-4o': gpt4o,
    'gpt-3.5': chatgpt35,
    'default': gpt4o
};

module.exports = models;
