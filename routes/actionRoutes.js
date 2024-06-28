const router = require('express').Router();
const cntcntrlr = require('../controller/contentController.js');

router.post('/like', cntcntrlr.like);
router.post('/likecmnt', cntcntrlr.likeCmt);
router.post('/create', cntcntrlr.create);
router.post('/comment', cntcntrlr.comment);

module.exports = router;