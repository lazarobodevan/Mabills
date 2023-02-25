const express = require('express');
const router = express.Router();

router.get('/health', (req, res) =>{
    res.status(200).send({message: "Server in running"});
});

module.exports = router;