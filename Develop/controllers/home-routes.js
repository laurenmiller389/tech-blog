const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// THEN I am taken to the homepage and presented with existing blog posts that include the post title and the date created
// WHEN I click on an existing blog post
// THEN I am presented with the post title, contents, post creator’s username, and date created for that post and have the option to leave a comment
// WHEN I enter a comment and click on the submit button while signed in
// THEN the comment is saved and the post is updated to display the comment, the comment creator’s username, and the date created

router.get('/', withAuth, async (req, res) => {
  try {
    // GET all posts and JOIN with user data
    
    const postData = await Post.findAll({
      //specifically post attributes:
      attributes: ['id', 'title', 'content', 'date_created' ],
      include: [
        {
          model: User,
          attributes: ['id','username'],
        },
        {
          model: Comment,
          attributes: ['id', 'comment', 'user_id','post_id', 'date_created'],
          include: {
            model: User,
            attributes: ['username']
          }
        }
      ],
    });

    // Serialize data so the template can read it
    const posts = postData.map((post) => post.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      posts, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET a single post from :id
router.get('/post/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      //specifically post attributes:
      attributes: ['id', 'title', 'content', 'date_created' ],
      include: [
        {
          model: User,
          attributes: ['id','username'],
        },
        {
          model: Comment,
          attributes: ['id', 'comment', 'user_id','post_id', 'date_created'],
          include: {
            model: User,
            attributes: ['username']
          }
        }
      ],
    })

    //serialize
    const post = postData.get({ plain: true });

    //render
    res.render('post-detail', {
      ...post,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

module.exports = router;
