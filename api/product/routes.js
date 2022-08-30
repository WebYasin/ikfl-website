'use strict';

const router                        = require('express').Router();
const { ProductController }         = require('@api/controller');
const Auth                          = require('@middleware/authorization');

router.post('/',                    Auth.isAuthenticated(),       ProductController.create);
router.get('/',                                                   ProductController.get);
router.put('/:id',                  Auth.isAuthenticated(),       ProductController.update);
router.delete('/:id',               Auth.isAuthenticated(),       ProductController.remove);
router.delete('/:id/:fileId',       Auth.isAuthenticated(),       ProductController.remove);




router.post('/feature',                    Auth.isAuthenticated(),       ProductController.createFeature);
router.get('/feature',                                                   ProductController.getFeature);
router.put('/feature/:id',                  Auth.isAuthenticated(),       ProductController.updateFeature);
router.delete('/feature/:id',               Auth.isAuthenticated(),       ProductController.removeFeature);


router.post('/center',                    Auth.isAuthenticated(),       ProductController.createcenter);
router.get('/center',                                                   ProductController.getcenter);
router.put('/center/:id',                  Auth.isAuthenticated(),       ProductController.updatecenter);


router.get('/customersection',                                           ProductController.getCustomerSection);



module.exports = router;