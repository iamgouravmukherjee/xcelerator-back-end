 const mongoose = require('mongoose');

 const postSchema = new mongoose.Schema({
   "userId": {
      type: Number,
      required: true
   },
    "id": {
       type: Number,
       required: true
    },
    "title": {
       type: String,
       required: true
    },
    "body":{
      type: String,
      required: true
    },
    liked: {
       type: Boolean,
      default: false
    },
    disliked: {
       type: Boolean,
      default: false
    },
    bookmarked: {
       type: Boolean,
      default: false
    },
    imageUrl: {
       type: String,
       required: true
    }
 })

 const postModel = mongoose.model('posts', postSchema)

 module.exports = postModel;