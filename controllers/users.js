const User = require('../models/User');

module.exports = {
    getByUserName: async (req,res,next) => {
        await User.findOne({ userName: req.params.userName }, function(err, user) {
            if (err) return res.json({
                isError: true,
                message: err.message,
                user:null
            });
    
            if (user) {
                return res.json({
                    isError: false,
                    message: 'Ok',
                    user:user
                });
            } else {
                return res.json({
                    isError: false,
                    message: 'not found',
                    user:null
                });
            }
        });
    },

    signUp: async (req,res,next) => {
        const { userName,password,firstName,lastName} = req.value.body;

        let newUser = new User({
            userName,password,firstName,lastName
        });
        await newUser.save(function(err) {
            if (err) {
                console.log(err);
                return res.json({
                    message:err.errmsg,
                    isError:true
                });
            }
        
            console.log(err.message);
                return res.json({
                    message:'register success',
                    isError:false
                });
        });
    },

    signIn: async (req,res,next) => {

        const {userName, password}=req.body;

        // attempt to authenticate user
        User.getAuthenticated(userName, password, function(err, user, reason) {
            if (err) {
                console.log(err.message);
                return res.json({
                    message:err.message,
                    isError:true
                });
            };
    
            // login was successful if we have a user
            if (user) {
                // handle login success
                console.log('login success');
                //console.log(user);
                return res.json({
                    message:'Login success',
                    isError: false
                });
            }
    
            // otherwise we can determine why we failed
            var reasons = User.failedLogin;
            switch (reason) {
                case reasons.NOT_FOUND:
                case reasons.PASSWORD_INCORRECT:
                    // note: these cases are usually treated the same - don't tell
                    // the user *why* the login failed, only that it did
                    console.log('Password incorrect');
                    return res.json({
                        message:'Password incorrect',
                        isError: true
                    });
                case reasons.MAX_ATTEMPTS:
                    // send email or otherwise notify user that account is
                    // temporarily locked
                    console.log('Max login attempts reached');
                    return res.json({
                        message:'Max login attempts reached',
                        isError: true
                    });
                default: break;
            }
        });
    },
};