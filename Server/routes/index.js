const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ msg: "WELCOME TO SITED APP" })
});

module.exports = router;