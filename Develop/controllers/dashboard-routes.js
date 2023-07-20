const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

//WHEN I click on the dashboard option in the navigation
// THEN I am taken to the dashboard and presented with any blog posts I have already created and the option to add a new blog post
// WHEN I click on the button to add a new blog post
// THEN I am prompted to enter both a title and contents for my blog post
// WHEN I click on the button to create a new blog post
// THEN the title and contents of my post are saved and I am taken back to an updated dashboard with my new blog post
// WHEN I click on one of my existing posts in the dashboard
// THEN I am able to delete or update my post and taken back to an updated dashboard

router.get('/', withAuth, async (req, res) => {
  try {
    // GET all projects and JOIN with user data
    
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
