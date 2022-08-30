'use strict';

const router                        = require('express').Router();
const { ServiceController }         = require('@api/controller');
const Auth                          = require('@middleware/authorization');

router.post('/',           Auth.isAuthenticated(),       ServiceController.create);
router.get('/',            Auth.isAuthenticated(),       ServiceController.get);
router.put('/:id',         Auth.isAuthenticated(),       ServiceController.update);
router.delete('/:id',      Auth.isAuthenticated(),       ServiceController.remove);
router.post('/enquiry',    Auth.isAuthenticated(),       ServiceController.sendEnquiry);
router.put('/enquiry/:id',Auth.isAuthenticated(),       ServiceController.updateEnquiry);
router.get('/enquiry',     Auth.isAuthenticated(),       ServiceController.getEnquiry);

module.exports = router;