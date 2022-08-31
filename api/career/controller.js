'use strict';

const modelName                     = 'CareerModel';
const Joi                           = require('@hapi/joi');
const { 
    CareerModel,
    WorkingModel,
    CareerBenafitModel,
    EmployeeSpeakModel,
    MetaModel,
    SettingModel,
    CenterModel,
    CareerHeadingModel
 }                 = require('@database');
const CONSTANT                      = require('@lib/constant');
const UTILS                         = require('@lib/utils');
const FILE_UPLOAD                   = require('@lib/file_upload');


const create = async (req, res, next) => {
    let career = await FILE_UPLOAD.uploadMultipleFile(req);
    
    try {
        const schema = Joi.object({
            name: Joi.string().required(),
            department: Joi.string().empty(''),
            files: Joi.array(),
            location: Joi.string().empty(''),
            vacancy: Joi.string().empty(''),
            description: Joi.string().empty(''),
            status: Joi.number().empty(''),
            sort_order: Joi.number().empty(''),
            customFields: Joi.object()
        });

        const { error } = schema.validate(career);
        if (error) return res.status(400).json({ error });

        let files = career.files;
        if (files.length) {
            career.file = files.filter(e => e.fieldName == 'file').map(file => file._id);
        } else delete career.files;

        career.createdBy = req.user._id;
        career.updatedBy = req.user._id;
        
        career = new CareerModel(career);
        career = await career.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: career
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}

const get = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        let query = req.query;
        delete query.pagination;
        delete query.limit;
        let docs = await CareerModel.find(query).sort({createdAt: -1}).limit(limit).skip(pagination*limit)
        .populate('files', 'name original path thumbnail smallFile');
        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const update = async (req, res, next) => {
    try {
        if (!req.params.id) return res.status(400).json({ error: "blog id is required" });
        let career = await FILE_UPLOAD.uploadMultipleFile(req);
        const schema = Joi.object({
            name: Joi.string().required(),
            department: Joi.string().empty(''),
            files: Joi.array(),
            location: Joi.string().empty(''),
            vacancy: Joi.string().empty(''),
            description: Joi.string().empty(''),
            status: Joi.number().empty(''),
            sort_order: Joi.number().empty(''),
            customFields: Joi.object()
        });

        const { error } = schema.validate(career);
        if (error) return res.status(400).json({ error });

        let files = career.files;
        if (files.length) {
            career.files = file.filter(e => e.fieldName == 'file').map(file => file._id);
        } else delete career.files;

        if(career.files && career.files.length < 1) delete career.files;
        career.updatedBy = req.user._id;
       
        let careerData = await CareerModel.updateOne({ _id: req.params.id }, {$set: career} );
        if (!careerData) return res.status(400).json({ error: "career update failed" });
        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "career updated succesfully"
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

        await CareerModel.deleteOne({ _id: req.params.id });
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "blog Deleted succesfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};




const createWorking = async (req, res, next) => {
    let career = await FILE_UPLOAD.uploadMultipleFile(req);
    
    try {
        const schema = Joi.object({
            name: Joi.string().required(),  
            files: Joi.array(),
            description: Joi.string().empty(''),
            status: Joi.number().empty(''),
            sort_order: Joi.number().empty(''),
            customFields: Joi.object()
        });

        const { error } = schema.validate(career);
        if (error) return res.status(400).json({ error });

        let files = career.files;
        if (files.length) {
            career.file = files.filter(e => e.fieldName == 'file').map(file => file._id);
        } else delete career.files;

        career.createdBy = req.user._id;
        career.updatedBy = req.user._id;
        
        career = new WorkingModel(career);
        career = await career.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: career
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}



const getWorking = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        let query = req.query;
        delete query.pagination;
        delete query.limit;
        let docs = await WorkingModel.find(query).sort({createdAt: -1}).limit(limit).skip(pagination*limit)
        .populate('file', 'name original path thumbnail smallFile');
        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const updateWorking = async (req, res, next) => {
    try {
        if (!req.params.id) return res.status(400).json({ error: "blog id is required" });
        let career = await FILE_UPLOAD.uploadMultipleFile(req);
        const schema = Joi.object({
            name: Joi.string().required(),  
            files: Joi.array(),
            description: Joi.string().empty(''),
            status: Joi.number().empty(''),
            sort_order: Joi.number().empty(''),
            customFields: Joi.object()
        });

        const { error } = schema.validate(career);
        if (error) return res.status(400).json({ error });

           if (career.files.length) career.file = career.files.map(file => file._id);
        else delete career.files;

        if(career.files && career.files.length < 1) delete career.files;
        career.updatedBy = req.user._id;
       
        let careerData = await WorkingModel.updateOne({ _id: req.params.id }, {$set: career} );
        if (!careerData) return res.status(400).json({ error: "career update failed" });
        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "career updated succesfully"
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const removeWorking = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required()
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        await WorkingModel.deleteOne({ _id: req.params.id });
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "blog Deleted succesfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};



const createBenafits = async (req, res, next) => {
    let career = await FILE_UPLOAD.uploadMultipleFile(req);
    
    try {
        const schema = Joi.object({
            name: Joi.string().required(),  
            files: Joi.array(),
            description: Joi.string().empty(''),
            status: Joi.number().empty(''),
            sort_order: Joi.number().empty(''),
            customFields: Joi.object()
        });

        const { error } = schema.validate(career);
        if (error) return res.status(400).json({ error });

        let files = career.files;
        if (files.length) {
            career.file = files.filter(e => e.fieldName == 'file').map(file => file._id);
        } else delete career.files;

        career.createdBy = req.user._id;
        career.updatedBy = req.user._id;
        
        career = new CareerBenafitModel(career);
        career = await career.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: career
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}



const getBenafits = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        let query = req.query;
        delete query.pagination;
        delete query.limit;
        let docs = await CareerBenafitModel.find(query).sort({createdAt: -1}).limit(limit).skip(pagination*limit)
        .populate('file', 'name original path thumbnail smallFile');
        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const updateBenafits = async (req, res, next) => {
    try {
        if (!req.params.id) return res.status(400).json({ error: "Benafits id is required" });
        let career = await FILE_UPLOAD.uploadMultipleFile(req);
        const schema = Joi.object({
            name: Joi.string().required(),  
            files: Joi.array(),
            description: Joi.string().empty(''),
            status: Joi.number().empty(''),
            sort_order: Joi.number().empty(''),
            customFields: Joi.object()
        });

        const { error } = schema.validate(career);
        if (error) return res.status(400).json({ error });

           if (career.files.length) career.file = career.files.map(file => file._id);
        else delete career.files;

        if(career.files && career.files.length < 1) delete career.files;
        career.updatedBy = req.user._id;
       
        let careerData = await CareerBenafitModel.updateOne({ _id: req.params.id }, {$set: career} );
        if (!careerData) return res.status(400).json({ error: "Benafits update failed" });
        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Benafits updated succesfully"
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const removeBenafits = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required()
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        await CareerBenafitModel.deleteOne({ _id: req.params.id });
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Benafits Deleted succesfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};




const createEmployee = async (req, res, next) => {
    let career = await FILE_UPLOAD.uploadMultipleFile(req);
    
    try {
        const schema = Joi.object({
            name: Joi.string().required(),  
            files: Joi.array(),
            description: Joi.string().empty(''),
            status: Joi.number().empty(''),
            sort_order: Joi.number().empty(''),
            customFields: Joi.object()
        });

        const { error } = schema.validate(career);
        if (error) return res.status(400).json({ error });

        let files = career.files;
        if (files.length) {
            career.file = files.filter(e => e.fieldName == 'file').map(file => file._id);
        } else delete career.files;

        career.createdBy = req.user._id;
        career.updatedBy = req.user._id;
        
        career = new EmployeeSpeakModel(career);
        career = await career.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: career
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}



const getEmployee = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        let query = req.query;
        delete query.pagination;
        delete query.limit;
        let docs = await EmployeeSpeakModel.find(query).sort({createdAt: -1}).limit(limit).skip(pagination*limit)
        .populate('file', 'name original path thumbnail smallFile');
        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const updateEmployee = async (req, res, next) => {
    try {
        if (!req.params.id) return res.status(400).json({ error: "Benafits id is required" });
        let career = await FILE_UPLOAD.uploadMultipleFile(req);
        const schema = Joi.object({
            name: Joi.string().required(),  
            files: Joi.array(),
            description: Joi.string().empty(''),
            status: Joi.number().empty(''),
            sort_order: Joi.number().empty(''),
            customFields: Joi.object()
        });

        const { error } = schema.validate(career);
        if (error) return res.status(400).json({ error });

           if (career.files.length) career.file = career.files.map(file => file._id);
        else delete career.files;

        if(career.files && career.files.length < 1) delete career.files;
        career.updatedBy = req.user._id;
       
        let careerData = await EmployeeSpeakModel.updateOne({ _id: req.params.id }, {$set: career} );
        if (!careerData) return res.status(400).json({ error: "Benafits update failed" });
        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Benafits updated succesfully"
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const removeEmployee = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required()
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        await EmployeeSpeakModel.deleteOne({ _id: req.params.id });
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Benafits Deleted succesfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};




const createHeading = async (req, res, next) => {
    let career = await FILE_UPLOAD.uploadMultipleFile(req);
    
    try {
        const schema = Joi.object({
            name: Joi.string().required(),  
            files: Joi.array(),
            description: Joi.string().empty(''),
            otitle: Joi.string().empty(''),
            odescription: Joi.string().empty(''),
            etitle: Joi.string().empty(''),
            edescription: Joi.string().empty(''),
            ctitle: Joi.string().empty(''),
            cdescription: Joi.string().empty(''),
            status: Joi.number().empty(''),
            sort_order: Joi.number().empty(''),
            customFields: Joi.object()
        });

        const { error } = schema.validate(career);
        if (error) return res.status(400).json({ error });

        let files = career.files;
        if (files.length) {
            career.file = files.filter(e => e.fieldName == 'file').map(file => file._id);
        } else delete career.files;

        career.createdBy = req.user._id;
        career.updatedBy = req.user._id;
        
        career = new CareerHeadingModel(career);
        career = await career.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: career
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}



const getHeading = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        let query = req.query;
        delete query.pagination;
        delete query.limit;
        let docs = await CareerHeadingModel.find(query).sort({createdAt: -1}).limit(limit).skip(pagination*limit)
        .populate('file', 'name original path thumbnail smallFile');
        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const updateHeading = async (req, res, next) => {
    try {
        if (!req.params.id) return res.status(400).json({ error: "Benafits id is required" });
        let career = await FILE_UPLOAD.uploadMultipleFile(req);
        const schema = Joi.object({
            name: Joi.string().required(),  
            files: Joi.array(),
            description: Joi.string().empty(''),
            otitle: Joi.string().empty(''),
            odescription: Joi.string().empty(''),
            etitle: Joi.string().empty(''),
            edescription: Joi.string().empty(''),
            ctitle: Joi.string().empty(''),
            cdescription: Joi.string().empty(''),
            status: Joi.number().empty(''),
            sort_order: Joi.number().empty(''),
            customFields: Joi.object()
        });

        const { error } = schema.validate(career);
        if (error) return res.status(400).json({ error });

           if (career.files.length) career.file = career.files.map(file => file._id);
        else delete career.files;

        if(career.files && career.files.length < 1) delete career.files;
        career.updatedBy = req.user._id;
       
        let careerData = await CareerHeadingModel.updateOne({ _id: req.params.id }, {$set: career} );
        if (!careerData) return res.status(400).json({ error: "Benafits update failed" });
        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Benafits updated succesfully"
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const removeHeading = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required()
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        await CareerHeadingModel.deleteOne({ _id: req.params.id });
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Benafits Deleted succesfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};
/////////////////////////////


const getCareerData = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        let query = req.query;
        delete query.pagination;
        delete query.limit;
        let record = { };
        record.jobsList = await CareerModel.find({status:1}).sort({sort_order: 1})
        .populate('files', 'name original path thumbnail smallFile');

        record.workingList = await WorkingModel.find(query).sort({createdAt: -1}).limit(limit).skip(pagination*limit)
        .populate('file', 'name original path thumbnail smallFile');
        
        record.heading = await CareerHeadingModel.find(query).sort({createdAt: -1}).limit(limit).skip(pagination*limit)
        .populate('file', 'name original path thumbnail smallFile');

        record.employeeSpeakList = await EmployeeSpeakModel.find(query).sort({createdAt: -1}).limit(limit).skip(pagination*limit)
        .populate('file', 'name original path thumbnail smallFile');

        record.benafitsList = await CareerBenafitModel.find(query).sort({createdAt: -1}).limit(limit).skip(pagination*limit)
        .populate('file', 'name original path thumbnail smallFile');

        record.lifeinsurance = await CenterModel.find(query).sort({ createdAt: -1 })
        .populate('attributes.attributeId', 'name')
        .populate('file', 'name original path thumbnail smallFile')
        .populate('blog', 'name original path thumbnail smallFile');
      
        record.meta = await MetaModel.find({status:1,link:'careers'}).populate('file', 'name original path thumbnail smallFile');
      
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

module.exports = {
    create,
    get,
    update,
    remove,
    createWorking,
    getWorking,
    updateWorking,
    removeWorking,
    createBenafits,
    getBenafits,
    updateBenafits,
    removeBenafits,
    createEmployee,
    getEmployee,
    updateEmployee,
    removeEmployee,
    createHeading,
    getHeading,
    updateHeading,
    removeHeading,
    getCareerData
};