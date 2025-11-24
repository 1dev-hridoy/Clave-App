const express = require('express');
const router = express.Router();
const webConfig = require('../config/webConfig.json');


router.use((req, res, next) => {
    res.locals.webConfig = webConfig;
    res.locals.currentPath = req.path;
    next();
});


router.get('/', (req, res) => {
    res.render('landing');
});


router.get('/chat', (req, res) => {
    res.render('index');
});


router.get('/docs', (req, res) => {
    res.render('api-docs');
});

// Test for 404 error
router.get('/test-404', (req, res) => {

    res.status(404).render('404');
});

// Test for 500 error
router.get('/test-500', (req, res) => {

    throw new Error('Test 500 error');
});

module.exports = router;