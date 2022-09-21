'use strict';

const modelName                     = 'about';
const Joi                           = require('@hapi/joi');
const { AboutModel,
    TeamModel,
    AwardModel,
    JourneyModel,
    AddressModel,
    CenterModel,
    DownloadModel,
    ChargesModel,
    informationModel,
    AnnualReportModel,
    SettingModel,
    MetaModel,
    HomePartnerModel,
    GalleryHeadingModel,
    GalleryModel,
    BlogModel,
    QuaterlyReportModel,
    FinancialYearModel,
    InvestorPresentationModel,
    VisionModel }                   = require('@database');
const CONSTANT                      = require('@lib/constant');
const UTILS                         = require('@lib/utils');
const FILE_UPLOAD                   = require('@lib/file_upload');
const { result } = require('@hapi/joi/lib/base');

const create = async (req, res, next) => {
    let about = await FILE_UPLOAD.uploadMultipleFile(req);
     
    try {
        const schema = Joi.object({
            name: Joi.string().empty(''),
            designation :Joi.string().empty(''),
            files: Joi.array(),
            description: Joi.string().empty(''),
            atitle: Joi.string().empty(''),
            adescription: Joi.string().empty(''),
            otitle: Joi.string().empty(''),
            odescription: Joi.string().empty(''),
            obtn_name: Joi.string().empty(''),
            obtn_link: Joi.string().empty(''), 
            vtitle: Joi.string().empty(''),
            atitle: Joi.string().empty(''),
            adescription: Joi.string().empty(''),
            btitle: Joi.string().empty(''),
            bdescription: Joi.string().empty(''),
            mtitle: Joi.string().empty(''),
            gtitle: Joi.string().empty(''),
            gdescription: Joi.string().empty(''),
            mntitle: Joi.string().empty(''),
            awtitle: Joi.string().empty(''),
            awdescription: Joi.string().empty(''),

            status: Joi.number(),
            customFields: Joi.object()
        });

        const { error } = schema.validate(about);
        if (error) return res.status(400).json({ error });

        let files = about.files;
        if (files.length) {
            about.file = files.filter(e => e.fieldName == 'file').map(file => file._id);
            about.blog = files.filter(e => e.fieldName == 'blog').map(file => file._id);
        } else delete about.files;

        about.createdBy = req.user._id;
        about.updatedBy = req.user._id;
        
        about = new AboutModel(about);
        about = await about.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: about
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
        record.about    = await AboutModel.find({status:1})
        .populate('file', 'name original path thumbnail smallFile')
        .populate('blog', 'name original path thumbnail smallFile');
       
        record.directorList     = await TeamModel.find({status:1,type:1}).sort({sort_order: 1}).populate('file', 'name original path thumbnail smallFile');
        record.teamList     = await TeamModel.find({status:1,type:2}).sort({sort_order: 1}).populate('file', 'name original path thumbnail smallFile');

        record.visionList   = await VisionModel.find({status:1,show_value:0}).sort({sort_order: 1}).populate('files', 'name original path thumbnail smallFile');

        record.valuesList   = await VisionModel.find({status:1,show_value:1}).sort({sort_order: 1}).populate('files', 'name original path thumbnail smallFile');

        record.awardList = await AwardModel.find({status:1}).sort({createdAt: -1}).limit(limit).skip(pagination*limit).populate('file', 'name original path thumbnail smallFile');
       
        record.journeyList = await JourneyModel.find({status:1}).sort({createdAt: -1}).limit(limit).skip(pagination*limit).populate('file', 'name original path thumbnail smallFile');

        record.groupList    = await HomePartnerModel.find({status:1,type:2}).sort({sort_order: 1}).populate('files', 'name original path thumbnail smallFile');
       
        record.lifeinsurance = await CenterModel.find(query).sort({ createdAt: -1 })
        .populate('attributes.attributeId', 'name')
        .populate('file', 'name original path thumbnail smallFile')
        .populate('blog', 'name original path thumbnail smallFile');

        record.setting = await SettingModel.find(query).sort({ createdAt: -1 })
        .populate('logo', 'name original path thumbnail smallFile')
        .populate('footer_logo', 'name original path thumbnail smallFile')
        .populate('favicon', 'name original path thumbnail smallFile')
        .populate('default_logo', 'name original path thumbnail smallFile');

        record.meta = await MetaModel.find({status:1,link:'about'}).populate('file', 'name original path thumbnail smallFile');
        return res.status(200).send({ result: record });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const update = async (req, res, next) => {
    try {
        if (!req.params.id) return res.status(400).json({ error: "about id is required" });
        let about = await FILE_UPLOAD.uploadMultipleFile(req);
        const schema = Joi.object({
            name: Joi.string().empty(''),
            designation :Joi.string().empty(''),
            files: Joi.array(),
            description: Joi.string().empty(''),
            atitle: Joi.string().empty(''),
            adescription: Joi.string().empty(''),
            otitle: Joi.string().empty(''),
            odescription: Joi.string().empty(''),
            obtn_name: Joi.string().empty(''),
            obtn_link: Joi.string().empty(''), 
            vtitle: Joi.string().empty(''),
            atitle: Joi.string().empty(''),
            adescription: Joi.string().empty(''),
            btitle: Joi.string().empty(''),
            bdescription: Joi.string().empty(''),
            mtitle: Joi.string().empty(''),
            gtitle: Joi.string().empty(''),
            gdescription: Joi.string().empty(''),
            mntitle: Joi.string().empty(''),
            awtitle: Joi.string().empty(''),
            awdescription: Joi.string().empty(''),
            status: Joi.number(),
            customFields: Joi.object()
        });

        const { error } = schema.validate(about);
        if (error) return res.status(400).json({ error });

        let files = about.files;
        if (files.length) {
            about.file = files.filter(e => e.fieldName == 'file').map(file => file._id);
            about.blog = files.filter(e => e.fieldName == 'blog').map(file => file._id);
        }
         delete about.files;

        if(about.file && about.file.length < 1) delete about.file;
        if(about.blog && about.blog.length < 1) delete about.blog;

        about.updatedBy = req.user._id;
     
        let aboutData = await AboutModel.updateOne({ _id: req.params.id }, {$set: about});
       
        if (!aboutData) return res.status(400).json({ error: "about update failed" });
        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "about updated succesfully"
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

        await AboutModel.deleteOne({ _id: req.params.id });
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "about Deleted succesfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};


const createAward = async (req, res, next) => {
    let award = await FILE_UPLOAD.uploadMultipleFile(req);

    try {
        const schema = Joi.object({
            title: Joi.string().required(),
            description: Joi.string().empty(''),
            status: Joi.number(),
            sort_order: Joi.number(),
            files: Joi.array(),
            customFields: Joi.object()
        });
    
        const { error } = schema.validate(award);
        if (error) return res.status(400).json({ error });

        if (award.files.length) award.file = award.files.map(file => file._id);
        else delete award.files;

        award.createdBy = req.user._id;
        award.updatedBy = req.user._id;

        award = new AwardModel(award);
        award = await award.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: award
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const getAward = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        let query = req.query;
        if (query.name) query.name = new RegExp(query.name, "i");
        delete query.pagination;
        delete query.limit;

        let docs = await AwardModel.find(query).sort({createdAt: -1}).limit(limit).skip(pagination*limit).populate('file', 'name original path thumbnail smallFile');
        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const updateAward = async (req, res, next) => {
    
    try {
        if (!req.params.id) return res.status(400).json({error: "Award id is required"});
        let team = await FILE_UPLOAD.uploadMultipleFile(req);
        const schema = Joi.object({
            title: Joi.string().required(),
            description: Joi.string().empty(''),
            status: Joi.number(),
            sort_order: Joi.number(),
            files: Joi.array(),
            customFields: Joi.object()
        });

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ error });

        if (team.files.length) team.file = team.files.map(file => file._id);
        else delete team.files;
        req.body.updatedBy = req.user._id;

        team = await AwardModel.updateOne({_id: req.params.id}, {$set: req.body});
       
        if (!team) return res.status(400).json({error: "Award update failed"});
        
        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Award updated succesfully"
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const removeAward = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required()
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        await AwardModel.deleteOne({_id: req.params.id});
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Award Deleted succesfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};




const createjourney = async (req, res, next) => {
    let award = await FILE_UPLOAD.uploadMultipleFile(req);

    try {
        const schema = Joi.object({
            year: Joi.string().required(),
            description: Joi.string().empty(''),
            status: Joi.number(),
            sort_order: Joi.number(),
            files: Joi.array(),
            customFields: Joi.object()
        });
    
        const { error } = schema.validate(award);
        if (error) return res.status(400).json({ error });

        if (award.files.length) award.file = award.files.map(file => file._id);
        else delete award.files;

        award.createdBy = req.user._id;
        award.updatedBy = req.user._id;

        award = new JourneyModel(award);
        award = await award.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: award
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const getJourney = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        let query = req.query;
        if (query.name) query.name = new RegExp(query.name, "i");
        delete query.pagination;
        delete query.limit;

        let docs = await JourneyModel.find(query).sort({createdAt: -1}).limit(limit).skip(pagination*limit).populate('file', 'name original path thumbnail smallFile');
        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const updatejourney = async (req, res, next) => {
    
    try {
        if (!req.params.id) return res.status(400).json({error: "Award id is required"});
        let team = await FILE_UPLOAD.uploadMultipleFile(req);
        const schema = Joi.object({
            year: Joi.string().required(),
            description: Joi.string().empty(''),
            status: Joi.number(),
            sort_order: Joi.number(),
            files: Joi.array(),
            customFields: Joi.object()
        });

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ error });

        if (team.files.length) team.file = team.files.map(file => file._id);
        else delete team.files;
        req.body.updatedBy = req.user._id;

        team = await JourneyModel.updateOne({_id: req.params.id}, {$set: req.body});
       
        if (!team) return res.status(400).json({error: "Award update failed"});
        
        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Award updated succesfully"
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const removejourney = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required()
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        await JourneyModel.deleteOne({_id: req.params.id});
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Award Deleted succesfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};




const createAddress = async (req, res, next) => {
    let award = await FILE_UPLOAD.uploadMultipleFile(req);

    try {
        const schema = Joi.object({
            location: Joi.string().required(),
            title: Joi.string().required(),
            description: Joi.string().empty(''),
            link: Joi.string().empty(''),
            status: Joi.number().empty(''),
            sort_order: Joi.number().empty(''),
            files: Joi.array(),
            customFields: Joi.object()
        });
    
        const { error } = schema.validate(award);
        if (error) return res.status(400).json({ error });

        if (award.files.length) award.file = award.files.map(file => file._id);
        else delete award.files;

        award.createdBy = req.user._id;
        award.updatedBy = req.user._id;

        award = new AddressModel(award);
        award = await award.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: award
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const getAddress = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : '');
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        let query = req.query;
        if (query.name) query.name = new RegExp(query.name, "i");
        delete query.pagination;
        delete query.limit;

        let docs = await AddressModel.find(query).sort({createdAt: -1}).limit(limit).skip(pagination*limit).populate('file', 'name original path thumbnail smallFile');
        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const updateAddress = async (req, res, next) => {
    
    try {
        if (!req.params.id) return res.status(400).json({error: "Address id is required"});
        let team = await FILE_UPLOAD.uploadMultipleFile(req);
        const schema = Joi.object({
            location: Joi.string().required(),
            title: Joi.string().required(),
            description: Joi.string().empty(''),
            link: Joi.string().empty(''),
            status: Joi.number().empty(''),
            sort_order: Joi.number().empty(''),
            files: Joi.array(),
            customFields: Joi.object()
        });

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ error });

        if (team.files.length) team.file = team.files.map(file => file._id);
        else delete team.files;
        req.body.updatedBy = req.user._id;

        team = await AddressModel.updateOne({_id: req.params.id}, {$set: req.body});
       
        if (!team) return res.status(400).json({error: "Address update failed"});
        
        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Address updated succesfully"
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const removeAddress = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required()
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        await AddressModel.deleteOne({_id: req.params.id});
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Address Deleted succesfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};
//////////////////////////




const createDownload = async (req, res, next) => {
    let award = await FILE_UPLOAD.uploadMultipleFile(req);

    try {
        const schema = Joi.object({
            name: Joi.string().required(),
            status: Joi.number().empty(''),
            sort_order: Joi.number().empty(''),
            files: Joi.array(),
            customFields: Joi.object()
        });
    
        const { error } = schema.validate(award);
        if (error) return res.status(400).json({ error });

        if (award.files.length) award.file = award.files.map(file => file._id);
        else delete award.files;

        award.createdBy = req.user._id;
        award.updatedBy = req.user._id;

        award = new DownloadModel(award);
        award = await award.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: award
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const getDownload = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        let query = req.query;
        if (query.name) query.name = new RegExp(query.name, "i");
        delete query.pagination;
        delete query.limit;

        let docs = await DownloadModel.find(query).sort({createdAt: -1}).limit(limit).skip(pagination*limit).populate('file', 'name original path thumbnail smallFile');
        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const updateDownload = async (req, res, next) => {
    
    try {
        if (!req.params.id) return res.status(400).json({error: "Download id is required"});
        let team = await FILE_UPLOAD.uploadMultipleFile(req);
        const schema = Joi.object({ 
            name: Joi.string().required(),
            status: Joi.number().empty(''),
            sort_order: Joi.number().empty(''),
            files: Joi.array(),
            customFields: Joi.object()
        });

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ error });

        if (team.files.length) team.file = team.files.map(file => file._id);
        else delete team.files;
        req.body.updatedBy = req.user._id;

        team = await DownloadModel.updateOne({_id: req.params.id}, {$set: req.body});
       
        if (!team) return res.status(400).json({error: "Download update failed"});
        
        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Download updated succesfully"
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const removeDownload = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required()
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        await DownloadModel.deleteOne({_id: req.params.id});
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Download Deleted succesfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

///////////////////


const removeCenter = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required()
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        await CenterModel.deleteOne({_id: req.params.id});
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Address Deleted succesfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

////////////////////////////////////////

const createCharges = async (req, res, next) => {
    let charges = await FILE_UPLOAD.uploadMultipleFile(req);

    try {
        const schema = Joi.object({
            name: Joi.string().required(),
            description: Joi.string().empty(''),
            status: Joi.number().empty(''),
            sort_order: Joi.number().empty(''),
            files: Joi.array(),
            customFields: Joi.object()
        });
    
        const { error } = schema.validate(charges);
        if (error) return res.status(400).json({ error });

        if (charges.files.length) charges.file = charges.files.map(file => file._id);
        else delete charges.files;

        charges.createdBy = req.user._id;
        charges.updatedBy = req.user._id;

        charges = new ChargesModel(charges);
        charges = await charges.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: charges
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const getCharges = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        let query = req.query;
        if (query.name) query.name = new RegExp(query.name, "i");
        delete query.pagination;
        delete query.limit;

        let docs = await ChargesModel.find(query).sort({createdAt: 1});
        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const updateCharges = async (req, res, next) => {
    
    try {
        if (!req.params.id) return res.status(400).json({error: "Address id is required"});
        let team = await FILE_UPLOAD.uploadMultipleFile(req);
        const schema = Joi.object({
            name: Joi.string().required(),
            description: Joi.string().empty(''),
            status: Joi.number().empty(''),
            sort_order: Joi.number().empty(''),
            files: Joi.array(),
            customFields: Joi.object()
        });

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ error });

        if (team.files.length) team.file = team.files.map(file => file._id);
        else delete team.files;
        req.body.updatedBy = req.user._id;

        team = await ChargesModel.updateOne({_id: req.params.id}, {$set: req.body});
       
        if (!team) return res.status(400).json({error: "Address update failed"});
        
        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Address updated succesfully"
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const removeCharges = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required()
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        await ChargesModel.deleteOne({_id: req.params.id});
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Address Deleted succesfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

///////////////////////



const createInformation = async (req, res, next) => {
    let info = await FILE_UPLOAD.uploadMultipleFile(req);

    try {
        const schema = Joi.object({
            otitle: Joi.string().required(),
            odescription: Joi.string().empty(''),
            ctitle: Joi.string().empty(''),
            cdescription: Joi.string().empty(''),
            atitle: Joi.string().empty(''),
            adescription: Joi.string().empty(''),
            ititle: Joi.string().empty(''),
            name: Joi.string().empty(''),
            designation: Joi.string().empty(''),
            phone: Joi.string().empty(''),
            email: Joi.string().empty(''),
            iptitle: Joi.string().empty(''),
            ipdescription: Joi.string().empty(''),
            status: Joi.number().empty(''),
            files: Joi.array(),
            customFields: Joi.object()
        });
    
        const { error } = schema.validate(info);
        if (error) return res.status(400).json({ error });

        if (info.files.length) info.file = info.files.map(file => file._id);
        else delete info.files;

        info.createdBy = req.user._id;
        info.updatedBy = req.user._id;

        info = new informationModel(info);
        info = await info.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: info
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const getInformation = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        let query = req.query;
        if (query.name) query.name = new RegExp(query.name, "i");
        delete query.pagination;
        delete query.limit;

        let docs = await informationModel.find(query).sort({createdAt: -1}).limit(limit).skip(pagination*limit).populate('file', 'name original path thumbnail smallFile');
        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const updateInformation = async (req, res, next) => {
    
    try {
        if (!req.params.id) return res.status(400).json({error: "Address id is required"});
        let team = await FILE_UPLOAD.uploadMultipleFile(req);
        const schema = Joi.object({
            otitle: Joi.string().required(),
            odescription: Joi.string().empty(''),
            ctitle: Joi.string().empty(''),
            cdescription: Joi.string().empty(''),
            atitle: Joi.string().empty(''),
            adescription: Joi.string().empty(''),
            ititle: Joi.string().empty(''),
            name: Joi.string().empty(''),
            designation: Joi.string().empty(''),
            phone: Joi.string().empty(''),
            email: Joi.string().empty(''),
            iptitle: Joi.string().empty(''),
            ipdescription: Joi.string().empty(''),
            status: Joi.number().empty(''),
            files: Joi.array(),
            customFields: Joi.object()
        });

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ error });

        if (team.files.length) team.file = team.files.map(file => file._id);
        else delete team.files;
        req.body.updatedBy = req.user._id;

        team = await informationModel.updateOne({_id: req.params.id}, {$set: req.body});
       
        if (!team) return res.status(400).json({error: "Address update failed"});
        
        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Address updated succesfully"
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const removeInformation = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required()
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        await informationModel.deleteOne({_id: req.params.id});
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Address Deleted succesfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};
////////////////




const createReports = async (req, res, next) => {
    let info = await FILE_UPLOAD.uploadMultipleFile(req);

    try {
        const schema = Joi.object({
            year: Joi.string().required(),
            name: Joi.string().required(),
            sort_order: Joi.number().empty(''),
            status: Joi.number().empty(''),
            files: Joi.array(),
            customFields: Joi.object()
        });
    
        const { error } = schema.validate(info);
        if (error) return res.status(400).json({ error });

        if (info.files.length) info.file = info.files.map(file => file._id);
        else delete info.files;

        info.createdBy = req.user._id;
        info.updatedBy = req.user._id;

        info = new AnnualReportModel(info);
        info = await info.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: info
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const getReports = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        let query = req.query;
        if (query.name) query.name = new RegExp(query.name, "i");
        delete query.pagination;
        delete query.limit;

        let docs = await AnnualReportModel.find(query).sort({createdAt: -1}).limit(limit).skip(pagination*limit).populate('file', 'name original path thumbnail smallFile').populate('year','_id name');
        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const updateReports = async (req, res, next) => {
    
    try {
        if (!req.params.id) return res.status(400).json({error: "Address id is required"});
        let team = await FILE_UPLOAD.uploadMultipleFile(req);
        const schema = Joi.object({
            year: Joi.string().required(),
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

        team = await AnnualReportModel.updateOne({_id: req.params.id}, {$set: req.body});
       
        if (!team) return res.status(400).json({error: "Address update failed"});
        
        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Address updated succesfully"
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const removeReports = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required()
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        await AnnualReportModel.deleteOne({_id: req.params.id});
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Address Deleted succesfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};
/////////////////////////////



const createGallery = async (req, res, next) => {
    let gallery = await FILE_UPLOAD.uploadMultipleFile(req);

    try {
        const schema = Joi.object({
            status: Joi.number().empty(''),
            files: Joi.array(),
            customFields: Joi.object()
        });
    
        const { error } = schema.validate(gallery);
        if (error) return res.status(400).json({ error });

        if (gallery.files.length) gallery.file = gallery.files.map(file => file._id);
        else delete gallery.files;

        gallery.createdBy = req.user._id;
        gallery.updatedBy = req.user._id;

        gallery = new GalleryModel(gallery);
        gallery = await gallery.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: gallery
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const getGallery = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        let query = req.query;
        if (query.name) query.name = new RegExp(query.name, "i");
        delete query.pagination;
        delete query.limit;

        let docs = await GalleryModel.find(query).sort({createdAt: -1}).limit(limit).skip(pagination*limit).populate('file', 'name original path thumbnail smallFile');
        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const updateGallery = async (req, res, next) => {
    
    try {
        if (!req.params.id) return res.status(400).json({error: "Address id is required"});
        let team = await FILE_UPLOAD.uploadMultipleFile(req);
        const schema = Joi.object({
            status: Joi.number().empty(''),
            files: Joi.array(),
            customFields: Joi.object()
        });

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ error });

        if (team.files.length) team.file = team.files.map(file => file._id);
        else delete team.files;
        req.body.updatedBy = req.user._id;

        team = await GalleryModel.updateOne({_id: req.params.id}, {$set: req.body});
       
        if (!team) return res.status(400).json({error: "Gallery update failed"});
        
        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Gallery updated succesfully"
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const removeGallery = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required()
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        await GalleryModel.deleteOne({_id: req.params.id});
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Gallery Deleted succesfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};




////////////////////////////////

const getInformationDetail = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        let query = req.query;
        if (query.name) query.name = new RegExp(query.name, "i");
        delete query.pagination;
        delete query.limit;
        let record = { };
        record.heading = await informationModel.find({status:1}).populate('file', 'name original path thumbnail smallFile');

        record.yearList = await FinancialYearModel.find({status:1}).sort({createdAt: 1});
       
        record.annualReports = await AnnualReportModel.find({status:1}).sort({sort_order: 1}).populate('file', 'name original path thumbnail smallFile').populate('year','id_ name');
      
        record.quaterlyList = await QuaterlyReportModel.find({status:1}).populate('file', 'name original path thumbnail smallFile').populate('year','id_ name');

        record.investorPresentationList = await InvestorPresentationModel.find({status:1}).sort({sort_order: 1}).limit(limit).skip(pagination*limit).populate('file', 'name original path thumbnail smallFile').populate('year','_id name');

        record.lifeinsurance = await CenterModel.find(query).sort({ createdAt: -1 })
        .populate('attributes.attributeId', 'name')
        .populate('file', 'name original path thumbnail smallFile')
        .populate('blog', 'name original path thumbnail smallFile');
        record.meta = await MetaModel.find({status:1,link:'corporate-information-center'}).populate('file', 'name original path thumbnail smallFile');
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


const getGalleryDetail = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        let query = req.query;
        if (query.name) query.name = new RegExp(query.name, "i");
        delete query.pagination;
        delete query.limit;
        let record = { };
        record.heading =  await GalleryHeadingModel.find({status:1}).populate('file', 'name original path thumbnail smallFile');
        record.galleryList = await GalleryModel.find({status:1}).populate('file', 'name original path thumbnail smallFile');
        record.latestblogs = await BlogModel.find({status:1,show_latest:1}).sort({sort_order: 1}).populate('files', 'name original path thumbnail smallFile').populate('thumbnail', 'name original path thumbnail smallFile');
       
        record.lifeinsurance = await CenterModel.find({status:1}).sort({ createdAt: -1 })
        .populate('attributes.attributeId', 'name')
        .populate('file', 'name original path thumbnail smallFile')
        .populate('blog', 'name original path thumbnail smallFile');
        
        record.blogList = await BlogModel.find({status:1}).sort({createdAt: -1}).populate('files', 'name original path thumbnail smallFile')
        .populate('thumbnail', 'name original path thumbnail smallFile');
        record.meta = await MetaModel.find({status:1,link:'media'}).populate('file', 'name original path thumbnail smallFile');
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
/////////////////////////////////////



const createQuaterly = async (req, res, next) => {
    let info = await FILE_UPLOAD.uploadMultipleFile(req);

    try {
        const schema = Joi.object({            
            year: Joi.string().required(),
            name: Joi.string().required(),
            sort_order: Joi.number().empty(''),
            status: Joi.number().empty(''),
            files: Joi.array(),
            customFields: Joi.object()
        });
    
        const { error } = schema.validate(info);
        if (error) return res.status(400).json({ error });

        if (info.files.length) info.file = info.files.map(file => file._id);
        else delete info.files;

        info.createdBy = req.user._id;
        info.updatedBy = req.user._id;

        info = new QuaterlyReportModel(info);
        info = await info.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: info
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const getQuaterly = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        let query = req.query;
        if (query.name) query.name = new RegExp(query.name, "i");
        delete query.pagination;
        delete query.limit;

        let docs = await QuaterlyReportModel.find(query).sort({createdAt: -1}).limit(limit).skip(pagination*limit).populate('file', 'name original path thumbnail smallFile').populate('year','_id name');
        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const updateQuaterly = async (req, res, next) => {
    
    try {
        if (!req.params.id) return res.status(400).json({error: "quaterly id is required"});
        let info = await FILE_UPLOAD.uploadMultipleFile(req);
        const schema = Joi.object({
            year: Joi.string().required(),
            name: Joi.string().required(),
            sort_order: Joi.number().empty(''),
            status: Joi.number().empty(''),
            files: Joi.array(),
            customFields: Joi.object()
        });

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ error });
     

        if (info.files.length) info.file = info.files.map(file => file._id);
        else delete info.files;
        req.body.updatedBy = req.user._id;

        info = await QuaterlyReportModel.updateOne({_id: req.params.id}, {$set: req.body});
                   
        if (!info) return res.status(400).json({error: "Quaterly update failed"});
        
        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Quaterly updated succesfully"
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const removeQuaterly = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required()
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        await QuaterlyReportModel.deleteOne({_id: req.params.id});
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "quaterly Deleted succesfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

////////////////////////////


const createfinancialYear = async (req, res, next) => {
    let info = await FILE_UPLOAD.uploadMultipleFile(req);

    try {
        const schema = Joi.object({
            name: Joi.string().required(),
            symbol: Joi.string().required(),
            status: Joi.number().empty(''),
            sort_order: Joi.number().empty(''),
            files: Joi.array(),
            customFields: Joi.object()
        });
    
        const { error } = schema.validate(info);
        if (error) return res.status(400).json({ error });

        if (info.files.length) info.q1 = info.files.map(file => file._id);
        else delete info.files;


        info.createdBy = req.user._id;
        info.updatedBy = req.user._id;

        info = new FinancialYearModel(info);
        info = await info.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: info
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const getfinancialYear = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        let query = req.query;
        if (query.name) query.name = new RegExp(query.name, "i");
        delete query.pagination;
        delete query.limit;

        let docs = await FinancialYearModel.find(query).sort({createdAt: 1}).limit(limit).skip(pagination*limit).populate('file', 'name original path thumbnail smallFile');
        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const updatefinancialYear = async (req, res, next) => {
    
    try {
        if (!req.params.id) return res.status(400).json({error: "Financial id is required"});
        let team = await FILE_UPLOAD.uploadMultipleFile(req);
        const schema = Joi.object({
            name: Joi.string().required(),
            symbol: Joi.string().required(),
            status: Joi.number().empty(''),
            sort_order: Joi.number().empty(''),
            files: Joi.array(),
            customFields: Joi.object()
        });

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ error });

        if (team.files.length) team.file = team.files.map(file => file._id);
        else delete team.files;
        req.body.updatedBy = req.user._id;

        team = await FinancialYearModel.updateOne({_id: req.params.id}, {$set: req.body});
       
        if (!team) return res.status(400).json({error: "Financial update failed"});
        
        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Financial updated succesfully"
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const removefinancialYear = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required()
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        await FinancialYearModel.deleteOne({_id: req.params.id});
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Financial Deleted succesfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};


//////////////////////////////////


const createPresentation = async (req, res, next) => {
    let info = await FILE_UPLOAD.uploadMultipleFile(req);

    try {
        const schema = Joi.object({
            year: Joi.string().required(),
            name: Joi.string().required(),
            sort_order: Joi.number().empty(''),
            status: Joi.number().empty(''),
            files: Joi.array(),
            customFields: Joi.object()
        });
    
        const { error } = schema.validate(info);
        if (error) return res.status(400).json({ error });

        if (info.files.length) info.file = info.files.map(file => file._id);
        else delete info.files;

        info.createdBy = req.user._id;
        info.updatedBy = req.user._id;

        info = new InvestorPresentationModel(info);
        info = await info.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: info
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const getPresentation = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        let query = req.query;
        if (query.name) query.name = new RegExp(query.name, "i");
        delete query.pagination;
        delete query.limit;

        let docs = await InvestorPresentationModel.find(query).sort({createdAt: -1}).limit(limit).skip(pagination*limit).populate('file', 'name original path thumbnail smallFile').populate('year','_id name');
        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const updatePresentation = async (req, res, next) => {
    
    try {
        if (!req.params.id) return res.status(400).json({error: "Address id is required"});
        let team = await FILE_UPLOAD.uploadMultipleFile(req);
        const schema = Joi.object({
            year: Joi.string().required(),
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

        team = await InvestorPresentationModel.updateOne({_id: req.params.id}, {$set: req.body});
       
        if (!team) return res.status(400).json({error: "Address update failed"});
        
        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Address updated succesfully"
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const removePresentation = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required()
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        await InvestorPresentationModel.deleteOne({_id: req.params.id});
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Address Deleted succesfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

/////////////////////////////

module.exports = {
    create,
    get,
    update,
    remove,
    getAward,
    createAward,
    updateAward,
    removeAward,
    getJourney,
    createjourney,
    updatejourney,
    removejourney,
    getAddress,
    createAddress,
    updateAddress,
    removeAddress,
    removeCenter,
    getDownload,
    createDownload,
    updateDownload,
    removeDownload,
    getCharges,   
    createCharges,
    updateCharges,
    removeCharges,
    getInformation,
    createInformation,
    updateInformation,
    removeInformation,
    getReports,
    createReports,
    updateReports,
    removeReports,
    getInformationDetail,
    getGallery,
    createGallery,
    updateGallery,
    removeGallery ,
    getGalleryDetail ,
    getQuaterly,
    createQuaterly,
    updateQuaterly,
    removeQuaterly,
    getfinancialYear,
    createfinancialYear,
    updatefinancialYear,
    removefinancialYear,
    getPresentation,
    createPresentation,
    updatePresentation,
    removePresentation
};