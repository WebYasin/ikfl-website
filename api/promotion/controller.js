'use strict';

const modelName                 = 'Promotion';
const Joi                       = require('@hapi/joi');
const { PromotionModel,
    NotificationModel,
    UserModel }     = require('@database');
const CONSTANT                  = require('@lib/constant');
const UTILS                     = require('@lib/utils');

const create = async (req, res, next) => {
    let promotion = req.body || {};
    promotion.active = true;

    try {
        const schema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().required(),
            phone: Joi.number().required(),
            promotionService: Joi.string().required(),
            url: Joi.string().required(),
            budget: Joi.number().required(),
            message: Joi.string().required(),    
            active: Joi.boolean(),    
            customFields: Joi.object()
        });
    
        const { error } = schema.validate(promotion);
        if (error) return res.status(400).json({ error });                 

        promotion.createdBy = req.user._id;
        promotion.updatedBy = req.user._id;
        promotion = new PromotionModel(promotion);
        promotion = await promotion.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: promotion
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

        let docs = await PromotionModel.find(query).sort({createdAt: -1}).limit(limit).skip(pagination*limit).populate(
            [{
                path:'promotionService',
                select:['name'],
                populate:{
                    path:'category',
                    select:['name']
                }
                }]
            );
        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const update = async (req, res, next) => {
    try {
        if (!req.params.id) return res.status(400).json({error: "Promotion id is required"});

        const schema = Joi.object({
            // name: Joi.string(),
            // email: Joi.string(),
            // phone: Joi.number(),
            // promotionService: Joi.string(),
            // url: Joi.string(),
            budget: Joi.number().required(),
            // message: Joi.string(),    
            // active: Joi.boolean(),
            userID:Joi.string(),
            status: Joi.string().required(),    
            customFields: Joi.object()
        });
        const userID = req.body.userID;
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ error });      
        delete req.body.userID;    
        //console.log(req.body);
        req.body.updatedBy = req.user._id;
        let promotion = await PromotionModel.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, {returnOriginal: false});        
        if (!promotion) return res.status(400).json({error: "Promotion update failed"});
        if(req.body.status == "ACCEPTED") {           
            // let updateData = {};
            // updateData.updatedBy = req.user._id; 
            // let wallet = await UserModel.updateOne({ _id: req.user._id },updateData);
            let wallet = await UserModel.updateOne({ _id: userID }, { $inc: { wallet: - Number(req.body.budget) }});
            if (!wallet) return res.status(400).json({error: "Walled update failed"});
        }

        if (req.body.status && promotion._id.toString()) {
            let notification = {
                type: "PROMOTION_STATUS",
                device : ["DESKTOP"],
                message: `Your promotion has been ${req.body.status} by ${req.user.firstName} ${req.user.lastName}.`,
                userId: promotion.createdBy,
                data: {
                    promotion: promotion._id
                },
                isRead: false,
                active: true,
                createdBy: req.user._id,
                updatedBy: req.user._id
            };
            notification = new NotificationModel(notification);
            await notification.save();
        }

        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Promotion updated succesfully"
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

        await PromotionModel.remove({_id: req.params.id});
        return res.status(200).send({ result: "Promotion deleted successfully" });
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