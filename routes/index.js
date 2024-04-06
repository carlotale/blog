var express = require('express');
var router = express.Router();
var authorController = require('../controllers/author_controller');
var postsController = require('../controllers/posts_controller');

const multer = require('multer');
const storage = multer.memoryStorage()
const upload = multer({
 storage: storage,
 limits: {fileSize: 20 * 1024 * 1024}});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/author', authorController.getAuthor);
router.get('/posts', postsController.index);
router.param('postId', postsController.load);
router.get('/posts/:postId(\\d+)/attachment', postsController.attachment);
router.get('/posts/:postId(\\d+)', postsController.show);
router.get('/posts/new', postsController.new);
router.post('/posts', upload.single('image'), postsController.create);
router.get('/posts/:postId(\\d+)/edit', postsController.edit);
router.put('/posts/:postId(\\d+)', upload.single('image'), postsController.update);
router.delete('/posts/:postId(\\d+)', postsController.destroy)


module.exports = router;
