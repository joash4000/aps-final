const { validationResult } = require('express-validator');

const UserRegistration = require('../modals/User-Registeration');
const Course = require('../modals/Courses');
const College = require('../modals/College');
const fileHelper = require('../util/file');
const moment = require('moment');
const jsonexport = require('jsonexport');

exports.getDashboard = (req, res, next) => {
    res.render('dashboard');
}

exports.getRegistration = async(req, res, next) => {
    try {
        const courses = await Course.find();
        const colleges = await College.find();
        const users = await UserRegistration.find().sort({ createdAt: -1 });
        res.render('list', { users, courses, colleges });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getRegistrationCreate = async(req, res, next) => {
    try {
        const courses = await Course.find();
        const colleges = await College.find();
        res.render('registerationform', {
            errorMessage: null,
            courses,
            colleges
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.postRegisterationCreate = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('registerationform', {
            errorMessage: errors.array()[0].msg
        });
    }
    try {
        let courses = [];
        if (!Array.isArray(req.body.courses)) {
            courses = [req.body.courses];
        }
        const {
            college,
            name,
            fatherName,
            fatherOccupation,
            dob,
            category,
            email,
            address,
            state,
            district,
            pincode,
            contact,
            maritalStatus,
            height,
            weight,
            paid,
            bloodGroup,
            tenthBoard,
            tenthYear,
            tenthSubject,
            tenthPercentage,
            twelveYear,
            twelveBoard,
            twelveSubject,
            twelvePercentage,
            aspiringUniversity,
            aspiringYear,
            aspiringSubject,
            aspiringPercentage,
            graduationUniversity,
            graduationYear,
            graduationSubject,
            graduationPercentage,
            idType
        } = req.body;
        let idProofUrl = "",
            tenthMarksheetUrl = "",
            twelveMarksheetUrl = "",
            universityDocumentUrl = "",
            studentPhotoUrl = "";
        console.log(req.file, req.files);
        if (req.files.document_idcard) {
            idProofUrl = req.files.document_idcard[0].path.replace("\\", "/");;
        }
        if (req.files.tenth_marksheet) {
            tenthMarksheetUrl = req.files.tenth_marksheet[0].path.replace("\\", "/");;
        }
        if (req.files.twelve_marksheet) {
            twelveMarksheetUrl = req.files.twelve_marksheet[0].path.replace("\\", "/");;
        }
        if (req.files.graduation_document) {
            universityDocumentUrl = req.files.graduation_document[0].path.replace("\\", "/");;
        }
        if (req.files.photo) {
            studentPhotoUrl = req.files.photo[0].path.replace("\\", "/");;
        }
        const newUser = new UserRegistration({
            courses: courses,
            college: college,
            name: name,
            fatherName: fatherName,
            fatherOccupation: fatherOccupation,
            dob: dob,
            category: category,
            email: email,
            address: address,
            state: state,
            district: district,
            pincode: pincode,
            contact: contact,
            maritalStatus: maritalStatus,
            height: height,
            weight: weight,
            paid: paid,
            bloodGroup: bloodGroup,
            tenthBoard: tenthBoard,
            tenthYear: tenthYear,
            tenthSubject: tenthSubject,
            tenthPercentage: tenthPercentage,
            twelveBoard: twelveBoard,
            twelveYear: twelveYear,
            twelveSubject: twelveSubject,
            twelvePercentage: twelvePercentage,
            aspiringUniversity: aspiringUniversity,
            aspiringYear: aspiringYear,
            aspiringSubject: aspiringSubject,
            aspiringPercentage: aspiringPercentage,
            graduationUniversity: graduationUniversity,
            graduationYear: graduationYear,
            graduationSubject: graduationSubject,
            graduationPercentage: graduationPercentage,
            idType: idType,
            idProofUrl: idProofUrl,
            tenthMarksheetUrl: tenthMarksheetUrl,
            twelveMarksheetUrl: twelveMarksheetUrl,
            universityDocumentUrl: universityDocumentUrl,
            studentPhotoUrl: studentPhotoUrl
        });
        const user = await newUser.save();
        res.redirect('/admin/registeration');
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getEditRegisteration = (req, res, next) => {
    res.render('edit-reg', { errorMessage: null });
}

exports.postEditRegisteration = async(req, res, next) => {
    try {
        const { email, contact } = req.body;
        const user = await UserRegistration.findOne({ email: email, contact: contact });

        if (!user) {
            return res.render('edit-reg', { errorMessage: 'Invalid email or contact' });
        }
        const courses = await Course.find();
        const colleges = await College.find();
        res.render('edit-registeration', {
            errorMessage: null,
            user,
            courses,
            colleges
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.postEditRegistrationTrue = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const user1 = await UserRegistration.findById(req.body._id);
            const courses = await Course.find();
            const colleges = await College.find();
            return res.status(422).render('edit-registeration', {
                errorMessage: errors.array()[0].msg,
                user: user1,
                courses,
                colleges
            });
        }
        let courses = req.body.courses;
        if (!Array.isArray(courses)) {
            courses = [courses]
        }
        const user = await UserRegistration.findById(req.body._id);
        const {
            college,
            name,
            fatherName,
            fatherOccupation,
            dob,
            category,
            email,
            address,
            state,
            district,
            pincode,
            contact,
            maritalStatus,
            height,
            weight,
            paid,
            bloodGroup,
            tenthBoard,
            tenthYear,
            tenthSubject,
            tenthPercentage,
            twelveBoard,
            twelveYear,
            twelveSubject,
            twelvePercentage,
            aspiringUniversity,
            aspiringYear,
            aspiringSubject,
            aspiringPercentage,
            graduationUniversity,
            graduationYear,
            graduationSubject,
            graduationPercentage,
            idType
        } = req.body;
        let idProofUrl = user.idProofUrl || " ",
            tenthMarksheetUrl = user.tenthMarksheetUrl || " ",
            twelveMarksheetUrl = user.twelveMarksheetUrl || " ",
            universityDocumentUrl = user.universityDocumentUrl || " ",
            studentPhotoUrl = user.studentPhotoUrl || " ";

        if (req.files.document_idcard) {
            fileHelper.deleteFile(user.idProofUrl);
            idProofUrl = req.files.document_idcard[0].path.replace("\\", "/");;
        }
        if (req.files.tenth_marksheet) {
            fileHelper.deleteFile(user.tenthMarksheetUrl);
            tenthMarksheetUrl = req.files.tenth_marksheet[0].path.replace("\\", "/");;
        }
        if (req.files.twelve_marksheet) {
            fileHelper.deleteFile(twelveMarksheetUrl);
            twelveMarksheetUrl = req.files.twelve_marksheet[0].path.replace("\\", "/");;
        }
        if (req.files.graduation_document) {
            fileHelper.deleteFile(universityDocumentUrl);
            universityDocumentUrl = req.files.graduation_document[0].path.replace("\\", "/");;
        }
        if (req.files.photo) {
            studentPhotoUrl = req.files.photo[0].path.replace("\\", "/");;
        }
        user.courses = courses;
        user.college = college;
        user.name = name;
        user.fatherName = fatherName;
        user.fatherOccupation = fatherOccupation;
        user.dob = dob;
        user.category = category;
        user.email = email;
        user.address = address;
        user.state = state;
        user.district = district;
        user.pincode = pincode;
        user.contact = contact;
        user.maritalStatus = maritalStatus;
        user.height = height;
        user.weight = weight;
        user.paid = paid;
        user.bloodGroup = bloodGroup;
        user.tenthBoard = tenthBoard;
        user.tenthYear = tenthYear;
        user.tenthSubject = tenthSubject;
        user.tenthPercentage = tenthPercentage;
        user.twelveBoard = twelveBoard;
        user.twelveYear = twelveYear;
        user.twelveSubject = twelveSubject;
        user.twelvePercentage = twelvePercentage;
        user.aspiringUniversity = aspiringUniversity;
        user.aspiringYear = aspiringYear;
        user.aspiringSubject = aspiringSubject;
        user.aspiringPercentage = aspiringPercentage;
        user.graduationUniversity = graduationUniversity;
        user.graduationYear = graduationYear;
        user.graduationSubject = graduationSubject;
        user.graduationPercentage = graduationPercentage;
        user.idType = idType;
        user.idProofUrl = idProofUrl;
        user.studentPhotoUrl = studentPhotoUrl;
        user.tenthMarksheetUrl = tenthMarksheetUrl;
        user.twelveMarksheetUrl = twelveMarksheetUrl;
        user.universityDocumentUrl = universityDocumentUrl;
        const savedUser = await user.save();
        res.redirect('/admin/registeration');
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.deleteRegisteration = async(req, res, next) => {
    try {
        const _id = req.params._id;
        if (_id) {
            const user = await UserRegistration.findById(_id);
            if (user.idProofUrl && user.idProofUrl !== " ") {
                fileHelper.deleteFile(user.idProofUrl);
            }
            if (user.studentPhotoUrl && user.studentPhotoUrl !== " ") {
                fileHelper.deleteFile(user.studentPhotoUrl);
            }
            if (user.tenthMarksheetUrl && user.tenthMarksheetUrl !== ' ') {
                fileHelper.deleteFile(user.tenthMarksheetUrl);
            }
            if (user.twelveMarksheetUrl && user.twelveMarksheetUrl !== ' ') {
                fileHelper.deleteFile(user.twelveMarksheetUrl);
            }
            if (user.universityDocumentUrl && user.universityDocumentUrl !== " ") {
                fileHelper.deleteFile(user.universityDocumentUrl);
            }
            await user.remove();
            res.redirect('/admin/registeration');
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getCsv = async(req, res, next) => {
    try {
        const registeration = await UserRegistration.find().select('-_id -__v').lean();
        return jsonexport(registeration, function(err, csv) {
            if (err) throw err;
            res.setHeader('Content-disposition', 'attachment; filename=data.csv');
            res.set('Content-Type', 'text/csv');
            return res.status(200).send(csv);
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getEditRegisterationId = async(req, res, next) => {
    try {
        const user = await UserRegistration.findById(req.params._id);
        if (!user) {
            return res.render('edit-reg', { errorMessage: 'Invalid email or contact' });
        }
        const courses = await Course.find();
        const colleges = await College.find();
        res.render('edit-registeration', {
            errorMessage: null,
            user,
            courses,
            colleges
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getFilter = async(req, res, next) => {
    try {
        let registeration;
        if (req.body.course) {
            registeration = await UserRegistration.find({ courses: req.body.course }).select('-_id -__v').select('-_id -__v').lean();
        } else if (req.body.college) {
            registeration = await UserRegistration.find({ college: req.body.college }).select('-_id -__v').select('-_id -__v').lean();
        } else if (req.body.sdate && req.body.edate) {
            registeration = await UserRegistration.find({
                createdAt: {
                    $gte: moment(req.body.sdate).startOf('day').toDate(),
                    $lte: moment(req.body.edate).endOf('day').toDate()
                }
            }).select('-_id -__v').lean();
        } else {
            res.redirect('/admin/')
        }
        const courses = await Course.find();
        const colleges = await College.find();
        res.render('list', { users: registeration, courses, colleges });
        // `jsonexport(registeration, function(err, csv) {
        //     if (err) throw err;
        //     res.setHeader('Content-disposition', 'attachment; filename=data.csv');
        //     res.set('Content-Type', 'text/csv');
        //     return res.status(200).send(csv);
        // });`
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}