'use strict';

const router                        = require('express').Router();
const { RecommendationController }  = require('@api/controller');
const Auth                          = require('@middleware/authorization');

router.post('/',           Auth.isAuthenticated(),       RecommendationController.create);
router.get('/',            Auth.isAuthenticated(),       RecommendationController.get);
router.put('/:id',         Auth.isAuthenticated(),       RecommendationController.update);
router.delete('/:id',      Auth.isAuthenticated(),       RecommendationController.remove);

module.exports = router;