'use strict';

const router                        = require('express').Router();
const { OrderController }           = require('@api/controller');
const Auth                          = require('@middleware/authorization');

router.post('/',           Auth.isAuthenticated(),       OrderController.create);
router.get('/',            Auth.isAuthenticated(),       OrderController.get);
router.put('/:id',            Auth.isAuthenticated(),       OrderController.update);
router.get('/exportOrder',                                  OrderController.exportOrder);
module.exports = router;