'use strict';

const modelName                 = 'Service';
const Joi                       = require('@hapi/joi');
const { ServiceModel,
    ReviewModel,
    NotificationModel,
    serviceEnquiryModel }       = require('@database');
const CONSTANT                  = require('@lib/constant');
const UTILS                     = require('@lib/utils');
const FILE_UPLOAD               = require('@lib/file_upload');
const ObjectId                  = require('mongodb').ObjectId;
const _                         = require('lodash');

const create = async (req, res, next) => {
    let service = await FILE_UPLOAD.uploadMultipleFile(req);
    if (service.tags && typeof service.tags == 'string') service.tags = JSON.parse(service.tags);
    service.active = true;
    
    try {
        const count = await ServiceModel.countDocuments({createdBy: req.user._id});
        if (count >= 100) return res.status(400).json({ error: "Your limit got exceed, please contact admin for approval" });

        const schema = Joi.object({
            name: Joi.string().required(),
            description: Joi.string(),
            state: Joi.string(),
            category: Joi.string().required(),
            files: Joi.array(),
            tags: Joi.array(),
            active: Joi.boolean(),
            customFields: Joi.object(),
            createdBy :Joi.string(),
        });
       
        const { error } = schema.validate(service);
        if (error) return res.status(400).json({ error });
        
        if (service.files.length) service.files = service.files.map(file => file._id);
        else delete service.files;
       
        service.createdBy = req.user._id;
        service.updatedBy = req.user._id;
        service = new ServiceModel(service);
        service = await service.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: service
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
        if (req.query.category) query.category = {$in: req.query.category.split(",")};
        if (req.query.state) query.state = {$in: req.query.state.split(",").map(e => new RegExp(e, "i"))};
        delete query.pagination;
        delete query.limit;
        
        let docs = await ServiceModel.find(query).sort({createdAt: -1}).limit(limit).skip(pagination*limit)
                        .populate('category', 'name')
                        .populate('files', 'name original path thumbnail smallFile')
                        .populate({
                            path: "createdBy",
                            populate: {
                                path: "file",
                                select: 'name original path thumbnail smallFile'
                            }
                        });

        let reviews = await ReviewModel.find({status: {$in: ['APPROVED', 'DECLINED']}, service: {$in: docs.map(e => e._id)}}, {_id: 1, rating: 1, service: 1, feedback: 1, file: 1, createdAt: 1, updatedAt: 1});

        docs = UTILS.cloneObject(docs).filter(e => e.createdBy).map(doc => {
            doc.rating = (reviews || []).filter(e => e.service && doc._id && e.service.toString() == doc._id.toString()) || [];
            
            let avgRating = doc.rating.map(e => e.rating).filter(e => e);
            avgRating = (_.sum(avgRating))/avgRating.length;
            doc.avgRating = avgRating;

            return doc;
        });
        
        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const update = async (req, res, next) => {
    try {
        if (!req.params.id) return res.status(400).json({ error: "Service id is required" });
        let service = await FILE_UPLOAD.uploadMultipleFile(req);
        if (service.tags && typeof service.tags == 'string') service.tags = JSON.parse(service.tags);
        
        const schema = Joi.object({
            name: Joi.string(),
            description: Joi.string(),
            state: Joi.string(),
            category: Joi.string(),
            files: Joi.array(),
            oldimg: Joi.array().items(Joi.string()),
            tags: Joi.array(),
            active: Joi.boolean(),
            createdBy :Joi.string(),
            customFields: Joi.object()
        });

        const { error } = schema.validate(service);
        if (error) return res.status(400).json({ error });
        
        service.updatedBy = req.user._id;
        let updateData = Object.assign({}, service);

        let files = [];
        if (service.files.length) files = service.files.map(file => file._id);
        delete updateData.files;

        updateData = { $set: updateData };
        if (files.length) updateData['$push'] = {files: {$each: files}};
        
        let serviceRec = await ServiceModel.updateOne({ _id: req.params.id }, updateData);
        if (!serviceRec) return res.status(400).json({ error: "Service update failed" });

        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Service updated succesfully"
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

// submit service enquiry
const sendEnquiry = async (req, res, next) => {
    let serviceEnquiry = req.body || {};
    serviceEnquiry.active = true;
    
    try {
        const schema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().required(),
            phone: Joi.number().required(),
            service: Joi.string().required(),
            message: Joi.string().required(),
            active: Joi.boolean(),
        });
        
        const { error } = schema.validate(serviceEnquiry);
        if (error) return res.status(400).json({ error });
               
        serviceEnquiry.createdBy = req.user._id;
        serviceEnquiry.updatedBy = req.user._id;
        serviceEnquiry = new serviceEnquiryModel(serviceEnquiry);
        serviceEnquiry = await serviceEnquiry.save();

        if (serviceEnquiry._id.toString() && serviceEnquiry.service.toString()) {
            let service = await ServiceModel.findOne({_id: serviceEnquiry.service});

            let notification = {
                type: "SERVICE_ENQUIRY",
                device : ["DESKTOP"],
                message: `You have a service enquiry for ${service.name} service, from ${req.user.firstName} ${req.user.lastName}.`,
                userId: service.createdBy,
                data: {
                    serviceEnquiry: serviceEnquiry._id,
                    service: service._id
                },
                isRead: false,
                active: true,
                createdBy: req.user._id,
                updatedBy: req.user._id
            };
            notification = new NotificationModel(notification);
            await notification.save();
        }

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: serviceEnquiry
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}

// get service enquiry
const getEnquiry = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        let query = req.query;
       
        if (req.query.category) query.category = {$in: req.query.category.split(",")};
        delete query.pagination;
        delete query.limit;
        let docs = '';
        if(req.query.professionId)
        {
            
             docs = await serviceEnquiryModel.aggregate([
               
                { $lookup: {
                      from: "services",
                      localField: "service",
                      foreignField: "_id",
                      as: "serviceDetails"
                }},
               { "$unwind": "$serviceDetails" },
              
               { "$match": { "serviceDetails.createdBy": ObjectId(req.query.professionId) } },
               { "$lookup": {
                "from": "categories",
                "localField": "serviceDetails.category",
                "foreignField": "_id",
                "as": "categoryDetails"
              }},
              { $skip: (pagination*limit) },
              { $sort : { createdAt: -1} },
              { $limit: limit },
             
             ])
        // docs = await serviceEnquiryModel.find(query).sort({createdAt: -1}).limit(limit).skip(pagination*limit)
        //                 .populate('service', 'name');

        }else{
         docs = await serviceEnquiryModel.find(query).sort({createdAt: -1}).limit(limit).skip(pagination*limit)
                        .populate('service', 'name createdBy');
        }
        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};
//update enquiry review status

const updateEnquiry = async (req, res, next) => {
    try {
        if (!req.params.id) return res.status(400).json({ error: "Service id is required" });
        let service = req.body
       
        
        const schema = Joi.object({
            review: Joi.boolean()
        });

        const { error } = schema.validate(service);
        if (error) return res.status(400).json({ error });
        
        service.updatedBy = req.user._id;
        let updateData = Object.assign({}, service);

       

        updateData = { $set: updateData };
       
        let serviceRec = await serviceEnquiryModel.updateOne({ _id: req.params.id }, updateData);
        if (!serviceRec) return res.status(400).json({ error: "Service Enquiry update failed" });

        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Service Enquiry updated succesfully"
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

        await ServiceModel.remove({ _id: req.params.id });
        return res.status(200).send({ result: "Service deleted successfully" });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

module.exports = {
    create,
    get,
    update,
    remove,
    sendEnquiry,
    getEnquiry,
    updateEnquiry
    
};