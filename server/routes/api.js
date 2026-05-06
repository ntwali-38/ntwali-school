const express = require('express');
const router = express.Router();
router.use('/schools', require('./schools'));
router.use('/messages', require('./messages'));
router.use('/school', require('./school'));
router.use('/admin', require('./admin'));

module.exports = router;
