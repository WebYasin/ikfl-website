'use strict';

const modelName                 = 'Earnings';
const Joi                       = require('@hapi/joi');
const { EarningsModel }         = require('@database');
const CONSTANT                  = require('@lib/constant');
const UTILS                     = require('@lib/utils');
const moment                    = require('moment');

const create = async (req, res, next) => {
    let earnings = req.body || {};
    earnings.active = true;

    try {
        const schema = Joi.object({
            userId: Joi.string().required(),
            earningValue: Joi.string().required(),
            orderId: Joi.string().required(),
            commision: Joi.string().required(),
            commisionType: Joi.string().required(),
            active: Joi.boolean(),
            customFields: Joi.object()
        });
    
        const { error } = schema.validate(earnings);
        if (error) return res.status(400).json({ error });

        earnings.createdBy = req.user._id;
        earnings.updatedBy = req.user._id;
        earnings = new EarningsModel(earnings);
        earnings = await earnings.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: earnings
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
        const futureDate = moment(req.query.futureDate || '').format("YYYY-MM-DD");
        const previousDate = moment(req.query.previousDate || '').format("YYYY-MM-DD");
        if (req.query.previousDate) query['createdAt'] = {$gte: ISODate(previousDate), $lte: ISODate(futureDate)};
        query.createdBy = query.createdBy || req.user._id;

        let docs = UTILS.cloneObject(await EarningsModel.find(query).sort({createdAt: -1}).limit(limit).skip(pagination*limit));
        let record = {
            totalAmount: 0,
            penalties: 0,
            netAmount: 0,
            totalPenalties: 0,
            compensation: 0,
            netSettlements: 0
        }
        docs = docs.map(doc => {
            record.totalAmount += doc.earningValue;
            record.netAmount = record.totalAmount+record.penalties;
            record.totalPenalties += doc.commision;
            record.netSettlements = record.totalPenalties+record.compensation;
            return req.query.records ? doc : null;
        }).filter(e => e);

        return res.status(200).send({ result: record, records: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const update = async (req, res, next) => {
    try {
        if (!req.params.id) return res.status(400).json({error: "Earnings id is required"});

        const schema = Joi.object({
            earningValue: Joi.string(),
            active: Joi.boolean(),
            customFields: Joi.object()
        });

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ error });

        req.body.updatedBy = req.user._id;
        let earnings = await EarningsModel.updateOne({_id: req.params.id}, {$set: req.body});
        if (!earnings) return res.status(400).json({error: "Earnings update failed"});

        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Earnings updated succesfully"
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

        await EarningsModel.remove({_id: req.params.id});
        return res.status(200).send({ result: "Earnings deleted successfully" });
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