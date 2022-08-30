'use strict';

const router                        = require('express').Router();
const { DiscountController }        = require('@api/controller');
const Auth                          = require('@middleware/authorization');

router.post('/',                        Auth.isAuthenticated(),       DiscountController.create);
router.post('/apply-coupon',            Auth.isAuthenticated(),       DiscountController.applyCoupon);
router.get('/',                         Auth.isAuthenticated(),       DiscountController.get);
router.get('/transaction',              Auth.isAuthenticated(),       DiscountController.getDiscountTransaction);
router.put('/:id',                      Auth.isAuthenticated(),       DiscountController.update);
router.delete('/:id',                   Auth.isAuthenticated(),       DiscountController.remove);
router.delete('/remove-coupon/:id',     Auth.isAuthenticated(),       DiscountController.removeCoupon);

module.exports = router;