import express from 'express';
import { createComment } from '../controllers/comment.controller.js';
import { verifyToken }  from '../utils/verifyUser.js';
import {getPostComments,getReplies,getComments,likeComment,editComment,deleteComment} from '../controllers/comment.controller.js';

const router =express.Router();

router.post('/create',verifyToken,createComment);
router.get('/getPostComments/:postId',getPostComments); 
router.get('/getReplies/:parentId',getReplies); 
router.put('/likeComment/:commentId',verifyToken,likeComment);
router.put('/editComment/:commentId',verifyToken,editComment);
router.delete('/deleteComment/:commentId',verifyToken,deleteComment);
router.get('/getcomments',verifyToken,getComments);


export default router;