'use strict';

const router                        = require('express').Router();
const { EnquiryController }            = require('@api/controller');
const Auth                          = require('@middleware/authorization');

router.post('/',                                         EnquiryController.create);
router.get('/',            Auth.isAuthenticated(),       EnquiryController.get);
router.put('/:id',         Auth.isAuthenticated(),       EnquiryController.update);
router.delete('/:id',      Auth.isAuthenticated(),       EnquiryController.remove);

module.exports = router;