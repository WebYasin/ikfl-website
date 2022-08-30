'use strict';

const router                        = require('express').Router();
const { EarningsController }        = require('@api/controller');
const Auth                          = require('@middleware/authorization');

router.post('/',           Auth.isAuthenticated(),       EarningsController.create);
router.get('/',            Auth.isAuthenticated(),       EarningsController.get);
router.put('/:id',         Auth.isAuthenticated(),       EarningsController.update);
router.delete('/:id',      Auth.isAuthenticated(),       EarningsController.remove);

module.exports = router;