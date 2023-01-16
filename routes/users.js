const router = require('express').Router();
const { idValidator, updateProfileValidator, updateAvatarValidator } = require('../middlewares/validation');
const {
  findByIdUser,
  findAllUsers,
  findMyProfile,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/', findAllUsers); // найти всех пользователей
router.get('/me', findMyProfile); // найти мой профиль
router.get('/:_id', idValidator, findByIdUser); // найти профиль по айди
router.patch('/me', updateProfileValidator, updateProfile); // обновить данные профиля
router.patch('/me/avatar', updateAvatarValidator, updateAvatar); // обновить аватар

module.exports = router;
