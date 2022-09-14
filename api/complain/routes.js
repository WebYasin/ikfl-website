'use strict';

const router                        = require('express').Router();
const { ComplainController }            = require('@api/controller');
const Auth                          = require('@middleware/authorization');

router.post('/',                                         ComplainController.create);
router.get('/',            Auth.isAuthenticated(),       ComplainController.get);
router.put('/:id',            Auth.isAuthenticated(),       ComplainController.update);
router.delete('/:id',      Auth.isAuthenticated(),       ComplainController.remove);
router.get('/getData',                                   ComplainController.contactDetail);


router.get('/checkstatus/:id',                           ComplainController.CheckStatus);

router.post('/sendotp',                                   ComplainController.SendOtp);

module.exports = router;