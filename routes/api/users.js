const router = require('express-promise-router')();
const UsersController = require('../../controllers/users');
const passport  = require('passport');
require('../../passport');

const {validateBody, schemas}=require('../../helpers/routeHelpers');
const passportSignIn=passport.authenticate('local',{session:false});
const passportJwt = passport.authenticate('jwt',{session:false});

// @route POST api/users/signup
router.route('/signup').post(validateBody(schemas.authSchema), UsersController.signUp);

// @route POST api/users/signin
router.route('/signin').post(passportSignIn,UsersController.signIn);

router.route('/byUserName/:userName').get(UsersController.getByUserName);

router.route('/secret').get(passportJwt, UsersController.secret);

router.route('/logout').get(UsersController.logOut);

// @route GET api/users/byid/:id
router.route('/byid/:id').get(passportJwt,UsersController.getById);

module.exports=router;  