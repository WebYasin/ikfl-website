'use strict';

const router                        = require('express').Router();
const { OracleController }          = require('@api/controller');
const Auth                          = require('@middleware/authorization');

router.get('/',                                         OracleController.get);


module.exports = router;