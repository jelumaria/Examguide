const jwt = require('jsonwebtoken')

const jwtMiddleware = (req,res,next)=>{
    console.log("inside jwtmiddleware");
    
//logic autherise user
const token = req.headers["authorization"].split(" ")[1]
console.log(token);
if(token){
    //verify
try{
    const jwtResponse =  jwt.verify(token,process.env.JWTPASSWORD )
    console.log(jwtResponse);
    req.userId = jwtResponse.userId
    next()
}catch(err){
res.status(401).json("autherisation failed ..please login!!")

}

}else{
    res.status(404).json("autherisation failed ..token missing!!")
}
}
module.exports = jwtMiddleware