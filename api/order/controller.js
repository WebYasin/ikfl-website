'use strict';

const modelName         = 'Order';
const Joi               = require('@hapi/joi');
const { OrderModel,
    RoleModel,
    ReviewModel,
    NotificationModel,
    DiscountTransactionModel,
    ProductModel }      = require('@database');
const CONSTANT          = require('@lib/constant');
const moment            = require('moment');
const UTILS             = require('@lib/utils');
const excel             = require("exceljs");

const create = async (req, res, next) => {
    let order = req.body || {};

    try {
        const schema = Joi.object({
            products: Joi.array(),
            cartId: Joi.string().required(),
            // services: Joi.array(),
            orderedTo: Joi.string().required(),
            awbNumber: Joi.string(),
            trackingUrl: Joi.string(),
            orderedPrice: Joi.number().required(),
            status: Joi.string(),
            paymentStatus: Joi.string(),
            transaction: Joi.string(),
            customFields: Joi.object()
        });

        const { error } = schema.validate(order);
        if (error) return res.status(400).json({ error });

        order.orderedBy = req.user._id;
        order.orderedTime = moment().valueOf();
        order.createdBy = req.user._id;
        order.updatedBy = req.user._id;
        order = new OrderModel(order); 
        order = await order.save();

        if (order._id.toString() && order.orderedTo.toString()) {
            let notification = {
                type: "ORDER_NEW",
                device : ["DESKTOP"],
                message: `You have a new order from ${req.user.firstName} ${req.user.lastName}.`,
                userId: order.orderedTo,
                data: {
                    order: order._id
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
            result: order
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
        const notreview = req.query.review && req.query.review == 'true';
        if (!query.createdBy && !query.orderedTo && !query._id) {
            let role = await RoleModel.findOne({_id: req.user.role}, {code: 1});
            if (role.code.search(/ADMIN/i) < 0) query.createdBy = req.user._id;
        }
        if (query.search) {
            query['$or'] = [{orderId: (new RegExp(query.search, "i"))}];
            let products = await ProductModel.find({name: (new RegExp(query.search, "i"))}, {_id: 1});
            products = (UTILS.cloneObject(products)).map(e => e._id);
            query['$or'].push({products: {$in: products}});
        }
        let sort = {};
        if (query.orderedBy) sort['createdAt'] = query.orderedBy == 'true' ? 1 : -1;
        delete query.pagination;
        delete query.limit;
        delete query.search;
        delete query.orderedBy;
        delete query.review;

        const ordersCount = await OrderModel.countDocuments(query);

        let docs = await OrderModel.find(query).sort(sort).limit(limit).skip(pagination*limit)
                            .populate({
                                path: "createdBy",
                                select: 'email firstName lastName userName file role',
                                populate: {
                                    path: "file",
                                    select: 'name original path thumbnail smallFile'
                                }
                            })
                            .populate({
                                path: "products.productId",
                                select: 'name files productId',
                                populate: {
                                   path: "files",
                                   select: 'name original path thumbnail smallFile'
                                }
                            });

        docs = UTILS.cloneObject(docs);
        let discounts = await DiscountTransactionModel.find({cartId: {$in: docs.map(e => e.cartId)}}, {cartId: 1, products: 1, couponCode: 1, discount: 1, discountedValue: 1, discountedType: 1});

        let reviews = [];
        if (notreview) {
            reviews = await ReviewModel.find({status: {$in: ['APPROVED', 'DECLINED']}, order: {$in: docs.map(e => e._id)}}, {order: 1, product: 1, createdBy: 1});
        }

        docs = docs.map(doc => {
            doc.discountTransaction = discounts.find(e => e.cartId == doc.cartId) || {};
            if (notreview && reviews.length) {
                const products = reviews.filter(e => e.order.toString() == doc._id.toString() && e.createdBy.toString() == doc.createdBy._id.toString()).map(e => e.product.toString());
                doc.products = doc.products.filter(product => products.indexOf(((product.productId || {})._id || '').toString()) < 0);
            }
            return doc;
        });

        return res.status(200).send({ result: docs, count: ordersCount });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const update = async (req, res, next) => {
    try {
        if (!req.params.id) return res.status(400).json({ error: "Order id is required" });

        const schema = Joi.object({
            transaction: Joi.string(),
            awbNumber: Joi.string(),
            trackingUrl: Joi.string(),
            status: Joi.string(),
            paymentStatus: Joi.string(),
            customFields: Joi.object()
        });

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ error });

        req.body.updatedBy = req.user._id;
        let order = await OrderModel.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, {returnOriginal: false});
        if (!order) return res.status(400).json({ error: "Order update failed" });

        if (order._id.toString() && req.body.status) {
            let notification = {
                type: "ORDER_STATUS",
                device : ["DESKTOP"],
                message: `Your order status has been changed to ${order.status} by ${req.user.firstName} ${req.user.lastName}.`,
                userId: order.createdBy,
                data: {
                    order: order._id,
                    status: order.status,
                    awbNumber: req.body.awbNumber,
                    trackingUrl: req.body.trackingUrl
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
            result: "Order updated succesfully"
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

        await OrderModel.remove({ _id: req.params.id });
        return res.status(200).send({ result: "Order deleted successfully" });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

//user data Export to Excel
const exportOrder = async (req, res, next) => {
    try {
        let query = req.query;
        if (!query.createdBy && !query.orderedTo && !query._id) {
            let role = await RoleModel.findOne({_id: req.user.role}, {code: 1});
            if (role.code.search(/ADMIN/i) < 0) query.createdBy = req.user._id;
        }
        if (query.search) {
            query['$or'] = [{orderId: (new RegExp(query.search, "i"))}];
            let products = await ProductModel.find({name: (new RegExp(query.search, "i"))}, {_id: 1});
            products = (UTILS.cloneObject(products)).map(e => e._id);
            query['$or'].push({products: {$in: products}});
        }
        let sort = {};
        if (query.orderedBy) sort['createdAt'] = query.orderedBy == 'true' ? 1 : -1;
        delete query.pagination;
        delete query.limit;
        delete query.search;
        delete query.orderedBy;

        const ordersCount = await OrderModel.countDocuments(query);

        let docs = await OrderModel.find(query).sort(sort).limit(limit).skip(pagination*limit)
                            .populate({
                                path: "createdBy",
                                select: 'email firstName lastName userName file role',
                                populate: {
                                    path: "file",
                                    select: 'name original path thumbnail smallFile'
                                }
                            })
                            .populate({
                                path: "products.productId",
                                select: 'name files productId',
                                populate: {
                                   path: "files",
                                   select: 'name original path thumbnail smallFile'
                                }
                            });

        docs = UTILS.cloneObject(docs);
        let discounts = await DiscountTransactionModel.find({cartId: {$in: docs.map(e => e.cartId)}}, {cartId: 1, couponCode: 1, discount: 1, discountedValue: 1, discountedType: 1});

        docs = docs.map(doc => {
            doc.discountTransaction = discounts.find(e => e.cartId == doc.cartId) || {};
            return doc;
        });

       
        let userData = [];
        docs.forEach((obj) => {
        userData.push({
        createdAt: obj.createdAt,
        orderId: obj.orderId,
        name: obj.customFields.userDetail.name,
        email: obj.customFields.userDetail.email,
        phone: obj.customFields.userDetail.phone,
        orderedPrice: obj.orderedPrice,

      });

    });
   
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("userData");
    worksheet.columns = [
      { header: "Date", key: "createdAt", width: 25 },
      { header: "Order ID", key: "orderId", width: 25 },
      { header: "Name", key: "name", width: 25 },
      { header: "Email Address", key: "email", width: 25 },
      { header: "Contact Number", key: "phone", width: 25 },
      { header: "Amount", key: "orderedPrice", width: 25 },

    ];
    // Add Array Rows
    worksheet.addRows(userData);
    //console.log(userData) 
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "userDetails.xlsx"
    );
    return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
      });
        //return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

module.exports = {
    create,
    get,
    update,
    remove,
    exportOrder
};