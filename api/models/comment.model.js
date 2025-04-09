import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true,
    },
    postId:{
        type:String,
        required:true,
    },
    parentId: {
        type: String,
        default: null,
      },
    replies: {
        type:Array,
        default:[],
    },
    userId:{
        type:String,
        required:true,
    },
    likes:{
        type:Array,
        default:[],
    },
    numberOfLikes:{
        type:Number,
        default:0,
    },
  },
    {timestamps:true}

);

const Comment = mongoose.model("Comment",commentSchema);

export default Comment;