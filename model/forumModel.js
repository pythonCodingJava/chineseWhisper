const mongoose = require('mongoose')

const ForumSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
    },
    createdAt:{
        type:Date,
        required:true
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    likes:{
        type:Number,
        required:true
    },
    dislikes:{
        type:Number,
        required:true
    },
    comments: {
        type:[mongoose.Schema.Types.ObjectId],
        ref:'Comment'
    }
}, {collection:"Forums"});

ForumSchema.path('createdAt').default(new Date())
ForumSchema.path('likes').default(0);
ForumSchema.path('dislikes').default(0);

module.exports = mongoose.model('Forum',ForumSchema);