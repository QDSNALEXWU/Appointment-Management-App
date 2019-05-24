// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import 'vue-event-calendar/dist/style.css'
import vueEventCalendar from 'vue-event-calendar'
import axios from './axios'
import store from './store/index.js'
import moment from 'moment'
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
	faUser, 
	faUserTie, 
	faCalendar,
	faBook
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

Vue.use(ElementUI)

Vue.use(vueEventCalendar, {locale: 'en'})

library.add(faUser)
library.add(faUserTie)
library.add(faCalendar)
library.add(faBook)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).format('MM/DD/YYYY')
  }
});

/* eslint-disable no-new */
new Vue({
		axios,
		store,
		router,
		render: h => h(App)
	})
	.$mount('#app')

