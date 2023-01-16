const router = require('express').Router();
const { loginValidator, createUserValidator } = require('../middlewares/validation');
const { login, createUser } = require('../controllers/auth');

router.post('/signin', loginValidator, login); // вход
router.post('/signup', createUserValidator, createUser); // регистрация

module.exports = router;
