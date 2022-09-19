'use strict';

const modelName                     = 'ContactEnquiry';
const Joi                           = require('@hapi/joi');
const { ComplainModel,ComplainStatus   }       = require('@database');
const CONSTANT                      = require('@lib/constant');
const UTILS                         = require('@lib/utils');
const FILE_UPLOAD               = require('@lib/file_upload');
const ObjectId                  = require('mongodb').ObjectId;
const ejs                       = require('ejs');
const fs                        = require('fs');
const path                      = require('path');
const moment                    = require('moment');
const mail                      = require('@lib/mailer');

const create = async (req, res, next) => {
    let enquiry = req.body || {};

    enquiry.status = 'pending';
    try {
        const schema = Joi.object({
            loanappid: Joi.string(),
            name: Joi.string().required(),
            phone: Joi.string().required(),
            email: Joi.string().email().required(),
            concern: Joi.string().empty(''),
            address:Joi.string().trim(),
            state:Joi.string().trim(),
            pin:Joi.string().trim(),
            type:Joi.string().required(),
            status: Joi.string().empty(''),
            active: Joi.number().empty(''),
            files: Joi.array()
        });

        const { error } = schema.validate(enquiry);
        if (error) return res.status(400).json({ error });

        
        enquiry = new ComplainModel(enquiry);
        enquiry = await enquiry.save();
          
        if (enquiry.email) {
         
            let compiled = ejs.compile(fs.readFileSync(path.resolve(__dirname, '../../docs/email_templates/complainMail.ejs'), 'utf8')),
                dataToCompile = {
                    loanappid:enquiry.loanappid,
                    email: enquiry.email,
                    phone:enquiry.phone,
                    concern:enquiry.concern,
                    userName: enquiry.name,
                    address:enquiry.address,
                    state:enquiry.state,
                    pin:enquiry.pin,
                };

            await mail.sendMail([process.env.ADMIN_MAIL], `You have new complain #${enquiry.complainId}`, compiled(dataToCompile));
            await mail.sendMail([enquiry.email], `Your Complain is ID #${enquiry.complainId}`, compiled(dataToCompile));
        }


        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: enquiry
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}

const get = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        let where = {};
        if (req.query._id) where._id = req.query._id;
        let record ={ };
        console.log(req.query._id)
         record.complain = await ComplainModel.find(where);
         record.history = await ComplainStatus.find({complainId: {$in :record.complain.map(e => new RegExp(e._id,'i'))}}).sort({createdAt: -1});
        
        return res.status(200).send({ result: record ,status: CONSTANT.REQUESTED_CODES.SUCCESS,});
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const update = async (req, res, next) => {
    try {
        if (!req.params.id) return res.status(400).json({ error: "complain id is required" });
        let about = await FILE_UPLOAD.uploadMultipleFile(req);
        const schema = Joi.object({
            loanappid: Joi.string(),
            name: Joi.string().required(),
            phone: Joi.string().required(),
            email: Joi.string().email().required(),
            address:Joi.string().trim(),
            state:Joi.string().trim(),
            pin:Joi.string().trim(),
            type:Joi.string().required(),
            concern: Joi.string().empty(''),
            status: Joi.string().empty(''),
            active: Joi.number().empty(''),
            files: Joi.array()
        });

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ error });

      
        req.body.updatedBy = req.user._id;
     
        let aboutData = await ComplainModel.updateOne({ _id: req.params.id }, {$set: req.body});
       
        let cmtstatus = '';
        if(aboutData){

            cmtstatus = {
                "complainId":req.params.id,
                "status":req.body.status,
                "comment":req.body.concern
            }
                     
           cmtstatus = new ComplainStatus(cmtstatus);
           cmtstatus = await cmtstatus.save();

        }

        if (!cmtstatus) return res.status(400).json({ error: "complain status update failed" });

        if (!aboutData) return res.status(400).json({ error: "complain update failed" });
        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "complain updated succesfully"
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};



const remove = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required()
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        await ComplainModel.remove({ _id: req.params.id });
        return res.status(200).send({ result: "Contact Enquiry deleted successfully" });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};





const CheckStatus = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        let where = {};
        if (req.params.id) where.complainId = req.params.id;
        let record ={ };
            
         record.complain = await ComplainModel.find(where).limit(1);
         record.history = await ComplainStatus.find({complainId: {$in :record.complain.map(e => new RegExp(e._id,'i'))}}).sort({createdAt: -1});
        
        return res.status(200).send({ result: record ,status: CONSTANT.REQUESTED_CODES.SUCCESS,});
    } catch (error) {
        return res.status(400).json(UsTILS.errorHandler(error));
    }
};


const SendOtp = async (req, res, next) => {
    try {
           
const http = require("https");

const options = {
  "method": "POST",
  "hostname": "api.msg91.com",
  "port": null,
  "path": "/api/v5/flow/",
  "headers": {
    "authkey": "343914ABecqB83V6bZ63199dfeP1",
    "content-type": "application/JSON"
  }
};

const req = http.request(options, function (res) {
  const chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    const body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

// let mobile = req.query.mobile;

req.write(`{\n  \"flow_id\": \"6319a189aed1b13a913072a6\",\n  \"sender\": \"KISANT\",\n  \"short_url\": \"1\",\n  \"mobiles\": \"918800250794\",\n  \"OTP\": \"878765\"\n  \n}`);
req.end();


        return res.status(200).send({ result: 'success' });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};







const contactDetail = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        let query = req.query;
        delete query.pagination;
        delete query.limit;
        let record = { };
        record.heading = await ContactHeadingModel.find({status:1}).sort({createdAt: -1}).limit(limit).skip(pagination*limit).populate('file', 'name original path thumbnail smallFile');
        record.addressList = await AddressModel.find({status:1}).sort({sort_order: 1}).populate('file', 'name original path thumbnail smallFile');
        record.lifeinsurance = await CenterModel.find({status:1})
        .populate('attributes.attributeId', 'name')
        .populate('file', 'name original path thumbnail smallFile')
        .populate('blog', 'name original path thumbnail smallFile');
        record.meta = await MetaModel.find({status:1,link:'contact'}).populate('file', 'name original path thumbnail smallFile');
        record.setting = await SettingModel.find()
            .populate('logo', 'name original path thumbnail smallFile')
            .populate('footer_logo', 'name original path thumbnail smallFile')
            .populate('favicon', 'name original path thumbnail smallFile')
            .populate('default_logo', 'name original path thumbnail smallFile');

         record.productList = await ProductModel.find({status:1}).sort({ createdAt: -1 });
        
        return res.status(200).send({ result: record });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};


module.exports = {
    create,
    get,
    remove,
    update,
    contactDetail,
    CheckStatus,
    SendOtp
};