const express = require('express');
const { Post, UserPost } = require('../db/models');
const Sequelize = require('sequelize');
const router = express.Router();
const update=require('../api/updateController');
const {in: opIn} = Sequelize.Op;
/**
 * Create a new blog post
 * req.body is expected to contain {text: required(string), tags: optional(Array<string>)}
 */
router.post('/', async (req, res, next) => {
  try {
    // Validation
    if (!req.user) {
      return res.sendStatus(401);
    }

    const { text, tags } = req.body;

    if (!text) {
      return res
        .status(400)
        .json({ error: 'Must provide text for the new post' });
    }

    // Create new post
    const values = {
      text,
    };
    if (tags) {
      values.tags = tags.join(',');
    }
    const post = await Post.create(values);
    await UserPost.create({
      userId: req.user.id,
      postId: post.id,
    });

    res.json({ post });
  } catch (error) {
    next(error);
  }
});

//Part 1: Fetching Blog Posts

router.get('/api/posts', async (req, res, next) => {
  try {
    const error = new Error("An error message");
    const {authorIds} = req.query;
    if(!authorIds){
      return res.status(400).send({
        message: error
     });
    }
   const id_list = authorIds.split(',');
    const users_post =  UserPost.findAll({
      include: [
        {
          where: {
            userId: {
              [opIn]:id_list
            },
            
          },
        },
      ],
    });

    const postIds = users_post.map(item => item.postId);

    const postList = Post.findAll({
      include: [
        {
          where: {
            id: {
              [opIn]:postIds
            },
            order: [
              ['id', 'ASC'],
              ['popularity', 'ASC'],
          ],
          },
        },
      ],
    });


    res.json({ post:postList });
  } catch (error) {
    next(error);
  }
//part 2 Updating a Blog Post
router.put(`/api/posts/${UserPost.postId}`, update);
});



module.exports = router;
