const jwtHelper=require('../helpers/JWTHelper');
const config = require('../config.json');

module.exports.authenticate = (req, res, next) => {
    let token = jwtHelper.verify(req.token, config.signOptions)
    if(token && token.email && token._id){
            req.jwt=req.token
            req.token=token
            next()
    }else{
        res.send(
            {
                status: 'error',
                message: 'Unauthenticated access'
            })
    }
}



