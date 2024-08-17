const express = require('express');
const { getNumbers } = require('../controllers/NUmbersController');
const router = express.Router();

router.route("/numbers/:type").get(getNumbers);

module.exports = router