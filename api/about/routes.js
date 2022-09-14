'use strict';

const router                        = require('express').Router();
const { AboutController }           = require('@api/controller');
const Auth                          = require('@middleware/authorization');

router.post('/',           Auth.isAuthenticated(),       AboutController.create);
router.get('/',                                          AboutController.get);
router.put('/:id',         Auth.isAuthenticated(),       AboutController.update);
router.delete('/:id',      Auth.isAuthenticated(),       AboutController.remove);


router.get('/award',             Auth.isAuthenticated(),       AboutController.getAward);
router.post('/award',            Auth.isAuthenticated(),       AboutController.createAward);
router.put('/award/:id',         Auth.isAuthenticated(),       AboutController.updateAward);
router.delete('/award/:id',      Auth.isAuthenticated(),       AboutController.removeAward);



router.get('/journey',             Auth.isAuthenticated(),       AboutController.getJourney);
router.post('/journey',            Auth.isAuthenticated(),       AboutController.createjourney);
router.put('/journey/:id',         Auth.isAuthenticated(),       AboutController.updatejourney);
router.delete('/journey/:id',      Auth.isAuthenticated(),       AboutController.removejourney);



router.get('/address',             Auth.isAuthenticated(),       AboutController.getAddress);
router.post('/address',            Auth.isAuthenticated(),       AboutController.createAddress);
router.put('/address/:id',         Auth.isAuthenticated(),       AboutController.updateAddress);
router.delete('/address/:id',      Auth.isAuthenticated(),       AboutController.removeAddress);

router.delete('/center/:id',      Auth.isAuthenticated(),       AboutController.removeCenter);

router.get('/download',             Auth.isAuthenticated(),       AboutController.getDownload);
router.post('/download',            Auth.isAuthenticated(),       AboutController.createDownload);
router.put('/download/:id',         Auth.isAuthenticated(),       AboutController.updateDownload);
router.delete('/download/:id',      Auth.isAuthenticated(),       AboutController.removeDownload);

router.get('/charges',             Auth.isAuthenticated(),       AboutController.getCharges);
router.post('/charges',            Auth.isAuthenticated(),       AboutController.createCharges);
router.put('/charges/:id',         Auth.isAuthenticated(),       AboutController.updateCharges);
router.delete('/charges/:id',      Auth.isAuthenticated(),       AboutController.removeCharges);


router.get('/information',             Auth.isAuthenticated(),       AboutController.getInformation);
router.post('/information',            Auth.isAuthenticated(),       AboutController.createInformation);
router.put('/information/:id',         Auth.isAuthenticated(),       AboutController.updateInformation);
router.delete('/information/:id',      Auth.isAuthenticated(),       AboutController.removeInformation);

router.get('/reports',             Auth.isAuthenticated(),       AboutController.getReports);
router.post('/reports',            Auth.isAuthenticated(),       AboutController.createReports);
router.put('/reports/:id',         Auth.isAuthenticated(),       AboutController.updateReports);
router.delete('/reports/:id',      Auth.isAuthenticated(),       AboutController.removeReports);


router.get('/quaterly',             Auth.isAuthenticated(),       AboutController.getQuaterly);
router.post('/quaterly',            Auth.isAuthenticated(),       AboutController.createQuaterly);
router.put('/quaterly/:id',         Auth.isAuthenticated(),       AboutController.updateQuaterly);
router.delete('/quaterly/:id',      Auth.isAuthenticated(),       AboutController.removeQuaterly);

router.get('/gallery',             Auth.isAuthenticated(),       AboutController.getGallery);
router.post('/gallery',            Auth.isAuthenticated(),       AboutController.createGallery);
router.put('/gallery/:id',         Auth.isAuthenticated(),       AboutController.updateGallery);
router.delete('/gallery/:id',      Auth.isAuthenticated(),       AboutController.removeGallery);


router.get('/getData',                                          AboutController.getInformationDetail);
router.get('/getGalleryData',                                   AboutController.getGalleryDetail);


router.get('/financial_year',             Auth.isAuthenticated(),       AboutController.getfinancialYear);
router.post('/financial_year',            Auth.isAuthenticated(),       AboutController.createfinancialYear);
router.put('/financial_year/:id',         Auth.isAuthenticated(),       AboutController.updatefinancialYear);
router.delete('/financial_year/:id',      Auth.isAuthenticated(),       AboutController.removefinancialYear);


router.get('/presentation',             Auth.isAuthenticated(),       AboutController.getPresentation);
router.post('/presentation',            Auth.isAuthenticated(),       AboutController.createPresentation);
router.put('/presentation/:id',         Auth.isAuthenticated(),       AboutController.updatePresentation);
router.delete('/presentation/:id',      Auth.isAuthenticated(),       AboutController.removePresentation);


module.exports = router;