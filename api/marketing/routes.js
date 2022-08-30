'use strict';

const router                        = require('express').Router();
const { MarketingController }       = require('@api/controller');
const Auth                          = require('@middleware/authorization');

router.post('/',                      Auth.isAuthenticated(),       MarketingController.create);
router.get('/',                       Auth.isAuthenticated(),       MarketingController.get);
router.put('/:id',                    Auth.isAuthenticated(),       MarketingController.update);

router.post('/subcategory',           Auth.isAuthenticated(),       MarketingController.createSubCategory);
router.get('/subcategory',            Auth.isAuthenticated(),       MarketingController.getSubCategory);
router.put('/subcategory/:id',        Auth.isAuthenticated(),       MarketingController.updateSubCategory);

module.exports = router;