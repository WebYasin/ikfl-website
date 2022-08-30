'use strict';

const modelName                 = 'Discount';
const Joi                       = require('@hapi/joi');
const { DiscountModel,
    CartModel,
    ProductModel,
    DiscountTransactionModel }  = require('@database');
const CONSTANT                  = require('@lib/constant');
const UTILS                     = require('@lib/utils');
const moment                    = require('moment');

const create = async (req, res, next) => {
    let discount = req.body || {};
    discount.active = true;

    try {
        const schema = Joi.object({
            products: Joi.array(),
            services: Joi.array(),
            couponName: Joi.string(),
            couponCode: Joi.string().required(),
            discountType: Joi.string().required(),
            value: Joi.number().required(),
            minValue: Joi.number().required(),
            startDate: Joi.number().required(),
            endDate: Joi.number().required(),
            multiple: Joi.boolean(),
            active: Joi.boolean().required(),
            customFields: Joi.object()
        });
    
        const { error } = schema.validate(discount);
        if (error) return res.status(400).json({ error });

        const currentDate =  moment().startOf('day').valueOf();          

        if (discount.endDate < currentDate) return res.status(400).json({error: 'End date must be greater than todays date' });
        if (discount.endDate < discount.startDate) return res.status(400).json({error: 'End date must be greater than Start date' });
        if (discount.startDate < currentDate) return res.status(400).json({error: 'Start date must be greater than todays date' });

        discount.createdBy = req.user._id;
        discount.updatedBy = req.user._id;
        discount = new DiscountModel(discount);
        discount = await discount.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: discount
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}

const applyCoupon = async (req, res, next) => {
    try {
        const schema = Joi.object({
            cartId: Joi.string().required(),
            couponCode: Joi.string().required(),
            cartValue: Joi.number().required()
        });
    
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ error });
        
        const cartCount = UTILS.cloneObject(await CartModel.countDocuments({_id: req.body.cartId}));
        if (!cartCount) return res.status(400).send({ error: "Cart not found!" });

        const discountCoupon = await DiscountModel.findOne({couponCode: req.body.couponCode, active: true}, {products: 1, value: 1, discountType: 1, startDate: 1, endDate: 1, minValue: 1, multiple: 1});
        if (!discountCoupon) return res.status(400).send({error: `Coupon ${CONSTANT.NOT_EXISTS} ${req.body.couponCode}`});

        const discountTransactionCount = await DiscountTransactionModel.countDocuments({couponCode: req.body.couponCode, discount: discountCoupon._id});
        if (!discountCoupon.multiple && discountTransactionCount) return res.status(400).send({error: `${req.body.couponCode} coupon can only be used once!`});
        
        const currentDate = moment().startOf('day').valueOf();
        if (discountCoupon.startDate > currentDate) return res.status(400).json({error: 'Coupon is not yet started'});
        if (discountCoupon.endDate < currentDate) return res.status(400).json({error: 'Coupon is exipred, please try a new one!'});

        if (req.body.cartValue < discountCoupon.minValue) return res.status(400).send({error: `Your cart value is less than discount value`});

        let products = UTILS.cloneObject(await ProductModel.find({_id: {$in: discountCoupon.products}}), {price: 1});
        if (!products) return res.status(400).send({ error: "Products not found!" });

        products = products.filter(e => e);
        
        let discountTransaction = {
            cartId: req.body.cartId,
            products: products,
            discount: discountCoupon._id,
            couponCode: req.body.couponCode,
            discountedValue: discountCoupon.value,
            discountedType: discountCoupon.discountType,
            status: "PENDING",
            active: true
        };
        discountTransaction.createdBy = req.user._id;
        discountTransaction.updatedBy = req.user._id;
        discountTransaction = new DiscountTransactionModel(discountTransaction);
        discountTransaction = await discountTransaction.save();
        
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Coupon is valid",
            products: products,
            discountCoupon: discountCoupon,
            transactionId: discountTransaction._id
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

        let docs = await DiscountModel.find(query).sort({createdAt: -1}).limit(limit).skip(pagination*limit).populate('products','_id name');
        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const getDiscountTransaction = async (req, res, next) => {
    try {
        let docs = await DiscountTransactionModel.find(req.query);

        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const update = async (req, res, next) => {
    try {
        if (!req.params.id) return res.status(400).json({error: "Discount id is required"});

        const schema = Joi.object({
            products: Joi.array(),
            services: Joi.array(),
            couponName: Joi.string().required(),
            couponCode: Joi.string().required(),
            discountType: Joi.string(),
            value: Joi.number(),
            minValue: Joi.number(),
            startDate: Joi.date(),
            endDate: Joi.date(),
            multiple: Joi.boolean(),
            active: Joi.boolean(),
            customFields: Joi.object()
        });

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ error });

        let uDiscount = req.body || {};
        const currentDate =  moment().startOf('day').valueOf();               

        if (uDiscount.endDate < currentDate){
            return res.status(400).json({error: 'End date must be greater than todays date' });            
        } else if (uDiscount.endDate < uDiscount.startDate){
            return res.status(400).json({error: 'End date must be greater than Start date' });
        } else if (uDiscount.startDate < currentDate){
            return res.status(400).json({error: 'Start date must be greater than todays date' });
        }    
        
        req.body.updatedBy = req.user._id;
        
        let discount = await DiscountModel.updateOne({_id: req.params.id}, {$set: req.body});        
        if (!discount) return res.status(400).json({error: "Discount update failed"});            

        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Discount updated succesfully"
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

        await DiscountModel.remove({_id: req.params.id});
        return res.status(200).send({ result: "Discount deleted successfully" });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const removeCoupon = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required()
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        const transaction = await DiscountTransactionModel.findOne({discount: req.params.id}, {products: 1});
        await DiscountTransactionModel.remove({discount: req.params.id});

        return res.status(200).send({ result: "Coupon removed successfully", products: transaction.products });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

module.exports = {
    create,
    get,
    getDiscountTransaction,
    update,
    applyCoupon,
    removeCoupon,
    remove
};