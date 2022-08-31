'use strict';

const modelName                     = 'Faq';
const Joi                           = require('@hapi/joi');
const { FaqModel,CenterModel,SettingModel,MetaModel,FaqCategoryModel }                  = require('@database');
const CONSTANT                      = require('@lib/constant');
const UTILS                         = require('@lib/utils');

const create = async (req, res, next) => {
    let faq = req.body || {};
    faq.active = true;
    console.log(req);
    try {
        const schema = Joi.object({
            heading: Joi.string().required(),
            description: Joi.string().required(),
            active: Joi.boolean()
        });

        const { error } = schema.validate(faq);
        if (error) return res.status(400).json({ error });

        faq.createdBy = req.user._id;
        faq.updatedBy = req.user._id;
        faq = new FaqModel(faq);
        faq = await faq.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: faq
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}

const get = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        let record = {};

         record.faqCategory = await FaqCategoryModel.aggregate([
               
            { $lookup: {
                  from: "faqs",
                  localField: "_id",
                  foreignField: "category",
                  as: "faqDetails"
            }},
          { $skip: (pagination*limit) },
          { $sort : { createdAt: -1} },
          { $limit: limit },
         
         ])
        
        
         record.lifeinsurance = await CenterModel.find({status:1}).sort({ createdAt: -1 })
         .populate('attributes.attributeId', 'name')
         .populate('file', 'name original path thumbnail smallFile')
         .populate('blog', 'name original path thumbnail smallFile');
       
       
         record.meta = await MetaModel.find({status:1,link:'faq'}).populate('file', 'name original path thumbnail smallFile');
      
         record.setting = await SettingModel.find()
         .populate('logo', 'name original path thumbnail smallFile')
         .populate('footer_logo', 'name original path thumbnail smallFile')
         .populate('favicon', 'name original path thumbnail smallFile')
         .populate('default_logo', 'name original path thumbnail smallFile');
      
      
         return res.status(200).send({ result: record });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const update = async (req, res, next) => {
    try {
        if (!req.params.id) return res.status(400).json({ error: "Faq id is required" });

        const schema = Joi.object({
            heading: Joi.string().required(),
            description: Joi.string().required(),
            active: Joi.boolean()
        });

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ error });

        req.body.updatedBy = req.user._id;
        let faq = await FaqModel.updateOne({ _id: req.params.id }, { $set: req.body });
        if (!faq) return res.status(400).json({ error: "Faq update failed" });

        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Faq updated succesfully"
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

        await FaqModel.remove({ _id: req.params.id });
        return res.status(200).send({ result: "Faq deleted successfully" });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

module.exports = {
    create,
    get,
    update,
    remove
};