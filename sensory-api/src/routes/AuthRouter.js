const router = require('express').Router();
const AuthService = require("../services/AuthService");

router.get('/all', AuthService.authFunctionName);
// router.post
// router.put
// router.delete

module.exports = router;
