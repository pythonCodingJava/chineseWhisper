const router = require('express').Router();
const controller = require('../controller/userController.js');
const cntcntrlr = require('../controller/contentController.js');

router.post('/auth/register', controller.register)
router.post('/auth/login', controller.login)
router.post('/content', cntcntrlr.getAll);
router.post('/content/like', cntcntrlr.like);
router.post('/content/likecmnt', cntcntrlr.likeCmt);
router.post('/content/create', cntcntrlr.create);
router.post('/content/fetch', cntcntrlr.getPost);
router.post('/content/replies', cntcntrlr.getComments);
router.post('/content/comment', cntcntrlr.comment);

module.exports = router;