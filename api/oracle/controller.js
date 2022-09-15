'use strict';

const modelName                 = 'Oracle';
const Joi                       = require('@hapi/joi');
const {AboutModel }             = require('@database');
const CONSTANT                  = require('@lib/constant'); 
const UTILS                     = require('@lib/utils');
const FILE_UPLOAD               = require('@lib/file_upload');
const oracledb                  = require('@lib/oracledb');
const oracledbConn              = require('../../lib/oracledb');
const ObjectId                  = require('mongodb').ObjectId;
      


const get = async (req, res, next) => {
    try {
        
        let query = req.query;
        let conn = await oracledbConn.connect();
      
        let docs = await conn.execute(`select 
        "Application Received Date",
        "Branch Name",
        "Product",
        "Loan Purpose Description",
        "Loan Amount Requested",
        "Net LTV",
        "Loan Application Type",
        "Customer Name",
        "ASSET_MODEL",
        "Application Number",
        PI.AGE
        from IF_NEO_CAS_LMS.APPLICATION_DETAILS_MV LEFT JOIN IF_NEO_CAS_LMS.Loan_application LA ON
        LA.APPLICATION_NUMBER = IF_NEO_CAS_LMS.APPLICATION_DETAILS_MV."Application Number" LEFT JOIN IF_NEO_CAS_LMS.party PD ON
        PD.LOAN_APPLICATION_FK = LA.ID LEFT JOIN IF_NEO_CAS_LMS.customer CD ON
        CD.ID = PD.CUSTOMER LEFT JOIN IF_NEO_CAS_LMS.person_info PI ON
        PI.ID = CD.PERSON_INFO  where "Application Number" = '${query.applicationNumber}' AND PD.PARTY_ROLE=0`);
       
        let rowsdata = docs.rows[0];
        if(!rowsdata) return res.status(400).json({result:"Application number is not found",status:"Error"});
       
        return res.status(200).send({ result: "Application Number is found" ,status: CONSTANT.REQUESTED_CODES.SUCCESS});
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

module.exports = {
    get
};