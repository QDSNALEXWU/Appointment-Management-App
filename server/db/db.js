const mongoose = require('mongoose')
const config = require('config-lite')
const Schema = mongoose.Schema;

// mongodb connection🔗
mongoose.connect(config.mongodb, { useMongoClient: true })
//  node.js - Mongoose: mpromise
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connect error'))
db.once('open', function () {
	console.log('Mongodb started successfully')
})

// user schema
var userSchema = mongoose.Schema({
	email: String,
	password: String,
	first_name: String,
	last_name: String,
	address: String,
	number: String,
	recheck: String,
	token: String,
	create_time: Date
})

// health care professional schema
var professionalSchema = mongoose.Schema({
	type: String,
	first_name: String,
	last_name: String,
	email: String,
	charge: Number
})

//appointment schema
var appointmentSchema = mongoose.Schema({
	date: Date,
	start_time: Number, // 9 - 17
	end_time: Number, // 9 - 17
	message: String,
	Professional: [{ type: Schema.Types.ObjectId, ref: 'Professional' }],
	User: [{ type: Schema.Types.ObjectId, ref: 'User' }],
})

//admin 
var adminSchema = mongoose.Schema({
	Email: String, // system recognizable email 
	password: String, //default passward
})


var model = {
	// Article: mongoose.model('Article', articleSchema),
	User: mongoose.model('User', userSchema),
	Professional: mongoose.model('Professional', professionalSchema),
	Appointment: mongoose.model('Appointment', appointmentSchema)
}

module.exports = model
