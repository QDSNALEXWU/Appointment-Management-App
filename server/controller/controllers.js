const express = require('express')
const model = require('../db/db.js')
const router = express.Router()
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')
const createToken = require('../middleware/createToken.js')
const sha1 = require('sha1')
const nodemailer = require("nodemailer")
var smtpTransport = require('nodemailer-smtp-transport');


var transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
        user: "avengers-health-care@outlook.com",
        pass: "WHYwhy1994!"
    }
});

// verify connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
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
				firstName: doc.first_name,
				lastName: doc.last_name,
				time: moment(objectIdToTimestamp(doc._id))
					.format('YYYY-MM-DD HH:mm:ss'),
				token: createToken(name),
				admin: name == 'admin@avgeners.healthcare.com'
			})
		} else {
			res.json({
				success: false
			})
		}
	})
}

// Update a user
const Update = (req, res) => {
	
	var query = {"email": req.body.email};
	var update = {
		email: req.body.email,
		password: sha1(req.body.password),
		first_name: req.body.firstName,
		last_name: req.body.lastName,
		address: req.body.address,
		number: req.body.number,
		token: createToken(this.email)
	}
	if (req.body.password) {
		update.password = req.body.password
	}
	var options = {new: true};
	model.User.findOneAndUpdate(query, update, options, function(err, user) {
  		if (err) {
    		console.log('got an error');
    		res.json({
				success: false
			})
  		} else {
  			console.log('register success')
			res.json({
				success: true
			})
  		}
	});
}
	


// Get all Users
const User = (req, res) => {
	model.User.find({}, (err, doc) => {
		if(err) console.log(err)
		res.send(doc)
	})
}

// Get User by Email
const getUserByEmail = (req, res) => {
	let email = req.params.email
	model.User.findOne({email: email}, (err, doc) => {
		if(err) {
			console.log(err)
		} else {
			res.send(doc)
		}
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
		start_time: req.body.startTime, // 9 - 17
		end_time: req.body.endTime, // 9 - 17
		message: req.body.message,
		Professional: req.body.professional._id,
		User: req.body.user._id
	})
	
	let email = req.body.professional.email
	let user = req.body.user
	let professional = req.body.professional
	
	Appointment.save(err => {
		if(err) {
			console.log(err)
			res.json({
				success: false
			})
		} else {
			console.log('add appointment success')
			res.json({
				success: true
			})
			
			console.log('--------- sending email ' + email + ' ------')
			// send a email to Professional
			const mailOptions = {
  				from: 'avengers-health-care@outlook.com', // sender address
  				to: email, // receivers
  				subject: 'New Appointment Reservation', // Subject line
  				html: `<p>Dear ${professional.first_name}, </p>
  					   <p>You have a new appointment reservation on ${req.body.date.split("T")[0]} from ${req.body.startTime}:00 to ${req.body.endTime}:00</p>
  					   <p> Customer Name: ${user.first_name} ${user.last_name}</p>
  					   <p> Customer Email: ${user.email}</p>
  					   <p> Customer Phone: ${user.number}</p>
  					   <p> Customer Address: ${user.address}</p>
  					   <p> Message: ${req.body.message}</p>
  					   <p> Thanks </p>
  					   <p> Avengers Health Care Team </p>`// plain text body
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
			});
		}
	})
} 

//get all appointments
const getAppointments = (req, res) => {
	model.Appointment
	.find()
	.populate({path: 'Professional'})
	.populate({path: 'User'})
	.exec(function(err, doc) {
		if(err) console.log(err)
		console.log(doc)
		res.send(doc)
	});
}

const getAppointmentsByDateProfessional = (req, res) => {
	console.log(req.body.date,req.body.professional)
	model.Appointment
	.find({
		date: new Date(req.body.date),
		Professional: { "$in" : [req.body.professional]}
	}).exec(function(err, doc) {
		if(err) console.log(err)
		console.log(doc)
		res.send(doc)
	});
}


//get appointments by user email 
const getAppointmentsByUserID = (req, res) => {
	let ID = req.params.userID
	model.Appointment
	.find({User: { "$in" : [ID]}})
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
	.findOneAndRemove({_id: req.body.id })
	.populate({path: 'Professional'})
	.populate({path: 'User'})
	.exec( (err,doc) => {
		if(err) {
			console.log(err)
			res.json({
				success: false
			})
		} else {
			console.log('remove appointment success')
			let user = doc.User[0]
			let professional = doc.Professional[0]
			let email = professional.email

			console.log('--------- sending email ' + email + ' ------')
			// send a email to Professional
			const mailOptions = {
  				from: 'avengers-health-care@outlook.com', // sender address
  				to: email, // receivers
  				subject: 'Appointment Cancelation', // Subject line
  				html: `<p>Dear ${professional.first_name}, </p>
  					   <p>The appointment reservation on ${moment(doc.date).format('YYYY-MM-DD')} from ${doc.start_time}:00 to ${doc.end_time}:00 has been canceled</p>
  					   <p> Customer Name: ${user.first_name} ${user.last_name}</p>
  					   <p> Customer Email: ${user.email}</p>
  					   <p> Customer Phone: ${user.number}</p>
  					   <p> Customer Address: ${user.address}</p>
  					   <p> Thanks </p>
  					   <p> Avengers Health Care Team </p>`// plain text body
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
			});
		}
	})
}




var Controller = {
	Register: Register,
	Login: Login,
	User:User,
	delUser:delUser,
	Update:Update,
	addProfessional:addProfessional,
	getProfessionals:getProfessionals,
	addAppointment:addAppointment,
	getAppointments:getAppointments,
	delAppointment:delAppointment,
	getUserByEmail:getUserByEmail,
	getAppointmentsByUserID:getAppointmentsByUserID,
	getAppointmentsByDateProfessional:getAppointmentsByDateProfessional,
}

module.exports = Controller;
