'use strict';

const router                        = require('express').Router();
const { HomeController }            = require('@api/controller');
const Auth                          = require('@middleware/authorization');

router.post('/',                    Auth.isAuthenticated(),       HomeController.create);
router.get('/',                                                   HomeController.get);
router.put('/:id',                  Auth.isAuthenticated(),       HomeController.update);
router.delete('/:id',               Auth.isAuthenticated(),       HomeController.remove);
router.post('/keypoint',            Auth.isAuthenticated(),       HomeController.createKeypoint);
router.get('/keypoint',             Auth.isAuthenticated(),       HomeController.getKeypoint);
router.put('/keypoint/:id',         Auth.isAuthenticated(),       HomeController.updateKeypoint);
router.delete('/keypoint/:id',      Auth.isAuthenticated(),       HomeController.removeKeypoint);

router.get('/benafits',                                           HomeController.getBenafits);
router.post('/benafits',            Auth.isAuthenticated(),       HomeController.createBenafit);
router.put('/benafits/:id',         Auth.isAuthenticated(),       HomeController.updateBenafit);
router.delete('/benafits/:id',      Auth.isAuthenticated(),       HomeController.removeBenafit);

router.get('/home_banner',                                         HomeController.getHomeBanner);
router.post('/home_banner',            Auth.isAuthenticated(),       HomeController.createHomeBanner);
router.put('/home_banner/:id',         Auth.isAuthenticated(),       HomeController.updateHomeBanner);
router.delete('/home_banner/:id',      Auth.isAuthenticated(),       HomeController.removeHomeBanner);

router.get('/partners',                                           HomeController.getParters);
router.post('/partners',            Auth.isAuthenticated(),       HomeController.createPartner);
router.put('/partners/:id',         Auth.isAuthenticated(),       HomeController.updatePartner);
router.delete('/partners/:id',      Auth.isAuthenticated(),       HomeController.removePartner);


router.get('/loanSlider',                                           HomeController.getloanSlider);
router.post('/loanSlider',            Auth.isAuthenticated(),       HomeController.createloanSlider);
router.put('/loanSlider/:id',         Auth.isAuthenticated(),       HomeController.updateloanSlider);
router.delete('/loanSlider/:id',      Auth.isAuthenticated(),       HomeController.removeloanSlider);

router.post('/sentOtp',                                             HomeController.sentOtp);
router.post('/verifyOtp',                                           HomeController.verifyOtp);
router.post('/sentMessage',                                         HomeController.sentMessage);



router.post('/saveapply',                                             HomeController.saveapply);

module.exports = router;