'use strict';

const modelName                 = 'Marketing';
const Joi                       = require('@hapi/joi');
const { MarketingModel ,
    marketingSubCategoryModel,FileModel } = require('@database');
const CONSTANT                  = require('@lib/constant');
const UTILS                     = require('@lib/utils');
const FILE_UPLOAD               = require('@lib/file_upload');
var mongoose                    = require('mongoose');

const create = async (req, res, next) => {
    let marketingCategory        = await FILE_UPLOAD.uploadMultipleFile(req);
    marketingCategory.active     = true;
   
    try {
        const schema = Joi.object({
            name: Joi.string().required(),
            files: Joi.array(),
            active: Joi.boolean().required(),
            customFields: Joi.object()
        });
    
        const { error } = schema.validate(marketingCategory);
        if (error) return res.status(400).json({ error });

        if (marketingCategory.files.length) marketingCategory.files = marketingCategory.files.map(file => file._id);
        else delete marketingCategory.files;
        
        marketingCategory.createdBy = req.user._id;
        marketingCategory.updatedBy = req.user._id;

        let docs = await MarketingModel.find({"name": marketingCategory.name});
       
        if(docs.length > 0){
            return res.status(400).json({error: "category name is already exist"});
        }
        marketingCategory = new MarketingModel(marketingCategory);
        marketingCategory = await marketingCategory.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: marketingCategory
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}

const get = async (req, res, next) => {
    try {
        // console.log(req.query);
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        let query = req.query;
        // if (query.name) query.name = new RegExp(query.name, "i");
        // delete query.pagination;
        // delete query.limit;
        //let docs = await MarketingModel.find(query).sort({createdAt: -1}).populate('files', 'name original path thumbnail smallFile');
       
       const docs= await MarketingModel.aggregate([
        //    {$match:query},
           {
            $lookup: {
             from: 'marketingsubcategories',
             let: {categoryID: '$_id'},
             pipeline: [
                 { $match: 
                    { $expr: 
                        { $and:
                            [
                                { $eq :["$category", "$$categoryID"]},
                                
                            ]

                        }
                    }
                }
            ],
              as: 'SubCategory'
            }}]);
           await FileModel.populate(docs,{path:"files"});
           
        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const update = async (req, res, next) => {
    
    try {
        if (!req.params.id) return res.status(400).json({error: "Marketing Category id is required"});
        let marketingCategory = await FILE_UPLOAD.uploadMultipleFile(req);
        const schema = Joi.object({
            name: Joi.string(),
            files: Joi.array(),
            active: Joi.boolean(),
            customFields: Joi.object()
        });

        const { error } = schema.validate(marketingCategory);
        if (error) return res.status(400).json({ error });

        marketingCategory.updatedBy = req.user._id;
        const updateData = Object.assign({}, marketingCategory);
        if (marketingCategory.files.length) updateData.files = marketingCategory.files.map(file => file._id);
        else delete updateData.files;

        let marketingCategoryRec = await MarketingModel.findOneAndUpdate({ _id: req.params.id }, { $set: updateData }, {returnOriginal: false});
        if (!marketingCategoryRec) return res.status(400).json({ error: "Category update failed" });

        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Category updated succesfully"
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const createSubCategory = async (req, res, next) => {
    let marketingSubCategory        = req.body;
    marketingSubCategory.active     = true;
   
    try {
        const schema = Joi.object({
            name: Joi.string().required(),
            category: Joi.string().required(),
            active: Joi.boolean().required(),
            customFields: Joi.object()
        });
    
        const { error } = schema.validate(marketingSubCategory);
        if (error) return res.status(400).json({ error });

       
        marketingSubCategory.createdBy = req.user._id;
        marketingSubCategory.updatedBy = req.user._id;

        marketingSubCategory = new marketingSubCategoryModel(marketingSubCategory);
        marketingSubCategory = await marketingSubCategory.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: marketingSubCategory
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}

const getSubCategory = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        let query = req.query;
        if (query.name) query.name = new RegExp(query.name, "i");
        delete query.pagination;
        delete query.limit;

        let docs = await marketingSubCategoryModel.find(query).sort({createdAt: -1}).populate("category",'name');
        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const updateSubCategory = async (req, res, next) => {
    
    try {
        if (!req.params.id) return res.status(400).json({error: "Marketing Sub Category id is required"});
       let marketingSubCategory = req.body;
        const schema = Joi.object({
            name: Joi.string(),
            category: Joi.string(),
            active: Joi.boolean(),
            customFields: Joi.object()
        });

        const { error } = schema.validate(marketingSubCategory);
        if (error) return res.status(400).json({ error });

        marketingSubCategory.updatedBy = req.user._id;
        const updateData = Object.assign({}, marketingSubCategory);
       
        let marketingSubCategoryRec = await marketingSubCategoryModel.findOneAndUpdate({ _id: req.params.id }, { $set: updateData }, {returnOriginal: false});
        if (!marketingSubCategoryRec) return res.status(400).json({ error: "Sub Category update failed" });

        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Sub Category updated succesfully"
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

// const remove = async (req, res, next) => {
//     try {
//         const schema = Joi.object({
//             id: Joi.string().required()
//         });

//         const { error } = schema.validate(req.params);
//         if (error) return res.status(400).json({ error });

//         await MarketingModel.remove({_id: req.params.id});
//         return res.status(200).send({ result: "Category deleted successfully" });
//     } catch (error) {
//         return res.status(400).json(UTILS.errorHandler(error));
//     }
// };

module.exports = {
    create,
    get,
    update,
    createSubCategory,
    getSubCategory,
    updateSubCategory
    
};