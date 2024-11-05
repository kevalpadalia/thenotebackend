const fs   = require('fs');
const jwt   = require('jsonwebtoken');

var privateKEY  = fs.readFileSync('./helpers/keys/private.key', 'utf8');
var publicKEY  = fs.readFileSync('./helpers/keys/public.key', 'utf8'); 

module.exports = {
    sign: (payload, $Options) => {
        var signOptions = {
            issuer:  $Options.issuer,
            subject:  $Options.subject,
            audience:  $Options.audience,
            expiresIn:  $Options.expiresIn,
            algorithm:  "RS256",
            notBefore: 0 
        };
        return jwt.sign(payload, privateKEY, signOptions);
    },
    
    verify: (token, $Option) => {
        var verifyOptions = {
            issuer:  $Option.issuer,
            subject:  $Option.subject,
            audience:  $Option.audience,
            expiresIn:  "10d",
            algorithm:  ["RS256"],
            notBefore: 0 
        };
        try {
            return jwt.verify(token, publicKEY, verifyOptions);
        }catch {
            return false;
        }
    },
    
    decode: (token) => {
        return jwt.decode(token, {complete: true});
    }
}

