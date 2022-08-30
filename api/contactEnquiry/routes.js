'use strict';

const router                        = require('express').Router();
const { ContactEnquiryController }            = require('@api/controller');
const Auth                          = require('@middleware/authorization');

router.post('/',                                         ContactEnquiryController.create);
router.get('/',            Auth.isAuthenticated(),       ContactEnquiryController.get);
router.delete('/:id',      Auth.isAuthenticated(),       ContactEnquiryController.remove);

module.exports = router;