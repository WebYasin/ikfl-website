"use strict";

const router = require("express").Router();

/**
 * Import All Express Router Here
 */

router.use('/category', require("./category/routes"));
router.use('/attribute', require("./attribute/routes"));
router.use('/file', require("./file/routes"));
router.use('/enquiry', require("./enquiry/routes"));
router.use('/logs', require("./logs/routes"));
router.use('/message', require("./message/routes"));
router.use('/notification', require("./notification/routes"));
router.use('/order', require("./order/routes"));
router.use('/otp', require("./otp/routes"));
router.use('/product', require("./product/routes"));
router.use('/report', require("./report/routes"));
router.use('/review', require("./review/routes"));
router.use('/role', require("./role/routes"));
router.use('/service', require("./service/routes"));
router.use('/session', require("./session/routes"));
router.use('/tags', require("./tags/routes"));
router.use('/user', require("./user/routes"));
router.use('/subcategory', require("./subcategory/routes"));
router.use('/promotion', require("./promotion/routes"));
router.use('/userMessage', require("./userMessage/routes"));
router.use('/marketing', require("./marketing/routes"));
router.use('/faq', require("./faq/routes"));
router.use('/blog', require("./blog/routes"));
router.use('/contactEnquiry', require("./contactEnquiry/routes"));
router.use('/testimonial', require("./testimonial/routes"));
router.use('/team', require("./team/routes"));
router.use('/vision', require("./vision/routes"));
router.use('/about', require("./about/routes"));
router.use('/home', require("./home/routes"));
router.use('/solution', require("./solution/routes"));
router.use('/event', require("./event/routes"));
router.use('/career', require("./career/routes"));
router.use('/policy', require("./policy/routes"));
router.use('/setting', require("./setting/routes"));

router.use('/contact', require("./contactEnquiry/routes"));
router.use('/informationCenter', require("./about/routes"));
router.use('/customerSection', require("./product/routes"));
router.use('/gallery', require("./about/routes"));
router.use('/oracle', require("./oracle/routes"));

module.exports = router;