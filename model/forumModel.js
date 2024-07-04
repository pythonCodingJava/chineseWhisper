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
    category:{
        type:Number,
        required:true
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    likes:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'User',
        required:true
    },
    comments: {
        type:[mongoose.Schema.Types.ObjectId],
        ref:'Comment'
    }
}, {collection:"Forums"});

ForumSchema.path('createdAt').default(new Date())
ForumSchema.path('category').default(1)

module.exports = mongoose.model('Forum',ForumSchema);