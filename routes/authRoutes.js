const { Router } = require("express");

const router = Router();
const authController = require('../controllers/authController')

//our authentication routes
//we used MVC so functionality in a controller
router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);

module.exports = router;