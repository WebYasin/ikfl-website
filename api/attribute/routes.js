'use strict';

const router                        = require('express').Router();
const { AttributeController }       = require('@api/controller');
const Auth                          = require('@middleware/authorization');

router.post('/',           Auth.isAuthenticated(),       AttributeController.create);
router.get('/',            Auth.isAuthenticated(),       AttributeController.get);
router.put('/:id',         Auth.isAuthenticated(),       AttributeController.update);
router.delete('/:id',      Auth.isAuthenticated(),       AttributeController.remove);

module.exports = router;