const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

//GET all comments

router.get('/', withAuth, async (req, res) => {
  try {
    // GET all posts and JOIN with user data
    
    const commentData = await Comment.findAll({});
    if(commentData.length === 0) {
      res.status(404).json({
        message: 'no comment found'
      })
      return;
    }
    res.status(200).json(commentData)
  } catch (err) {
    res.status(500).json(err)
  }
});

//GET comment from :id
router.get('/:id', withAuth, async (req, res) => {
  try {
    // GET all posts and JOIN with user data
    
    const commentData = await Comment.findAll({
      where: { id: req.params.id },
    });
    if(commentData.length === 0) {
      res.status(404).json({
        message: 'no comment found with this id'
      })
      return;
    }
    res.status(200).json(commentData)
  } catch (err) {
    res.status(500).json(err)
  }
});

//POST create comment
router.post('/', withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newComment);
  } catch (err) {
    res.status(400).json(err);
  }
});


//DELETE to delete comment from :id
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const commentData = await Comment.destroy({
      where: {
        post_id: req.params.id,
      }
    })
    if (!commentData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    res.status(200).json(commentData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
