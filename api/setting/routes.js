'use strict';

const router                        = require('express').Router();
const { SettingController }         = require('@api/controller');
const Auth                          = require('@middleware/authorization');

router.post('/',           Auth.isAuthenticated(),       SettingController.create);
router.get('/',            Auth.isAuthenticated(),       SettingController.get);
router.put('/:id',         Auth.isAuthenticated(),       SettingController.update);
router.delete('/:id',      Auth.isAuthenticated(),       SettingController.remove);



router.post('/meta',           Auth.isAuthenticated(),       SettingController.createMeta);
router.get('/meta',            Auth.isAuthenticated(),       SettingController.getMeta);
router.put('/meta/:id',         Auth.isAuthenticated(),       SettingController.updateMeta);
router.delete('/meta/:id',      Auth.isAuthenticated(),       SettingController.removeMeta);


module.exports = router;