const express = require('express');
const multer = require('multer');
const Post = require('../Models/post');
const checkAuth = require('../Middleware/check-auth');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

//multer config to save images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let err = new Error('Invalid mime type.');
    if(isValid) {
      err = null;
    }
    cb(err, 'Images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '.' + ext);
  }
});

router.get('',(req, res, next) => {
  //Pagination params passed as query params
  const pageSize = +req.query.size;
  const curPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if(pageSize && curPage) {
    postQuery.skip(pageSize*(curPage-1)).limit(pageSize);
  }
  postQuery.then(result => {
    fetchedPosts = result;
    return Post.count();
  }).then(count => {
    res.status(200).json({
      message: 'Posts fetched succesfully',
      posts: fetchedPosts,
      postCount: count,
      size: pageSize
    });
  })
  .catch(err => {
    res.status(500).json({
      message: 'Posts could not be fetched.'
    })
  });
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if(post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: 'Post not found'
      });
    }
  })
  .catch(err => {
    res.status(500).json({
      message: 'Post could not be fetched.'
    })
  });
});

//multer midware to extract image file from req body
router.post('', checkAuth, multer({storage: storage}).single('image'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId,
    userName: req.userData.email
  });
  post.save().then(newPost => {
    res.status(201).json({
      message: 'Post created',
      post: { id: newPost._id, title: newPost.title, content: newPost.content, imagePath: newPost.imagePath }
    });
  })
  .catch(err => {
    res.status(500).json({
      message: 'Post creation failed.'
    });
  });
});

router.put('/:id', checkAuth, multer({storage: storage}).single('image'), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if(req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId,
    userName: req.userData.email
  });
  Post.updateOne({_id: req.params.id, creator: req.userData.userId }, post).then(result => {
    if(result.n > 0) {
      res.status(201).json({
        message: 'Post upadated',
        imagePath: imagePath
      });
    } else {
      res.status(401).json({
        message:'Not authenticated.'
      });
    }
  })
  .catch(err => {
    res.statu(500).json({
      message: 'Update failed.'
    })
  });
});


router.delete('/:id', checkAuth, (req, res, next) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId }).then(result => {
    if(result.n > 0) {
      res.status(201).json({
        message: 'Post deleted',
      });
    } else {
      res.status(401).json({
        message:'Not authenticated.'
      });
    }
  })
  .catch(err => {
    res.status(500).json({
      message: 'Deletion failed.'
    })
  });
});

module.exports = router;
