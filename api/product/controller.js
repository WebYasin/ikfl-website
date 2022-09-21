'use strict';

const modelName                 = 'Product';
const Joi                       = require('@hapi/joi');
const { ProductModel,
    UserModel,
    NotificationModel,
    ProductFeatureModel,
    CenterModel,
    TestimonialModel,
    DownloadModel,
    ChargesModel,
    SettingModel,
    ReviewModel }               = require('@database');
const CONSTANT                  = require('@lib/constant');
const UTILS                     = require('@lib/utils');
const FILE_UPLOAD               = require('@lib/file_upload');
const moment                    = require('moment');
const _                         = require('lodash');
const ObjectId                  = require('mongodb').ObjectId;

const create = async (req, res, next) => {
    let product = await FILE_UPLOAD.uploadMultipleFile(req);
    
    try {

        const schema = Joi.object({
            name: Joi.string().required(),
            description: Joi.string().empty(''),
            product_description: Joi.string().empty(''),
            meta_title: Joi.string().empty(''),
            meta_description: Joi.string().empty(''),
            meta_keyword: Joi.string().empty(''),
            etitle: Joi.string().empty(''),
            htitle: Joi.string().empty(''),
            hdescription: Joi.string().empty(''),
            ltitle: Joi.string().empty(''),
            ldescription: Joi.string().empty(''),
            show_home: Joi.number().empty(''),
            slug: Joi.string().empty(''),
            eligibility: Joi.string().empty(''),
            applyheading: Joi.string().empty(''),
            lifeinsurance: Joi.string().empty(''),
            files: Joi.array(),
            status: Joi.number().empty(''),
            sort_order: Joi.number().empty(''),
            createdBy: Joi.string(),
            customFields: Joi.object()
        });
        const { error } = schema.validate(product);
        if (error) return res.status(400).json({ error });

        let files = product.files;
        if (files.length) {
            product.file = files.filter(e => e.fieldName == 'file').map(file => file._id);
            product.blog = files.filter(e => e.fieldName == 'blog').map(file => file._id);
            product.banner_img = files.filter(e => e.fieldName == 'banner_img').map(file => file._id);
            product.eligible_img = files.filter(e => e.fieldName == 'eligible_img').map(file => file._id);
            product.insurance_img = files.filter(e => e.fieldName == 'insurance_img').map(file => file._id);

        } else delete product.files;

        product.createdBy = req.user._id;
        product.updatedBy = req.user._id;

        product = new ProductModel(product);
        product = await product.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: product
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}

const get = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : '');
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        const rating = req.query.rating;
        let query = req.query;
        if (req.query.category) query['category'] = { $in: req.query.category.split(",") };
        // if (req.query.minPrice && req.query.maxPrice) query['price'] = {$gte: parseInt(req.query.minPrice), $lte: parseInt(req.query.maxPrice)};
        // if (query.search) {
        //     query['$or'] = [
        //         {name: new RegExp(query.search, "i")},
        //         {productId: new RegExp(query.search, "i")}
        //     ];
        // }

        // delete query.search;
        delete query.pagination;
        delete query.limit;
  
        const productsCount = await ProductModel.countDocuments(query);

        let docs = await ProductModel.find(query).sort({ createdAt: -1 })
            .limit(limit).skip(pagination * limit)
            .populate('file', 'name original path thumbnail smallFile')
            .populate('blog', 'name original path thumbnail smallFile')
            .populate('banner_img', 'name original path thumbnail smallFile')
            .populate('eligible_img', 'name original path thumbnail smallFile')
            .populate('insurance_img', 'name original path thumbnail smallFile');

        return res.status(200).send({ result: docs, count: productsCount });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};


const getCustomerSection = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        let query = req.query;
        delete query.pagination;
        delete query.limit;
        let record = { };
        record.heading       = await CenterModel.find({status:1}).sort({createdAt: -1})
        .populate('attributes.attributeId', 'name')
        .populate('file', 'name original path thumbnail smallFile')
        .populate('blog', 'name original path thumbnail smallFile');

   
        record.downloadList = await DownloadModel.find({status:1}).sort({createdAt: -1}).populate('file', 'name original path thumbnail smallFile');

        record.testimonials = await TestimonialModel.find({status:1}).sort({sort_order: 1}).populate('files', 'name original path thumbnail smallFile');

        record.sheduleCharges = await ChargesModel.find({status:1}).sort({sort_order: 1});
      
        record.setting = await SettingModel.find(query).sort({ createdAt: -1 })
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
    let product = await FILE_UPLOAD.uploadMultipleFile(req);

    try {
        if (!req.params.id) return res.status(400).json({ error: "Product id is required" });

        const schema = Joi.object({
            name: Joi.string().required(),
            description: Joi.string().empty(''),
            product_description: Joi.string().empty(''),
            meta_title: Joi.string().empty(''),
            meta_description: Joi.string().empty(''),
            meta_keyword: Joi.string().empty(''),
            etitle: Joi.string().empty(''),
            htitle: Joi.string().empty(''),
            hdescription: Joi.string().empty(''),
            ltitle: Joi.string().empty(''),
            ldescription: Joi.string().empty(''),
            show_home: Joi.number().empty(''),
            slug: Joi.string().empty(''),
            eligibility: Joi.string().empty(''),
            applyheading: Joi.string().empty(''),
            lifeinsurance: Joi.string().empty(''),
            files: Joi.array(),
            status: Joi.number().empty(''),
            sort_order: Joi.number().empty(''),
            createdBy: Joi.string(),
            customFields: Joi.object()
        });

        const { error } = schema.validate(product);
        if (error) return res.status(400).json({ error });

        let files = product.files;
        if (files.length) {
            product.file = files.filter(e => e.fieldName == 'file').map(file => file._id);
            product.blog = files.filter(e => e.fieldName == 'blog').map(file => file._id);
            product.banner_img = files.filter(e => e.fieldName == 'banner').map(file => file._id);
            product.eligible_img = files.filter(e => e.fieldName == 'carcass').map(file => file._id);
            product.insurance_img = files.filter(e => e.fieldName == 'coverPhoto').map(file => file._id);
        }
         delete product.files;
        
        
        if(product.file && product.file.length < 1) delete product.file;
        if(product.blog && product.blog.length < 1) delete product.blog;
        if(product.banner_img && product.banner_img.length < 1) delete product.banner_img;
        if(product.eligible_img && product.eligible_img.length < 1) delete product.eligible_img;
        if(product.insurance_img && product.insurance_img.length < 1) delete product.insurance_img;
        product.updatedBy = req.user._id;
       

        let productRec = await ProductModel.updateOne({ _id: req.params.id }, {$set: product });
        if (!productRec) return res.status(400).json({ error: "Product update failed" });

        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Product updated succesfully"
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const remove = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required(),
            fileId: Joi.string()
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        if (req.params.fileId) await ProductModel.updateOne({ _id: req.params.id }, { $pull: { files: req.params.fileId } });
        else await ProductModel.remove({ _id: req.params.id });

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Product Deleted succesfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};


const createFeature = async (req, res, next) => {
    let product = await FILE_UPLOAD.uploadMultipleFile(req);
    
    try {

        const schema = Joi.object({
            product: Joi.string().required(),
            title: Joi.string().required(),
            description: Joi.string().empty(''),
            files: Joi.array(),
            status: Joi.number().empty(''),
            sort_order: Joi.number().empty(''),
            createdBy: Joi.string(),
            customFields: Joi.object()
        });
        const { error } = schema.validate(product);
        if (error) return res.status(400).json({ error });

        let files = product.files;
        if (files.length) {
            product.file = files.filter(e => e.fieldName == 'file').map(file => file._id);
           
        } else delete product.files;

        product.createdBy = req.user._id;
        product.updatedBy = req.user._id;

        product = new ProductFeatureModel(product);
        product = await product.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: product
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}

const getFeature = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        const rating = req.query.rating;
        let query = req.query;
        if (req.query.category) query['category'] = { $in: req.query.category.split(",") };

        delete query.pagination;
        delete query.limit;

        let docs = await ProductFeatureModel.find(query).sort({ createdAt: -1 })
            .limit(limit).skip(pagination * limit)
            .populate('file', 'name original path thumbnail smallFile')
            .populate('product','_id name');
        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const updateFeature = async (req, res, next) => {
    let product = await FILE_UPLOAD.uploadMultipleFile(req);

    try {
        if (!req.params.id) return res.status(400).json({ error: "Product id is required" });

        const schema = Joi.object({
            product: Joi.string().required(),
            title: Joi.string().required(),
            description: Joi.string().empty(''),
            files: Joi.array(),
            status: Joi.number().empty(''),
            sort_order: Joi.number().empty(''),
            createdBy: Joi.string(),
            customFields: Joi.object()
        });

        const { error } = schema.validate(product);
        if (error) return res.status(400).json({ error });

        let files = product.files;
        if (files.length) {
            product.file = files.filter(e => e.fieldName == 'file').map(file => file._id);
      
        }
         delete product.files;
        
        
        if(product.file && product.file.length < 1) delete product.file;
        
        product.updatedBy = req.user._id;
       

        let productRec = await ProductFeatureModel.updateOne({ _id: req.params.id }, {$set: product });
        if (!productRec) return res.status(400).json({ error: "Product feature update failed" });

        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Product updated succesfully"
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const removeFeature = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required(),
            fileId: Joi.string()
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        if (req.params.fileId) await ProductFeatureModel.updateOne({ _id: req.params.id }, { $pull: { files: req.params.fileId } });
        else await ProductFeatureModel.remove({ _id: req.params.id });

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Product Feature Deleted succesfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};



// information center

const createcenter = async (req, res, next) => {
    let product = await FILE_UPLOAD.uploadMultipleFile(req);
    
    try {

        const schema = Joi.object({
            name: Joi.string().required(),
            description: Joi.string().empty(''),
            center_description: Joi.string().empty(''),
            meta_title: Joi.string().empty(''),
            meta_description: Joi.string().empty(''),
            meta_keyword: Joi.string().empty(''),
            dtitle: Joi.string().empty(''),
            ddescription: Joi.string().empty(''),
            imtitle: Joi.string().empty(''),
            imdescription: Joi.string().empty(''),
            ctitle: Joi.string().empty(''),
            cdescription: Joi.string().empty(''),
            otitle: Joi.string().empty(''),
            odescription: Joi.string().empty(''),
            obtn_name: Joi.string().empty(''),
            obtn_link: Joi.string().empty(''),

            stitle: Joi.string().empty(''),
            cttitle: Joi.string().empty(''),
            ctdescription: Joi.string().empty(''),
            ltitle: Joi.string().empty(''),
            ldescription: Joi.string().empty(''),
         
            eligibility: Joi.string().empty(''),
            applyheading: Joi.string().empty(''),
            lifeinsurance: Joi.string().empty(''),
            files: Joi.array(),
            status: Joi.number().empty(''),
            sort_order: Joi.number().empty(''),
            createdBy: Joi.string(),
            customFields: Joi.object()
        });
        const { error } = schema.validate(product);
        if (error) return res.status(400).json({ error });

        let files = product.files;
        if (files.length) {
            product.file = files.filter(e => e.fieldName == 'file').map(file => file._id);
            product.blog = files.filter(e => e.fieldName == 'blog').map(file => file._id);
           

        } else delete product.files;

        product.createdBy = req.user._id;
        product.updatedBy = req.user._id;

        product = new CenterModel(product);
        product = await product.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: product
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}

const getcenter = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        const rating = req.query.rating;
        let query = req.query;

        let docs = await CenterModel.find(query).sort({ createdAt: -1 })
            .populate('attributes.attributeId', 'name')
            .populate('file', 'name original path thumbnail smallFile')
            .populate('blog', 'name original path thumbnail smallFile');

        return res.status(200).send({ result: docs});
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const updatecenter = async (req, res, next) => {
    let product = await FILE_UPLOAD.uploadMultipleFile(req);

    try {
        if (!req.params.id) return res.status(400).json({ error: "Product id is required" });

        const schema = Joi.object({
            name: Joi.string().required(),
            description: Joi.string().empty(''),
            center_description: Joi.string().empty(''),
            meta_title: Joi.string().empty(''),
            meta_description: Joi.string().empty(''),
            meta_keyword: Joi.string().empty(''),
            dtitle: Joi.string().empty(''),
            ddescription: Joi.string().empty(''),
            imtitle: Joi.string().empty(''),
            imdescription: Joi.string().empty(''),
            ctitle: Joi.string().empty(''),
            cdescription: Joi.string().empty(''),
            otitle: Joi.string().empty(''),
            odescription: Joi.string().empty(''),
            obtn_name: Joi.string().empty(''),
            obtn_link: Joi.string().empty(''),

            stitle: Joi.string().empty(''),
            cttitle: Joi.string().empty(''),
            ctdescription: Joi.string().empty(''),
            ltitle: Joi.string().empty(''),
            ldescription: Joi.string().empty(''),
         
            eligibility: Joi.string().empty(''),
            applyheading: Joi.string().empty(''),
            lifeinsurance: Joi.string().empty(''),
            files: Joi.array(),
            status: Joi.number().empty(''),
            sort_order: Joi.number().empty(''),
            createdBy: Joi.string(),
            customFields: Joi.object()
        });

        const { error } = schema.validate(product);
        if (error) return res.status(400).json({ error });

        let files = product.files;
        if (files.length) {
            product.file = files.filter(e => e.fieldName == 'file').map(file => file._id);
            product.blog = files.filter(e => e.fieldName == 'blog').map(file => file._id);
    
        }
         delete product.files;
        
        
        if(product.file && product.file.length < 1) delete product.file;
        if(product.blog && product.blog.length < 1) delete product.blog;
      
        product.updatedBy = req.user._id;
       

        let productRec = await CenterModel.updateOne({ _id: req.params.id }, {$set: product });
        if (!productRec) return res.status(400).json({ error: "Product update failed" });

        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Product updated succesfully"
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};




const getProudctDetail = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        let query = req.query;
        delete query.pagination;
        delete query.limit;
        let record = { };

        record.product    = await ProductModel.find({status:1, slug:req.params.id }).populate('file', 'name original path thumbnail smallFile').populate('blog', 'name original path thumbnail smallFile').populate('carcass', 'name original path thumbnail smallFile').populate('coverPhoto', 'name original path thumbnail smallFile');
    
        record.featureList = await ProductFeatureModel.find({status:1,product:record.product[0]._id}).sort({ sort_order: 1 }).populate('file', 'name original path thumbnail smallFile');

        record.setting = await SettingModel.find(query).sort({ createdAt: -1 })
        .populate('logo', 'name original path thumbnail smallFile')
        .populate('footer_logo', 'name original path thumbnail smallFile')
        .populate('favicon', 'name original path thumbnail smallFile')
        .populate('default_logo', 'name original path thumbnail smallFile');  
       
        return res.status(200).send({ result: record });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};


module.exports = {
    create,
    get,
    update,
    remove,
    createFeature,
    getFeature,
    updateFeature,
    removeFeature,
    createcenter,
    updatecenter,
    getcenter,
    getCustomerSection,
    getProudctDetail
};