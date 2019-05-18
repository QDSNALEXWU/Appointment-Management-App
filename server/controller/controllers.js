const express = require('express')
const model = require('../db/db.js')
const router = express.Router()
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')
const createToken = require('../middleware/createToken.js')
const sha1 = require('sha1')
const nodemailer = require("nodemailer")


// emailer set up 
var transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
        user: 'appointmentsmanagementteam@gmail.com',
        pass: 'Whywhy1994!'
    }
});

// ************** USERS *************************//
// Add a user
const Register = (req, res) => {
	let userRegister = new model.User({
		email: req.body.email,
		password: sha1(req.body.password),
		recheck: req.body.recheck,
		first_name: req.body.firstName,
		last_name: req.body.lastName,
		address: req.body.address,
		number: req.body.number,
		token: createToken(this.email)
	})

	// change objectid to user create time
	userRegister.create_time = moment(objectIdToTimestamp(userRegister._id))
		.format('YYYY-MM-DD HH:mm:ss');

	model.User.findOne({
		email: (userRegister.email)
			.toLowerCase()
	}, (err, doc) => {
		if(err) console.log(err)
		// user already extits
		if(doc) {
			res.json({
				success: false
			})
		} else {
			userRegister.save(err => {
				if(err) console.log(err)
				console.log('register success')
				res.json({
					success: true
				})
			})
		}
	})
}

// Sign in 
const Login = (req, res) => {
	let userLogin = new model.User({
		email: req.body.email,
		password: sha1(req.body.password),
		token: createToken(this.email)
	})
	model.User.findOne({ email: userLogin.email }, (err, doc) => {
		if(err) console.log(err)
		if(!doc) {
			res.json({
				info: false
			})
		} else if(userLogin.password === doc.password) {
			var name = req.body.email;
			res.json({
				success: true,
				email: doc.email,
				time: moment(objectIdToTimestamp(doc._id))
					.format('YYYY-MM-DD HH:mm:ss'),
				token: createToken(name)
			})
		} else {
			res.json({
				success: false
			})
		}
	})
}

// Add a user
/*const Update = (req, res) => {
	let userRegister = new model.User({
		email: req.body.email,
		password: sha1(req.body.password),
		recheck: req.body.recheck,
		first_name: req.body.firstName,
		last_name: req.body.lastName,
		address: req.body.address,
		number: req.body.number,
		token: createToken(this.email)
	})

	// change objectid to user create time
	userRegister.create_time = moment(objectIdToTimestamp(userRegister._id))
		.format('YYYY-MM-DD HH:mm:ss');

	model.User.findOne({
		email: (userRegister.email)
			.toLowerCase()
	}, (err, doc) => {
		if(err) console.log(err)
		// user already extits
		if(doc) {
			res.json({
				success: false
			})
		} else {
			userRegister.save(err => {
				if(err) console.log(err)
				console.log('register success')
				res.json({
					success: true
				})
			})
		}
	})
}*/


// Get all Users
const User = (req, res) => {
	model.User.find({}, (err, doc) => {
		if(err) console.log(err)
		res.send(doc)
	})
}

// Delete User
const delUser = (req, res) => {
	model.User.findOneAndRemove({ _id: req.body.id }, err => {
		if(err) console.log(err)
		console.log('successful delete')
		res.json({
			success: true
		})
	})
}


// ************** Professionals *************************//
// add a new professional
const addProfessional = (req, res) => {
	// create the schema
	let Professional = new model.Professional({
		type: req.body.professionalType,
		first_name: req.body.firstName,
		last_name: req.body.lastName,
		email: req.body.email,
		charge: req.body.charge,
	})

	model.Professional.findOne({
		email: (Professional.email)
			.toLowerCase()
	}, (err, doc) => {
		if(err) console.log(err)
		// prfessional already extits
		if(doc) {
			res.json({
				success: false
			})
		} else {
			Professional.save(err => {
				if(err) console.log(err)
				console.log('add professional success')
				res.json({
					success: true
				})
			})
		}
	})

}


//get all professional
const getProfessionals = (req, res) => {
	model.Professional.find({}, (err, doc) => {
		if(err) console.log(err)
		res.send(doc)
	})
}


// ************** Appointments *************************//
// add a new appointment
const addAppointment = (req, res) => {
	console.log('--------- Add Appointment -------')
	console.log(req.body)
	let Appointment = new model.Appointment({
		date: req.body.date,
		start_time: Number(req.body.startTime.split(":")[0]), // 9 - 17
		end_time: Number(req.body.endTime.split(":")[0]), // 9 - 17
		message: req.body.message,
		Professional: req.body.professional._id,
		User: req.body.user._id
	})
	
	let email = req.body.professional.email
	
	Appointment.save(err => {
		if(err) {
			console.log(err)
			res.json({
				success: false
			})
		} else {
			console.log('add appointment success')
			res.json({
				success: false
			})
			/*console.log('--------- sending email -------')
			// send a email to Professional
			const mailOptions = {
  				from: 'AppointmentsManagementTeam@gmail.com', // sender address
  				to: email, // receivers
  				subject: 'Appointment Reservation', // Subject line
  				html: '<p>Your html here</p>'// plain text body
			};

			transporter.sendMail(mailOptions, function (err, info) {
   				if(err) {
   					console.log(err)
					res.json({
						success: false
					})
   				} else {
   					console.log(info);
					res.json({
						success: true
					})
   				}
			});*/
		}
	})
} 

//get all appointments
const getAppointments = (req, res) => {
	model.Appointment
	.find()
	.populate({path: 'Professional'})
	.exec(function(err, doc) {
		if(err) console.log(err)
		console.log(doc)
		res.send(doc)
	});
}

//delete an appointment 
const delAppointment = (req, res) => {
	model.Appointment
	.findOneAndRemove({ _id: req.body.id }, err => {
		if(err) {
			console.log(err)
			res.json({
				success: false
			})
		} else {
			console.log('add appointment success')
			// send a email to Professional
			res.json({
				success: true
			})
		}
	})
}




var Controller = {
	Register: Register,
	Login: Login,
	User:User,
	delUser:delUser,
	addProfessional:addProfessional,
	getProfessionals:getProfessionals,
	addAppointment:addAppointment,
	getAppointments:getAppointments,
	delAppointment:delAppointment
}

module.exports = Controller;
