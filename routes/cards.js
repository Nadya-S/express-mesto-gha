const router = require('express').Router();
const { createCardValidator, idValidator } = require('../middlewares/validation');
const {
  findAllCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', findAllCards);
router.post('/', createCardValidator, createCard);
router.delete('/:_id', idValidator, deleteCardById);
router.put('/:_id/likes', idValidator, likeCard);
router.delete('/:_id/likes', idValidator, dislikeCard);
module.exports = router;
