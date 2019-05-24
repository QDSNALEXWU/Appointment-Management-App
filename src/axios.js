import axios from 'axios'
import router from './router/index'
import store from './store/index'
import * as types from './store/types'

//
axios.default.timeout = 5000
axios.defaults.headers.post['Content-Type'] = 'application/json'

const instance = axios.create();
instance.defaults.headers.post['Content-Type'] = 'application/json'

axios.interceptors.request.use = instance.interceptors.request.use
instance.interceptors.request.use(config => {
	if(localStorage.getItem('token')) {
		config.headers.Authorization = `token ${localStorage.getItem('token')}`
			.replace(/(^\")|(\"$)/g, '')
	}
	return config
}, err => {
	return Promise.reject(err)
})
// axios interception 
instance.interceptors.response.use(response => {
	return response
}, err => {
	return Promise.reject(err)
})

export default {
	// user register
	userRegister(data) {
		return instance.post('/api/register', data)
	},
	// user login
	UserLogin(data) {
		return instance.post('/api/login', data)
	},
	// get user
	getUser() {
		return instance.get('/api/user')
	},
	// get user
	updateUser(data) {
		return instance.post('/api/update', data)
	},
	// get user by email
	getUserByEmail(email) {
		return instance.get('/api/user/' + email)
	},
	// delter user
	delUser(data) {
		return instance.post('/api/delUser', data)
	},
	// add professional
	addPro(data) {
		return instance.post('/api/professional', data)
	},
	// get all professionals
	getPros() {
		return instance.get('/api/professional')
	},
	// add a appointment 
	addApp(data) {
		return instance.post('/api/appointments',data)
	},
	// add a appointment 
	getApps() {
		return instance.get('/api/appointments')
	},
	getAppsTime(data) {
		return instance.post('/api/appointmentsTime', data)
	},
	// add a appointment 
	getAppsbyUserID(UID) {
		return instance.get('/api/appointments/' + UID)
	},
	// del a appointment
	delApp(data) {
		return instance.post('/api/delApps',data)
	},
}
