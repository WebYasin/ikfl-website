'use strict';

const modelName                     = 'payment';
const Joi                           = require('@hapi/joi');
const { PaymentModel   }       = require('@database');
const CONSTANT                      = require('@lib/constant');
const UTILS                         = require('@lib/utils');
const FILE_UPLOAD               = require('@lib/file_upload');
const ObjectId                  = require('mongodb').ObjectId;

const create = async (req, res, next) => {
    let payment = req.body || {};

    payment.status = 0;
    try {
        const schema = Joi.object({
            loanappid: Joi.string().required(),
            transaction: Joi.string(),
            paymentType: Joi.string().required(),
            amount: Joi.number().required(),
            name: Joi.string().required(),
            email: Joi.string().required(),
            phone: Joi.number().required(),
            status: Joi.number().empty(''),
            files: Joi.array()
        });

        const { error } = schema.validate(payment);
        if (error) return res.status(400).json({ error });

        
        payment = new PaymentModel(payment);
        payment = await payment.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: payment
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
        if (req.query.id) where._id = req.query.id;
     
        let docs = await PaymentModel.find(where).sort({createdAt: -1}).limit(limit).skip(pagination*limit);
       
        return res.status(200).send({ result: docs,where: req.query.id });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const update = async (req, res, next) => {
    try {
        if (!req.params.id) return res.status(400).json({ error: "Payment id is required" });
        let payment = req.body;
        const schema = Joi.object({
            razorpay:Joi.string().required(),
            status: Joi.number().required(),
        });
            
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ error });

      
       // req.body.updatedBy = req.user._id;
     
        let aboutData = await PaymentModel.updateOne({ _id: req.params.id }, {$set: req.body});
       
        if (!aboutData) return res.status(400).json({ error: "Payment update failed" });
        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Payment updated succesfully"
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

        await PaymentModel.remove({ _id: req.params.id });
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
        if (req.query.id) where.loanappid = req.query.id;
     
        let docs = await ComplainModel.find(where).limit(1);
        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
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