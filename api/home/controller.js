'use strict';

const modelName                     = 'home';
const Joi                           = require('@hapi/joi');
const { HomeModel,
    EventModel,
    SolutionModel,
    HomeKeyPointModel,
    ProductModel,
    BlogModel,
    HomeBenafitModel,
    HomeBannerModel,
    HomePartnerModel,
    HomeLoadSliderModel,
    SettingModel,
    MetaModel,
    VisionModel,
    TestimonialModel,
    ApplyModel,
    OtpModel }                      = require('@database');
const CONSTANT                      = require('@lib/constant');
const UTILS                         = require('@lib/utils');
const FILE_UPLOAD                   = require('@lib/file_upload');
const { result }                    = require('@hapi/joi/lib/base');
const msg91                         = require("msg91-api")("343914ABecqB83V6bZ63199dfeP1");
const moment                        = require('moment');
const ejs                           = require('ejs');
const fs                            = require('fs');
const path                          = require('path');
const mail                          = require('@lib/mailer');

const create = async (req, res, next) => {
 
    let home = await FILE_UPLOAD.uploadMultipleFile(req);
    
    try {
        const schema = Joi.object({
            heading :Joi.string().required(),  
            shortDescription:Joi.string().empty(), 
            productHeading:Joi.string().empty(),  
            proudctDescription:Joi.string().empty(),         
            benefitHeading:Joi.string().empty(),  
            benefitDescription:Joi.string().empty(),   
            partnerHeading:Joi.string().empty(),  
            partnerDescription:Joi.string().empty(),  
            customerHeading:Joi.string().empty(),  
            customerDescription:Joi.string().empty(),  
            mediaHeading:Joi.string().empty(),  
            mediaDescription:Joi.string().empty(),  
            status:Joi.number(), 

            files: Joi.array(),
            customFields: Joi.object()
        });

        const { error } = schema.validate(home);
        if (error) return res.status(400).json({ error });

     
        let files = home.files;
        if (files.length) {
            home.benafitImage = files.filter(e => e.fieldName == 'file').map(file => file._id);
            home.testimonialImage = files.filter(e => e.fieldName == 'blog').map(file => file._id);
        } else delete home.files;

   
        home.createdBy = req.user._id;
        home.updatedBy = req.user._id;
        
        home = new HomeModel(home);
        home = await home.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: home
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
        let record = { };
        record.homeHeading       = await HomeModel.find({status:1}).sort({createdAt: -1}).populate('benafitImage', 'name original path thumbnail smallFile').populate('testimonialImage', 'name original path thumbnail smallFile');
        record.products    = await ProductModel.find({status:1, show_home: 1}).sort({sort_order: 1}).populate('file', 'name original path thumbnail smallFile').populate('blog', 'name original path thumbnail smallFile').populate('carcass', 'name original path thumbnail smallFile').populate('coverPhoto', 'name original path thumbnail smallFile');
        record.homeBanners   = await HomeBannerModel.find({status:1}).sort({sort_order: 1}).populate('files', 'name original path thumbnail smallFile');
        record.homeBenafits   = await HomeBenafitModel.find({status:1}).sort({createdAt: -1}).populate('files', 'name original path thumbnail smallFile');
        record.homePartners    = await HomePartnerModel.find({status:1,type:1}).sort({sort_order: 1}).populate('files', 'name original path thumbnail smallFile');
        record.testimonials = await TestimonialModel.find({status:1}).sort({sort_order: 1}).populate('files', 'name original path thumbnail smallFile');
        record.loadSlider    = await HomeLoadSliderModel.find({status:1}).sort({sort_order: -1}).populate('file', 'name original path thumbnail smallFile');
        record.blogList = await BlogModel.find({status:1}).sort({createdAt: -1}).populate('files', 'name original path thumbnail smallFile')
        .populate('thumbnail', 'name original path thumbnail smallFile');
        record.setting = await SettingModel.find(query).sort({ createdAt: -1 })
        .populate('logo', 'name original path thumbnail smallFile')
        .populate('footer_logo', 'name original path thumbnail smallFile')
        .populate('favicon', 'name original path thumbnail smallFile')
        .populate('default_logo', 'name original path thumbnail smallFile');

        record.meta = await MetaModel.find({status:1,link:'home'}).populate('file', 'name original path thumbnail smallFile');
       
        return res.status(200).send({ result: record });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const update = async (req, res, next) => {
    try {
        if (!req.params.id) return res.status(400).json({ error: "home id is required" });
        let home = await FILE_UPLOAD.uploadMultipleFile(req);
        const schema = Joi.object({
            heading :Joi.string().required(),  
            shortDescription:Joi.string().empty(''), 
            productHeading:Joi.string().empty(''), 
            proudctDescription:Joi.string().empty(''),        
            benefitHeading:Joi.string().empty(''), 
            benefitDescription:Joi.string().empty(''),  
            partnerHeading:Joi.string().empty(''), 
            partnerDescription:Joi.string().empty(''), 
            customerHeading:Joi.string().empty(''), 
            customerDescription:Joi.string().empty(''), 
            mediaHeading:Joi.string().empty(''), 
            mediaDescription:Joi.string().empty(''), 
            status:Joi.number(), 
            files: Joi.array(),
            customFields: Joi.object()
        });

        const { error } = schema.validate(home);
        if (error) return res.status(400).json({ error });

        let files = home.files;
        if (files.length) {
            home.benafitImage = files.filter(e => e.fieldName == 'file').map(file => file._id);
            home.testimonialImage = files.filter(e => e.fieldName == 'blog').map(file => file._id);
        } else delete home.files;

        if(home.benafitImage && home.benafitImage.length < 1) delete home.benafitImage;
        if(home.testimonialImage && home.testimonialImage.length < 1) delete home.testimonialImage;

        home.updatedBy = req.user._id;

        let homeData = await HomeModel.updateOne({ _id: req.params.id }, {$set: home });
        if (!homeData) return res.status(400).json({ error: "home heading update failed" });

        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "home updated succesfully"
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

        await HomeModel.deleteOne({ _id: req.params.id });
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "home Deleted succesfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};


const createKeypoint = async (req, res, next) => {
    let homekeypoint = await FILE_UPLOAD.uploadMultipleFile(req);
    homekeypoint.active = true;
    
    try {
        const schema = Joi.object({
            name: Joi.string().required(),
            files: Joi.array(),
            active: Joi.boolean().required(),
            customFields: Joi.object()
        });

        const { error } = schema.validate(homekeypoint);
        if (error) return res.status(400).json({ error });

        let files = homekeypoint.files;
        if (files.length) {
            homekeypoint.files = files.filter(e => e.fieldName == 'file').map(file => file._id);
        } else delete homekeypoint.files;

        homekeypoint.createdBy = req.user._id;
        homekeypoint.updatedBy = req.user._id;
        
        homekeypoint = new HomeKeyPointModel(homekeypoint);
        homekeypoint = await homekeypoint.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: homekeypoint
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}

const getKeypoint = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        let query = req.query;
        delete query.pagination;
        delete query.limit;

        let docs    = await HomeKeyPointModel.find(query).sort({createdAt: -1})
        .populate('files', 'name original path thumbnail smallFile');

        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const updateKeypoint = async (req, res, next) => {
    try {
        if (!req.params.id) return res.status(400).json({ error: "homekeypoint id is required" });
        let homekeypoint = await FILE_UPLOAD.uploadMultipleFile(req);
        const schema = Joi.object({
            name: Joi.string().required(),
            files: Joi.array(),
            active: Joi.boolean().required(),
            customFields: Joi.object()
        });

        const { error } = schema.validate(homekeypoint);
        if (error) return res.status(400).json({ error });

        let files = homekeypoint.files;
        if (files.length) {
            homekeypoint.files = files.filter(e => e.fieldName == 'file').map(file => file._id);
        }
         delete homekeypoint.files;

        if(homekeypoint.files && homekeypoint.files.length < 1) delete homekeypoint.files;

        homekeypoint.updatedBy = req.user._id;
        homekeypoint = { $set: homekeypoint };
        
        if (files.length) homekeypoint['$push'] = { files: { $each: files.filter(e => e.fieldName == 'file').map(file => file._id) } };
       
        let homekeypointData = await HomeKeyPointModel.findOneAndUpdate({ _id: req.params.id }, homekeypoint, { returnOriginal: false });
        if (!homekeypointData) return res.status(400).json({ error: "homekeypoint update failed" });

        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "homekeypoint updated succesfully"
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const removeKeypoint = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required()
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        await HomeKeyPointModel.deleteOne({ _id: req.params.id });
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "homekeypoint Deleted succesfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};




const getBenafits = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        let query = req.query;
        delete query.pagination;
        delete query.limit;

        let docs    = await HomeBenafitModel.find(query).sort({createdAt: -1})
        .populate('files', 'name original path thumbnail smallFile');

        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const createBenafit = async (req, res, next) => {
    let homebenafits = await FILE_UPLOAD.uploadMultipleFile(req);
    homebenafits.status = req.status;
    
    try {
        const schema = Joi.object({
            name: Joi.string().required(),
            files: Joi.array(),
            status: Joi.number(),
            customFields: Joi.object()
        });

        const { error } = schema.validate(homebenafits);
        if (error) return res.status(400).json({ error });

        let files = homebenafits.files;
        if (files.length) {
            homebenafits.files = files.filter(e => e.fieldName == 'file').map(file => file._id);
        } else delete homebenafits.files;

        homebenafits.createdBy = req.user._id;
        homebenafits.updatedBy = req.user._id;
        
        homebenafits = new HomeBenafitModel(homebenafits);
        homebenafits = await homebenafits.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: homebenafits
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}


const updateBenafit = async (req, res, next) => {
    try {
        if (!req.params.id) return res.status(400).json({ error: "homebenafits id is required" });
        let homebenafits = await FILE_UPLOAD.uploadMultipleFile(req);
        
        const schema = Joi.object({
            name: Joi.string().required(),
            files: Joi.array(),
            status: Joi.number(),
            customFields: Joi.object()
        });

        const { error } = schema.validate(homebenafits);
        if (error) return res.status(400).json({ error });

        let files = homebenafits.files;
        if (files.length) {
            homebenafits.files = files.filter(e => e.fieldName == 'file').map(file => file._id);
        }else delete homebenafits.files;

        if(homebenafits.files && homebenafits.files.length < 1) delete homebenafits.files;

        homebenafits.updatedBy = req.user._id;

        let homebenafitsData = await HomeBenafitModel.updateOne({ _id: req.params.id }, {$set: homebenafits} );          
   
        if (!homebenafitsData) return res.status(400).json({ error: "home benafits update failed" });

        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "home benafits updated succesfully"
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const removeBenafit = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required()
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        await HomeBenafitModel.deleteOne({ _id: req.params.id });
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Home Benafits Deleted succesfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};



///////////////////////////////



const getHomeBanner = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        let query = req.query;
        delete query.pagination;
        delete query.limit;

        let docs    = await HomeBannerModel.find(query).sort({createdAt: -1})
        .populate('files', 'name original path thumbnail smallFile');

        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const createHomeBanner = async (req, res, next) => {
    let homebanner = await FILE_UPLOAD.uploadMultipleFile(req);
    homebanner.status = req.status;
    
    try {
        const schema = Joi.object({
            title: Joi.string().empty(''),
            description: Joi.string().empty(''),
            sort_order: Joi.string().empty(''),
            files: Joi.array(),
            status: Joi.number(),
            customFields: Joi.object()
        });

        const { error } = schema.validate(homebanner);
        if (error) return res.status(400).json({ error });

        let files = homebanner.files;
        if (files.length) {
            homebanner.files = files.filter(e => e.fieldName == 'file').map(file => file._id);
        } else delete homebanner.files;

        homebanner.createdBy = req.user._id;
        homebanner.updatedBy = req.user._id;
        
        homebanner = new HomeBannerModel(homebanner);
        homebanner = await homebanner.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: homebanner
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}


const updateHomeBanner = async (req, res, next) => {
    try {
        if (!req.params.id) return res.status(400).json({ error: "homebenafits id is required" });
        let homebenafits = await FILE_UPLOAD.uploadMultipleFile(req);
        
        const schema = Joi.object({
            title: Joi.string().empty(''),
            description: Joi.string().empty(),
            sort_order: Joi.string().empty(),
            files: Joi.array(),
            status: Joi.number(),
            customFields: Joi.object()
        });

        const { error } = schema.validate(homebenafits);
        if (error) return res.status(400).json({ error });

        let files = homebenafits.files;
   
        if (files.length) {
            homebenafits.files = files.filter(e => e.fieldName == 'file').map(file => file._id);
        } else delete homebenafits.files;

        if(homebenafits.files && homebenafits.files.length < 1) delete homebenafits.files;

        homebenafits.updatedBy = req.user._id;
                       
        let homebenafitsData = await HomeBannerModel.updateOne({ _id: req.params.id }, {$set: homebenafits} );
        if (!homebenafitsData) return res.status(400).json({ error: "home benafits update failed" });

        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "home benafits updated succesfully"
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const removeHomeBanner = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required()
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        await HomeBannerModel.deleteOne({ _id: req.params.id });
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Home Benafits Deleted succesfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};



const getParters = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        let query = req.query;
        delete query.pagination;
        delete query.limit;

        let docs    = await HomePartnerModel.find(query).sort({createdAt: -1})
        .populate('files', 'name original path thumbnail smallFile');

        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const createPartner = async (req, res, next) => {
    let homepartner = await FILE_UPLOAD.uploadMultipleFile(req);
    
    try {
        const schema = Joi.object({
            sort_order: Joi.number().empty(''),
            name: Joi.string().empty(''),
            files: Joi.array(),
            status: Joi.number().empty(''),
            type: Joi.number().empty(''),
            customFields: Joi.object()
        });

        const { error } = schema.validate(homepartner);
        if (error) return res.status(400).json({ error });

        let files = homepartner.files;
        if (files.length) {
            homepartner.files = files.filter(e => e.fieldName == 'file').map(file => file._id);
        } else delete homepartner.files;

        homepartner.createdBy = req.user._id;
        homepartner.updatedBy = req.user._id;
        
        homepartner = new HomePartnerModel(homepartner);
        homepartner = await homepartner.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: homepartner
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}


const updatePartner = async (req, res, next) => {
    try {
        if (!req.params.id) return res.status(400).json({ error: "Partner id is required" });
        let homepartner = await FILE_UPLOAD.uploadMultipleFile(req);
        
        const schema = Joi.object({
            sort_order: Joi.number().empty(''),
            name: Joi.string().empty(''),
            files: Joi.array(),
            status: Joi.number().empty(''),
            type: Joi.number().empty(''),
            customFields: Joi.object()
        });

        const { error } = schema.validate(homepartner);
        if (error) return res.status(400).json({ error });

        /////////
        let files = homepartner.files;
        if (files.length) {
            homepartner.files = files.filter(e => e.fieldName == 'file').map(file => file._id);
            // blog.thumbnail = files.filter(e => e.fieldName == 'blog').map(file => file._id);
        } else delete homepartner.files;

        if(homepartner.files && homepartner.files.length < 1) delete homepartner.files;
        // if(homepartner.thumbnail && homepartner.thumbnail.length < 1) delete homepartner.thumbnail;

        ////     

        homepartner.updatedBy = req.user._id;
             
         let homepartnerData = await HomePartnerModel.updateOne({ _id: req.params.id }, {$set: homepartner} );

        if (!homepartnerData) return res.status(400).json({ error: "home partner update failed" });

        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "home partner updated succesfully"
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const removePartner = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required()
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        await HomePartnerModel.deleteOne({ _id: req.params.id });
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Partner Deleted succesfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

////////////////////////

const getloanSlider = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        let query = req.query;
        delete query.pagination;
        delete query.limit;

        let docs    = await HomeLoadSliderModel.find(query).sort({createdAt: -1})
        .populate('file', 'name original path thumbnail smallFile');

        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const createloanSlider = async (req, res, next) => {
    let slider = await FILE_UPLOAD.uploadMultipleFile(req);
    slider.status = req.status;
    
    try {
        const schema = Joi.object({
            title: Joi.string().required(),
            description: Joi.string().empty(''),
            sort_order: Joi.string().empty(''),
            files: Joi.array(),
            status: Joi.number().empty(''),
            customFields: Joi.object()
        });

        const { error } = schema.validate(slider);
        if (error) return res.status(400).json({ error });

        let files = slider.files;
        if (files.length) {
            slider.files = files.filter(e => e.fieldName == 'file').map(file => file._id);
        } else delete slider.files;

        slider.createdBy = req.user._id;
        slider.updatedBy = req.user._id;
        
        slider = new HomeLoadSliderModel(slider);
        slider = await slider.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: slider
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}


const updateloanSlider = async (req, res, next) => {
    try {
        if (!req.params.id) return res.status(400).json({ error: "Partner id is required" });
        let homepartner = await FILE_UPLOAD.uploadMultipleFile(req);
        
        const schema = Joi.object({
            title: Joi.string().required(),
            description: Joi.string().empty(''),
            sort_order: Joi.string().empty(''),
            files: Joi.array(),
            status: Joi.number().empty(''),
            customFields: Joi.object()
        });

        const { error } = schema.validate(homepartner);
        if (error) return res.status(400).json({ error });

        /////////
        let files = homepartner.files;
        if (files.length) {
            homepartner.files = files.filter(e => e.fieldName == 'file').map(file => file._id);
        } else delete homepartner.files;

        if(homepartner.files && homepartner.files.length < 1) delete homepartner.files;
 

        homepartner.updatedBy = req.user._id;
             
         let homepartnerData = await HomeLoadSliderModel.updateOne({ _id: req.params.id }, {$set: homepartner} );

        if (!homepartnerData) return res.status(400).json({ error: "home partner update failed" });

        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "home partner updated succesfully"
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const removeloanSlider = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required()
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        await HomeLoadSliderModel.deleteOne({ _id: req.params.id });
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Home Benafits Deleted succesfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};


const sentOtp = async (req, res, next) => {
    let sendOtp = req.body;
    let randomNumber = await UTILS.getRandomNumber();
    try {
        const schema = Joi.object({
            number: Joi.number().required(),
        });

        const { error } = schema.validate(sendOtp);
        if (error) return res.status(400).json({ error });

        var args = {
            "flow_id": "6319a189aed1b13a913072a6",
            "sender": "KISANT",
            "mobiles": sendOtp.number, 
            "OTP": randomNumber,
            "short_url": 1
          };
          let otp = {
            type: "OTP",
            token: randomNumber,
            mobile: sendOtp.number,
            expiry: moment().add(10, 'm').valueOf(),
            active: true
        };
       
        await OtpModel.deleteOne({mobile: sendOtp.number});
        otp = new OtpModel(otp);
        otp = await otp.save();
          msg91.sendSMS(args, function(err, response){
              if(response.type == 'success') return res.status(200).send({result :"OTP sent successfully",status: CONSTANT.REQUESTED_CODES.SUCCESS})
            
          });
          
          
   
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}

const verifyOtp = async (req, res, next) => {
    let verifyOtp = req.body;
    try {
        const schema = Joi.object({
            number: Joi.number().required(),
            token: Joi.number().required(),

        });

        const { error } = schema.validate(verifyOtp);
        if (error) return res.status(400).json({ error });
        const otp = await OtpModel.findOne({mobile: req.body.number, token: req.body.token, active: true});
        if (!otp) return res.status(400).send({error: "Your OTP is not valid!"});
        if (otp.expiry < moment().valueOf()) return res.status(400).send({error: "OTP valid only for 10 minutes. Request for new OTP!"});
       
        await OtpModel.deleteOne({mobile: req.body.number});
        return res.status(200).send({result :"OTP verify successfully", status: CONSTANT.REQUESTED_CODES.SUCCESS})
       
          
   
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}

const sentMessage = async (req, res, next) => {
    let sendOtp = req.body;
    let randomNumber = await UTILS.getRandomNumber();
    try {
        const schema = Joi.object({
            number: Joi.number().required(),
        });

        const { error } = schema.validate(sendOtp);
        if (error) return res.status(400).json({ error });

        var args = {
            "flow_id": "63284651aa2eb70ea4747534",
            "sender": "KISANT",
            "mobiles": sendOtp.number, 
            "name":"yasin",
            "id":"abc",
            "url":"websiteurl",
            "short_url": 1
          };
          
       
        
          msg91.sendSMS(args, function(err, response){
              if(response.type == 'success') return res.status(200).send({result :"Message sent successfully",status: CONSTANT.REQUESTED_CODES.SUCCESS})
            
          });
          
          
   
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}


/////////////////////////
const saveapply = async (req, res, next) => {
    let apply = await FILE_UPLOAD.uploadMultipleFile(req);
    apply.active = true;
    
    try {
        const schema = Joi.object({
            firstName: Joi.string().required(),
            LastName: Joi.string().required(),
            mobile: Joi.number().required(),
            email: Joi.string().required(),
            addrress: Joi.string().empty(''),
            state: Joi.string().required(''),
            city: Joi.string().empty(''),
            occupation: Joi.string().empty(''),
            loanApplied: Joi.string().empty(''),
            files: Joi.array(),
            active: Joi.boolean(),
            customFields: Joi.object()
        });

        const { error } = schema.validate(apply);
        if (error) return res.status(400).json({ error });

        let files = apply.files;
        if (files.length) {
            apply.files = files.filter(e => e.fieldName == 'file').map(file => file._id);
        } else delete apply.files;
        
        apply = new ApplyModel(apply);
        apply = await apply.save();

        if(apply.firstName){
            let enq = await ApplyModel.find({_id:apply._id}).populate('state', '_id name ').populate('loanApplied','_id name ');
          
            let compiled = ejs.compile(fs.readFileSync(path.resolve(__dirname, '../../docs/email_templates/applyonline.ejs'), 'utf8')),
            dataToCompile = {
                firstName:enq[0].firstName,
                LastName:enq[0].LastName,
                mobile:enq[0].mobile,
                email:enq[0].email,
                addrress:enq[0].addrress,
                state:enq[0].state.name,
                city:enq[0].city,
                occupation:enq[0].occupation,
                product:enq[0].loanApplied.name,
                               
            };
        
        await mail.sendMail([process.env.ENQUIRY_MAIL], `You have new Apply Online Enquiry `, compiled(dataToCompile));
        }

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: apply
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}
//////////////////////





const getApplyData = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        let query = req.query;
        delete query.pagination;
        delete query.limit;
        let docs = await ApplyModel.find(query).sort({createdAt: -1}).limit(limit).skip(pagination*limit)
        .populate('state', '_id name ').populate('loanApplied','_id name ');
        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

/////////
module.exports = {
    create,
    get,
    update,
    remove,
    createKeypoint,
    getKeypoint,
    updateKeypoint,
    removeKeypoint,
    getBenafits,
    createBenafit,
    updateBenafit,
    removeBenafit,
    getHomeBanner,
    createHomeBanner,
    updateHomeBanner,
    removeHomeBanner,
    getParters,
    createPartner,
    updatePartner,
    removePartner,
    getloanSlider,
    createloanSlider,
    updateloanSlider,
    removeloanSlider,
    sentOtp,
    verifyOtp,
    saveapply,
    sentMessage,
    getApplyData
};