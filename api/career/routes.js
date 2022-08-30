'use strict';

const router                        = require('express').Router();
const { CareerController }            = require('@api/controller');
const Auth                          = require('@middleware/authorization');

router.post('/',           Auth.isAuthenticated(),       CareerController.create);
router.get('/',                                          CareerController.get);
router.put('/:id',         Auth.isAuthenticated(),       CareerController.update);
router.delete('/:id',      Auth.isAuthenticated(),       CareerController.remove);




router.post('/working',           Auth.isAuthenticated(),       CareerController.createWorking);
router.get('/working',                                          CareerController.getWorking);
router.put('/working/:id',         Auth.isAuthenticated(),       CareerController.updateWorking);
router.delete('/working/:id',      Auth.isAuthenticated(),       CareerController.removeWorking);


router.post('/careerBenafits',           Auth.isAuthenticated(),       CareerController.createBenafits);
router.get('/careerBenafits',                                          CareerController.getBenafits);
router.put('/careerBenafits/:id',         Auth.isAuthenticated(),       CareerController.updateBenafits);
router.delete('/careerBenafits/:id',      Auth.isAuthenticated(),       CareerController.removeBenafits);

router.post('/employee',           Auth.isAuthenticated(),       CareerController.createEmployee);
router.get('/employee',                                          CareerController.getEmployee);
router.put('/employee/:id',         Auth.isAuthenticated(),       CareerController.updateEmployee);
router.delete('/employee/:id',      Auth.isAuthenticated(),       CareerController.removeEmployee);

router.post('/heading',           Auth.isAuthenticated(),       CareerController.createHeading);
router.get('/heading',                                          CareerController.getHeading);
router.put('/heading/:id',         Auth.isAuthenticated(),       CareerController.updateHeading);
router.delete('/heading/:id',      Auth.isAuthenticated(),       CareerController.removeHeading);




module.exports = router;