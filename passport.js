const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const {ExtractJwt}=require('passport-jwt');
const LocalStrategy=require('passport-local').Strategy;
const User =require('./models/User');
const {JWT_SECRET}=require('./config');

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JWT_SECRET
},async(payload,done)=>{
    try {
        const user = await User.findById(payload.sub);
        if(!user){
            return done(null,false);
        }

        done(null,user);
    } catch (error) {
        done(error,false);
    }
}));

passport.use(new LocalStrategy({
    usernameField:'userName'
}, async (userName,password,done) =>{
    try{
        User.getAuthenticated(userName, password, function(err, user, reason) {
            if (err) {
                console.log(err.message);
                return done(err,false);
            };

            // login was successful if we have a user
            if (user) {
                // handle login success
                console.log('login success');
                //console.log(user);
                return done(null,user);
            }

            // otherwise we can determine why we failed
            var reasons = User.failedLogin;
            switch (reason) {
                case reasons.NOT_FOUND:
                case reasons.PASSWORD_INCORRECT:
                    // note: these cases are usually treated the same - don't tell
                    // the user *why* the login failed, only that it did
                    console.log('Password incorrect');
                    return done('Password incorrect',false);
                case reasons.MAX_ATTEMPTS:
                    // send email or otherwise notify user that account is
                    // temporarily locked
                    console.log('Max login attempts reached');
                    return done('Max login attempts reached',false);
                default: return done(null,false);
            }
        });
    } catch(error){
        return done(error,null);
    }
}));