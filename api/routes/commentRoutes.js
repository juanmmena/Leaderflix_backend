const express = require("express");
const router = express.Router();
const CommentController = require("../controllers/CommentController");

router.get("/:videoId", CommentController.getComments);
router.post("/", CommentController.createComment);
router.put("/:commentId", CommentController.editComment);
router.delete("/:commentId", CommentController.removeComment);

module.exports = router;
