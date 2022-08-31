'use strict';

const router                        = require('express').Router();
const { FaqController }            = require('@api/controller');
const Auth                          = require('@middleware/authorization');

router.post('/',           Auth.isAuthenticated(),       FaqController.create);
router.get('/',                                          FaqController.get);
router.put('/:id',         Auth.isAuthenticated(),       FaqController.update);
router.delete('/:id',      Auth.isAuthenticated(),       FaqController.remove);

module.exports = router;