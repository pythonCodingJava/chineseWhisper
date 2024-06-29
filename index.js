
const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/userRoutes.js')
const actionRouter = require('./routes/actionRoutes.js')
const forum = require('./model/forumModel.js')
const user = require('./model/userModel.js');
const comment = require('./model/commentModel.js');
const Auth_middleware = require('./middleware/Auth_middleware.js');


require('dotenv').config();

const server = express();

mongoose.connect(process.env.DBURL, {
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(function(){
    console.log('connected to database');
}).catch((err)=>{
    console.log(err.message);
});

const addForum = async ()=>{

    const person = await user.findOne({Username:'admin'});
    const post = await forum.findOne({_id:"667bec082768cf755fdac0a7"});
    const cmnttoedit = await comment.findOne({_id:"667c464116c86699f944df69"})
    const cmnt = new comment({
        body:"indeed",
        from:person,
        to:post,
        tier:2
    });
    await cmnt.save();
    cmnttoedit.replies.push(cmnt);
    await cmnttoedit.save();
}

server.use(require('cors')({
    origin:'http://localhost:5174',
    credentials:true
}));

server.use(express.json());
server.use(require('cookie-parser')())
server.use("/", router);
server.use("/content/action/", Auth_middleware ,actionRouter);

server.listen(process.env.PORT, ()=>{
    console.log(`Server started on port ${process.env.PORT}`);
});