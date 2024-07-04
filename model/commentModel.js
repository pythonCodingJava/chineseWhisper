const mongoose = require('mongoose')

const comment = new mongoose.Schema({
    body:{
        type:String,
        required:true
    },
    from:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    to:{
        type:mongoose.Schema.Types.ObjectId,
        refPath:"postedFor",
        required:true
    },
    postedFor:{
        type:String,
        enum:['Forum', 'Comment']
    },
    tier:{
        type:Number,
        required:true
    },
    likes:{
        type:[mongoose.Schema.Types.ObjectId],
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    replies:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Comment"
    }
}, {collection:"Comments"});

comment.path('date').default(new Date())
comment.path('tier').default(1);

module.exports = mongoose.model("Comment", comment);