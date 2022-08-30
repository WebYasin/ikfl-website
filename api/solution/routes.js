'use strict';

const router                        = require('express').Router();
const { SolutionController }        = require('@api/controller');
const Auth                          = require('@middleware/authorization');

router.post('/',           Auth.isAuthenticated(),       SolutionController.create);
router.get('/',                                          SolutionController.get);
router.put('/:id',         Auth.isAuthenticated(),       SolutionController.update);
router.delete('/:id',      Auth.isAuthenticated(),       SolutionController.remove);

module.exports = router;