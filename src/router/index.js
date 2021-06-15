import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Borrow from '../components/User/Borrow'
import Record from '../components/User/Record'
import Audit from '../components/Manager/Audit'
import Edit from '../components/Manager/Edit'
import Users from '../components/Manager/Users'
import Message from '../components/Manager/Message'

Vue.use(Router)

export default new Router({
  base: '/borrow/',
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      redirect: '/borrow',
      children: [
        {
          path: '/borrow',
          name: 'borrow',
          component: Borrow,
          meta: {
            requireAuth: true,
            userType: 'all'
          }
        },
        {
          path: '/record',
          name: 'Record',
          component: Record,
          meta: {
            requireAuth: true,
            userType: 'normal'
          }
        },
        // 管理员专属
        {
          path: '/audit',
          name: 'Audit',
          component: Audit,
          meta: {
            requireAuth: true,
            userType: 'admin'
          }
        },
        {
          path: '/edit',
          name: 'Edit',
          component: Edit,
          meta: {
            requireAuth: true,
            userType: 'admin'
          }
        },
        {
          path: '/message',
          name: 'Message',
          component: Message,
          meta: {
            requireAuth: true,
            userType: 'admin'
          }
        },
        {
          path: '/users',
          name: 'Users',
          component: Users,
          meta: {
            requireAuth: true,
            userType: 'admin'
          }
        }
      ]
    }
  ]
})
