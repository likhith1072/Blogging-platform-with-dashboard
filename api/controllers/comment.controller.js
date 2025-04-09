import Comment from "../models/comment.model.js";

export const createComment = async (req, res) => {
    try {
        const { content, postId, userId ,parentId} = req.body;
        
        if(userId !== req.user.id){
          return next(errorHandler(403,"You are not allowed to create this comment"));
        }
            
        const newComment = await Comment({
        content,
        postId,
        userId,
        parentId,
        });
        await newComment.save();
        await Comment.findByIdAndUpdate(parentId, {
            $push: { replies: newComment._id }
          });

        res.status(200).json(newComment);
    } catch (error) {
        next(error);
    }
}


export const getPostComments=async( req,res,next)=>{
    try{
        const comments=await Comment.find({postId:req.params.postId, parentId: null}).sort({createdAt:-1,});  
        res.status(200).json(comments);
    } catch(error){
        next(error);
    }
}

export const likeComment=async(req,res,next)=>{
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return next(errorHandler(404, "Comment not found"));
        }
        const userIndex= comment.likes.indexOf(req.user.id);
        if(userIndex===-1){
        comment.numberOfLikes+=1;
        comment.likes.push(req.user.id);
        }
        else{
        comment.numberOfLikes-=1;
        comment.likes.splice(userIndex,1);
        }
        await comment.save();
        res.status(200).json(comment);
    } catch (error) {
        next(error);
    }
}

export const editComment=async(req,res,next)=>{
    try {
        const comment =await Comment.findById(req.params.commentId);
        if(!comment){
            return next(errorHandler(404,"Comment not found"));
        }
        if(comment.userId !== req.user.id){
            return next(errorHandler(403,"You are not allowed to edit this comment"));
        }
        const editedComment=await Comment.findByIdAndUpdate(req.params.commentId,{
            content:req.body.content,
        },{new:true});
        res.status(200).json(editedComment);
    } catch (error) {
        next(error);
    }
}

async function deleteCommentAndReplies(commentId) {
    const comment =await Comment.findById(commentId);
    if(!comment){
        return next(errorHandler(404,"Comment not found"));
    }
    
    // Remove from parent's replies array if it's a reply
    if (comment.parentId) {
      await Comment.findByIdAndUpdate(comment.parentId, {
        $pull: { replies: comment._id },
      });
    }
  
    // Recursively delete child replies
    for (const replyId of comment.replies) {
      await deleteCommentAndReplies(replyId);
    }
  
    // Finally, delete the comment
    await Comment.findByIdAndDelete(commentId);
  }

 export const deleteComment=async(req,res,next)=>{
    try {
        if( req.params.commentId !== req.user.id && !req.user.isAdmin){
            return next(errorHandler(403,"You are not allowed to delete this comment"));
        }
      
        await deleteCommentAndReplies(req.params.commentId);
       res.status(200).json("Comment has been deleted successfully");
    } catch (error) {
        next(error);
    }
        
}

export const getComments=async(req,res,next)=>{
    if(!req.user.isAdmin){
        return next(errorHandler(403,"You are not allowed to get all comments"));
    }
    try {
        const startIndex=parseInt(req.query.startIndex) || 0;
        const limit=parseInt(req.query.limit) || 9;
        const sortDirection =parseInt(req.query.sort === 'desc' ? -1 : 1);
        const comments=await Comment.find().sort({createdAt:sortDirection}).skip(startIndex).limit(limit);
        const totalComments=await Comment.countDocuments();  
        const now =new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        const lastMonthComments=await Comment.countDocuments({createdAt:{$gte:oneMonthAgo}});
        res.status(200).json({comments,totalComments,lastMonthComments});
    } catch (error) {
        next(error);
    }
}
export const getReplies=async(req,res,next)=>{
    try {
        const replies = await Comment.find({ parentId: req.params.parentId }).sort({ createdAt: -1 });
        res.status(200).json(replies);
      } catch (err) {
        next(err);
      }
}