const mongoose = require('mongoose')
const config = require('config-lite')

// mongodb 连接🔗
mongoose.connect(config.mongodb, { useMongoClient: true })
// 此处防止 node.js - Mongoose: mpromise 错误
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
	userEmail: String,
	professionalEmail: String,
	date: Date,
	start_time: Number, // 9 - 17
	end_time: Number, // 9 - 17
	message: String, 
})


var model = {
	// 在此处扩展 model，例如：
	// Article: mongoose.model('Article', articleSchema),
	User: mongoose.model('User', userSchema)
}

module.exports = model
