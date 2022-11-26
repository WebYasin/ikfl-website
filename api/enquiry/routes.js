'use strict';

const router                        = require('express').Router();
const { EnquiryController }            = require('@api/controller');
const Auth                          = require('@middleware/authorization');

router.post('/',                                         EnquiryController.create);
router.get('/',                                          EnquiryController.get);
router.put('/:id',         Auth.isAuthenticated(),       EnquiryController.update);
router.delete('/:id',      Auth.isAuthenticated(),       EnquiryController.remove);


router.post('/callEnquiry',                               EnquiryController.createCallEnquiry);

router.get('/getcallenquiry',                             EnquiryController.getCallEnquiry);


module.exports = router;