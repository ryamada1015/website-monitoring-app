const router = require('express').Router();
const UserService = require("../services/UserService");

router.get('/all', UserService.userFunctionName);
// router.post
// router.put
// router.delete

module.exports = router;
