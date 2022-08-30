'use strict';

const modelName                 = 'Recommendation';
const Joi                       = require('@hapi/joi');
const { RecommendationModel,
    NotificationModel }         = require('@database');
const CONSTANT                  = require('@lib/constant');
const UTILS                     = require('@lib/utils');
const ObjectId                  = require('mongodb').ObjectId;

const create = async (req, res, next) => {
    let recommendation = req.body || {};
    recommendation.status = "REQUESTED";

    try {
        const schema = Joi.object({
            subject: Joi.string().required(),
            message: Joi.string().required(),
            requestedTo: Joi.string().required(),
            status: Joi.string().required(),
            customFields: Joi.object()
        });
    
        const { error } = schema.validate(recommendation);
        if (error) return res.status(400).json({ error });

        recommendation.createdBy = req.user._id;
        recommendation.updatedBy = req.user._id;
        recommendation = new RecommendationModel(recommendation);
        recommendation = await recommendation.save();

        let notification = {
            type: "RECOMMENDATION_REQUEST",
            device : ["DESKTOP"],
            message: `You have a recommendation request from ${req.user.firstName} ${req.user.lastName}.`,
            userId: recommendation.requestedTo,
            data: {
                recommendationId: recommendation._id
            },
            isRead: false,
            active: true,
            createdBy: req.user._id,
            updatedBy: req.user._id
        };
        notification = new NotificationModel(notification);
        await notification.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: recommendation
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

        let docs = await RecommendationModel.find(query).sort({createdAt: -1})
                    .limit(limit).skip(pagination*limit)
                    .populate({
                        path: "requestedTo",
                        select: 'firstName lastName userName file role',
                        populate: {
                           path: "file",
                           select: 'name original path thumbnail smallFile'
                        }
                    })
                    .populate({
                        path: "createdBy",
                        select: 'firstName lastName userName file role',
                        populate: {
                           path: "file",
                           select: 'name original path thumbnail smallFile'
                        }
                    });

        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const update = async (req, res, next) => {
    try {
        if (!req.params.id) return res.status(400).json({error: "Recommendation id is required"});

        const schema = Joi.object({
            status: Joi.string(),
            customFields: Joi.object()
        });

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ error });

        req.body.updatedBy = req.user._id;
        let recommendation = await RecommendationModel.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, {returnOriginal: false});
        if (!recommendation) return res.status(400).json({error: "Recommendation update failed"});

        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Recommendation updated succesfully"
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

        await RecommendationModel.remove({_id: req.params.id});
        return res.status(200).send({ result: "Recommendation deleted successfully" });
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