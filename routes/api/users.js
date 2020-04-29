const router = require('express-promise-router')();
const UsersController = require('../../controllers/users');
const {validateBody, schemas}=require('../../helpers/routeHelpers');

// @route POST api/users/signin
router.route('/signin').post(UsersController.signIn);

// @route POST api/users/signup
router.route('/signup').post(validateBody(schemas.authSchema), UsersController.signUp);