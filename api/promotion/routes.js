'use strict';

const router                        = require('express').Router();
const { PromotionController }        = require('@api/controller');
const Auth                          = require('@middleware/authorization');

router.post('/',                  Auth.isAuthenticated(), PromotionController.create);
router.get('/',                   Auth.isAuthenticated(), PromotionController.get);
router.put('/:id',                Auth.isAuthenticated(), PromotionController.update);
router.delete('/:id',             Auth.isAuthenticated(), PromotionController.remove);

module.exports = router;