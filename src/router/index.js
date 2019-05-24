import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index.js'

Vue.use(Router)

const router = new Router({
	routes: [{
			path: '/user',
			name: 'User',
			component(resolve) {
				require.ensure(['@/components/User.vue'], () => {
					resolve(require('@/components/User.vue'));
				});
			},
			meta: {
				requireAuth: true
			}
		},
		{
			path: '/admin',
			name: 'Admin',
			component(resolve) {
				require.ensure(['@/components/Admin.vue'], () => {
					resolve(require('@/components/Admin.vue'));
				});
			},
			/*
			meta: {
				requireAuth: true
			}*/
		},
		{
			path: '/login',
			name: 'login',
			component(resolve) {
				require.ensure(['@/components/Login.vue'], () => {
					resolve(require('@/components/Login.vue'));
				});
			}
		},
		{
			path: '/',
			name: 'login',
			component(resolve) {
				require.ensure(['@/components/Login.vue'], () => {
					resolve(require('@/components/Login.vue'));
				});
			}
		},
		{
			path: '/register',
			name: 'register',
			component(resolve) {
				require.ensure(['@/components/Register.vue'], () => {
					resolve(require('@/components/Register.vue'));
				});
			}
		},
		/*
		{
			path: '/schedule',
			name: 'schedule',
			component(resolve) {
				require.ensure(['@/components/Schedule.vue'], () => {
					resolve(require('@/components/Schedule.vue'));
				});
			}
		},*/
		// 404 page
		{
			path: '*',
			component(resolve) {
				require.ensure(['@/components/404.vue'], () => {
					resolve(require('@/components/404.vue'));
				});
			},
			hidden: true
		}
	]
})

// 验证 token，存在才跳转
router.beforeEach((to, from, next) => {
	let token = localStorage.getItem('token')
	if(to.meta.requireAuth) {
		if(token) {
			next()
		} else {
			next({
				path: '/login',
				query: { redirect: to.fullPath }
			})
		}
	} else {
		next()
	}
})

export default router
