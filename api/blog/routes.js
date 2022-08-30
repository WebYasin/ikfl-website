'use strict';

const router                        = require('express').Router();
const { BlogController }            = require('@api/controller');
const Auth                          = require('@middleware/authorization');

router.post('/',           Auth.isAuthenticated(),       BlogController.create);
router.get('/',                                          BlogController.get);
router.put('/:id',         Auth.isAuthenticated(),       BlogController.update);
router.delete('/:id',      Auth.isAuthenticated(),       BlogController.remove);

module.exports = router;