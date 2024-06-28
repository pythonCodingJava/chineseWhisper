const router = require('express').Router();
const controller = require('../controller/userController.js');
const cntcntrlr = require('../controller/contentController.js');

router.post('/auth/register', controller.register)
router.post('/auth/login', controller.login)

router.post('/content', cntcntrlr.getAll);
router.post('/content/fetch', cntcntrlr.getPost);

router.post('/content/replies', cntcntrlr.getComments);

module.exports = router;