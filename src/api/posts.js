const express = require('express');
const { Post, UserPost } = require('../db/models');
const Sequelize = require('sequelize');
const router = express.Router();
const {PatchRequest}=require('../api/usePatch');
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

router.get('/', async (req, res, next) => {
  try {
    const error = new Error("Author id is not correctly definded or it is null ");
    const {authorIds} = req.query;
    if(!authorIds){
      return res.status(400).send({
        message: error
     });
    }
   const idList = authorIds.split(',');
    const usersPost =  UserPost.findAll({
      include: [
        {
          where: {
            userId: {
              [opIn]:idList
            },
            
          },
        },
      ],
    });

    const postIds = usersPost.map(item => item.postId);
    const postList = Post.findAll({
      include: [
        {
          where: {
            id: {
              [opIn]:postIds
            },
            order: [
              ['id',req.query.order],
              ['popularity', req.query.order],
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
PatchRequest(`/api/posts/:${UserPost.postId}`,UserPost.postId);
});



module.exports = router;
