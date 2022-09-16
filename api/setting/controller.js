'use strict';

const modelName                 = 'Setting';
const Joi                       = require('@hapi/joi');
const { SettingModel,MetaModel,StateModel }          = require('@database');
const CONSTANT                  = require('@lib/constant');
const UTILS                     = require('@lib/utils');
const FILE_UPLOAD               = require('@lib/file_upload');
const ObjectId                  = require('mongodb').ObjectId;

const create = async (req, res, next) => {
    let setting = await FILE_UPLOAD.uploadMultipleFile(req);

    try {
        const schema = Joi.object({
            store_name: Joi.string().required(),
            meta_title: Joi.string().empty(''),
            meta_description: Joi.string().empty(''),
            meta_keyword: Joi.string().empty(''),
            email: Joi.string().empty(''),
            telephone: Joi.string().empty(''),
            alternate: Joi.string().empty(''),
            address: Joi.string().empty(''),
            google_iframe: Joi.string().empty(''),
            cin: Joi.string().empty(''),
            comment: Joi.string().empty(''),
            footer_note: Joi.string().empty(''),
            copywrite: Joi.string().empty(''), 
            facebook: Joi.string().empty(''),
            twitter: Joi.string().empty(''), 
            linkedin: Joi.string().empty(''),
            pinterest: Joi.string().empty(''),
            instagram: Joi.string().empty(''), 
            pinterest: Joi.string().empty(''),
            youtube: Joi.string().empty(''),
            whatsapp: Joi.string().empty(''),
            gtitle: Joi.string().empty(''),
            gdescription: Joi.string().empty(''),
            gbtn_name: Joi.string().empty(''),
            gbtn_link: Joi.string().empty(''),
            files: Joi.array(),
        });
    
        const { error } = schema.validate(setting);
        if (error) return res.status(400).json({ error });

        let files = setting.files;
        if (files.length) {
            setting.logo = files.filter(e => e.fieldName == 'file').map(file => file._id);
            setting.footer_logo = files.filter(e => e.fieldName == 'blog').map(file => file._id);
            setting.favicon = files.filter(e => e.fieldName == 'banner_img').map(file => file._id);
            setting.default_logo = files.filter(e => e.fieldName == 'eligible_img').map(file => file._id);
            
        } else delete setting.files;

        setting.createdBy = req.user._id;
        setting.updatedBy = req.user._id;
        setting = new SettingModel(setting);
        setting = await setting.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: setting
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}

const get = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        const rating = req.query.rating;
        let query = req.query;
        delete query.pagination;
        delete query.limit;

        let docs = await SettingModel.find(query).sort({ createdAt: -1 })
            .limit(limit).skip(pagination * limit)
            .populate('logo', 'name original path thumbnail smallFile')
            .populate('footer_logo', 'name original path thumbnail smallFile')
            .populate('favicon', 'name original path thumbnail smallFile')
            .populate('default_logo', 'name original path thumbnail smallFile');
        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const update = async (req, res, next) => {
    let setting = await FILE_UPLOAD.uploadMultipleFile(req);

    try {
        if (!req.params.id) return res.status(400).json({ error: "setting id is required" });

        const schema = Joi.object({
            store_name: Joi.string().required(),
            meta_title: Joi.string().empty(''),
            meta_description: Joi.string().empty(''),
            meta_keyword: Joi.string().empty(''),
            email: Joi.string().empty(''),
            telephone: Joi.string().empty(''),
            alternate: Joi.string().empty(''),
            address: Joi.string().empty(''),
            google_iframe: Joi.string().empty(''),
            cin: Joi.string().empty(''),
            comment: Joi.string().empty(''),
            footer_note: Joi.string().empty(''),
            copywrite: Joi.string().empty(''), 
            facebook: Joi.string().empty(''),
            twitter: Joi.string().empty(''), 
            linkedin: Joi.string().empty(''),
            pinterest: Joi.string().empty(''),
            instagram: Joi.string().empty(''), 
            pinterest: Joi.string().empty(''),
            youtube: Joi.string().empty(''),
            whatsapp: Joi.string().empty(''),
            gtitle: Joi.string().empty(''),
            gdescription: Joi.string().empty(''),
            gbtn_name: Joi.string().empty(''),
            gbtn_link: Joi.string().empty(''),
            files: Joi.array(),
        });

        const { error } = schema.validate(setting);
        if (error) return res.status(400).json({ error });

        let files = setting.files;
        if (files.length) {
            setting.logo = files.filter(e => e.fieldName == 'file').map(file => file._id);
            setting.footer_logo = files.filter(e => e.fieldName == 'blog').map(file => file._id);
            setting.favicon = files.filter(e => e.fieldName == 'coverPhoto').map(file => file._id);
            setting.default_logo = files.filter(e => e.fieldName == 'carcass').map(file => file._id);
        }
         delete setting.files;
        
        
        if(setting.logo && setting.logo.length < 1) delete setting.logo;
        if(setting.footer_logo && setting.footer_logo.length < 1) delete setting.footer_logo;
        if(setting.favicon && setting.favicon.length < 1) delete setting.favicon;
        if(setting.default_logo && setting.default_logo.length < 1) delete setting.default_logo;
        setting.updatedBy = req.user._id;
       

        let settingRec = await SettingModel.updateOne({ _id: req.params.id }, {$set: setting });
        if (!settingRec) return res.status(400).json({ error: "setting update failed" });

        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "setting updated succesfully"
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

         await SettingModel.remove({ _id: req.params.id });

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Setting Deleted succesfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};


//////////////////////



const createMeta = async (req, res, next) => {
    let heading = await FILE_UPLOAD.uploadMultipleFile(req);

    try {
        const schema = Joi.object({
            name: Joi.string().required(),
            description: Joi.string().empty(''),
            title: Joi.string().empty(''),
            meta_title: Joi.string().empty(''),
            meta_description: Joi.string().empty(''),
            meta_keyword: Joi.string().empty(''),
            link: Joi.string().empty(''),
            sort_order: Joi.number().empty(''),
            status: Joi.number().empty(''),
            files: Joi.array(),
            customFields: Joi.object()
        });
    
        const { error } = schema.validate(heading);
        if (error) return res.status(400).json({ error });

        if (heading.files.length) heading.file = heading.files.map(file => file._id);
        else delete heading.files;

        heading.createdBy = req.user._id;
        heading.updatedBy = req.user._id;

        heading = new MetaModel(heading);
        heading = await heading.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: heading
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const getMeta = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        let query = req.query;
        if (query.name) query.name = new RegExp(query.name, "i");
        delete query.pagination;
        delete query.limit;

        let docs = await MetaModel.find(query).sort({createdAt: -1}).limit(limit).skip(pagination*limit).populate('file', 'name original path thumbnail smallFile');
        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const updateMeta = async (req, res, next) => {
    
    try {
        if (!req.params.id) return res.status(400).json({error: "Meta id is required"});
        let team = await FILE_UPLOAD.uploadMultipleFile(req);
        const schema = Joi.object({ 
            name: Joi.string().required(),
            description: Joi.string().empty(''),
            title: Joi.string().empty(''),
            meta_title: Joi.string().empty(''),
            meta_description: Joi.string().empty(''),
            meta_keyword: Joi.string().empty(''),
            link: Joi.string().empty(''),
            sort_order: Joi.number().empty(''),
            status: Joi.number().empty(''),
            files: Joi.array(),
            customFields: Joi.object()
        });

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ error });

        if (team.files.length) team.file = team.files.map(file => file._id);
        else delete team.files;
        req.body.updatedBy = req.user._id;

        team = await MetaModel.updateOne({_id: req.params.id}, {$set: req.body});
       
        if (!team) return res.status(400).json({error: "Meta update failed"});
        
        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Meta updated succesfully"
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const removeMeta = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required()
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        await MetaModel.deleteOne({_id: req.params.id});
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Meta Deleted succesfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

///////////////////

const createState = async (req, res, next) => {
    let heading = await FILE_UPLOAD.uploadMultipleFile(req);

    try {
        const schema = Joi.object({
            name: Joi.string().required(),
            sort_order: Joi.number().empty(''),
            status: Joi.number().empty(''),
            files: Joi.array(),
            customFields: Joi.object()
        });
    
        const { error } = schema.validate(heading);
        if (error) return res.status(400).json({ error });

        if (heading.files.length) heading.file = heading.files.map(file => file._id);
        else delete heading.files;

        heading.createdBy = req.user._id;
        heading.updatedBy = req.user._id;

        heading = new StateModel(heading);
        heading = await heading.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: heading
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const getState = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        let query = req.query;
        if (query.name) query.name = new RegExp(query.name, "i");
        delete query.pagination;
        delete query.limit;

        let docs = await StateModel.find(query).sort({createdAt: -1}).limit(limit).skip(pagination*limit).populate('file', 'name original path thumbnail smallFile');
        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const updateState = async (req, res, next) => {
    
    try {
        if (!req.params.id) return res.status(400).json({error: "Meta id is required"});
        let team = await FILE_UPLOAD.uploadMultipleFile(req);
        const schema = Joi.object({ 
            name: Joi.string().required(),
            sort_order: Joi.number().empty(''),
            status: Joi.number().empty(''),
            files: Joi.array(),
            customFields: Joi.object()
        });

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ error });

        if (team.files.length) team.file = team.files.map(file => file._id);
        else delete team.files;
        req.body.updatedBy = req.user._id;

        team = await StateModel.updateOne({_id: req.params.id}, {$set: req.body});
       
        if (!team) return res.status(400).json({error: "Meta update failed"});
        
        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Meta updated succesfully"
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const removeState = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required()
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        await StateModel.deleteOne({_id: req.params.id});
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Meta Deleted succesfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

///////////////



module.exports = {
    create,
    get,
    update,
    remove,
    createMeta,
    getMeta,
    updateMeta,
    removeMeta,
    createState,
    getState,
    updateState,
    removeState
};