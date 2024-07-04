import { verify, decode } from "jsonwebtoken";


export default async(req,res,next)=>{
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
            res.status(401).send(JSON.stringify({message:"No Token"}))
        }
    }catch(err){
        res.status(401).send(err);
    }
}