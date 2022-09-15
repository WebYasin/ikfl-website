'use strict';

const router                        = require('express').Router();
const { PaymentController }            = require('@api/controller');
const Auth                          = require('@middleware/authorization');

router.post('/',                                         PaymentController.create);
router.get('/',            Auth.isAuthenticated(),       PaymentController.get);
router.put('/:id',            Auth.isAuthenticated(),       PaymentController.update);
router.delete('/:id',      Auth.isAuthenticated(),       PaymentController.remove);


module.exports = router;