'use strict';

const router                        = require('express').Router();
const { VisionController }            = require('@api/controller');
const Auth                          = require('@middleware/authorization');

router.post('/',           Auth.isAuthenticated(),       VisionController.create);
router.get('/',            Auth.isAuthenticated(),       VisionController.get);
router.put('/:id',         Auth.isAuthenticated(),       VisionController.update);
router.delete('/:id',      Auth.isAuthenticated(),       VisionController.remove);

module.exports = router;