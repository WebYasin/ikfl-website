'use strict';

const router                        = require('express').Router();
const { EventController }            = require('@api/controller');
const Auth                          = require('@middleware/authorization');

router.post('/',           Auth.isAuthenticated(),       EventController.create);
router.get('/',                                          EventController.get);
router.put('/:id',         Auth.isAuthenticated(),       EventController.update);
router.delete('/:id',      Auth.isAuthenticated(),       EventController.remove);

module.exports = router;