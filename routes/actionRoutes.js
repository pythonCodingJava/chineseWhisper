const router = require('express').Router();
const cntcntrlr = require('../controller/contentController.js');
const { logout } = require('../controller/userController.js');

router.post('/like', cntcntrlr.like);
router.post('/likecmnt', cntcntrlr.likeCmt);
router.post('/create', cntcntrlr.create);
router.post('/comment', cntcntrlr.comment);
router.get('/logout', logout);
router.post('/delete', cntcntrlr.delete);

module.exports = router;