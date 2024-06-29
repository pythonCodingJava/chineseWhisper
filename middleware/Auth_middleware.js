const { verify, decode } = require("jsonwebtoken");


module.exports = async(req,res,next)=>{
    try{
        const token = req.cookies?.uid;
        if(token){
            const status = verify(token,process.env.JWT_SECRET_KEY);
            if(status){
                const data = decode(token);
                req.body.user = data.Username;
                next();
            }else{
                res.status(401).send(JSON.stringify({message:"Invalid cred"}))
            }
        }else{
            res.status(401).send(JSON.stringify({message:"Invalid cred"}))
        }
    }catch(err){
        res.status(401).send(err);
    }
}