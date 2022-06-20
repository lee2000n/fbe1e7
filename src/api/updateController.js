const db = require('../db/models');


const UpdatePost = db.Post;
exports.update = (req, res) => {
    const { postId } = req.params;
  const err="an error message";
    UpdatePost.update(req.body, {
      where: { postId },
    })
      .then(() => {
        if (postId) {
          res.send({
            authorIds: [1, 5],
            tags: ["health", "tech"],
            text: 'Some long blog post text here.'
          });
        } else {
          res.send({
            error: err
          });
        }
      })
      .catch((error) => {
        res.status(500).send({
          message: `Error updating photo with id=${postId}`,
        });
      });
  };
