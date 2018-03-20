import Vue from 'vue'
import VueRouter from 'vue-router'
import routerLink from './router-link'

Vue.use(VueRouter)

const router = new VueRouter({
	// mode: 'hash',
  routes: routerLink
})

export default router
