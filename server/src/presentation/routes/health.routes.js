const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

// Оскільки ми підключимо цей роутер на префікс '/health',
// тут достатньо вказати просто '/'
router.get('/', healthController.checkHealth);

module.exports = router;
