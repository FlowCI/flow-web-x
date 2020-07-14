import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/view/Home/Login'

import FlowHome from '@/view/Flow/Index'
import FlowOverview from '@/view/Flow/Overview'
import FlowSettings from '@/view/Flow/Settings'
import FlowStatistic from '@/view/Flow/Statistic'

import JobList from '@/view/Job/List'
import JobDetail from '@/view/Job/Detail'

import SettingsHome from '@/view/Settings/Home'
import SettingsProfileHome from '@/view/Settings/Profile/Index'

import SettingsUsersHome from '@/view/Settings/Users/Index'
import SettingsUsersNew from '@/view/Settings/Users/New'
import SettingsUsersEdit from '@/view/Settings/Users/Edit'

import SettingsAgentHome from '@/view/Settings/Agent/Index'
import SettingsAgentNew from '@/view/Settings/Agent/NewAgent'
import SettingsAgentEdit from '@/view/Settings/Agent/EditAgent'
import SettingsHostNew from '@/view/Settings/Agent/NewHost'

import SettingsSecretHome from '@/view/Settings/Secret/Index'
import SettingsSecretNew from '@/view/Settings/Secret/New'
import SettingsSecretEdit from '@/view/Settings/Secret/Edit'

import SettingsConfigHome from '@/view/Settings/Config/Index'
import SettingsConfigNew from '@/view/Settings/Config/New'
import SettingsConfigEdit from '@/view/Settings/Config/Edit'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '',
      redirect: '/flows'
    },
    {
      path: '/flows',
      name: 'FlowHome',
      component: FlowHome,
      children: [
        {
          path: '',
          name: 'Overview',
          component: FlowOverview
        },
        {
          path: ':id/settings',
          name: 'Settings',
          component: FlowSettings
        },
        {
          path: ':id/statistic',
          name: 'Statistic',
          component: FlowStatistic
        },
        {
          path: ':id/jobs',
          name: 'Jobs',
          component: JobList
        },
        {
          path: ':id/jobs/:num',
          name: 'JobDetail',
          component: JobDetail
        }
      ]
    },
    {
      path: '/settings',
      name: 'Settings',
      component: SettingsHome,
      children: [
        {
          path: 'profile',
          name: 'SettingsProfileHome',
          component: SettingsProfileHome
        },

        {
          path: 'users',
          name: 'SettingsUsersHome',
          component: SettingsUsersHome
        },
        {
          path: 'users/new',
          name: 'SettingsUsersNew',
          component: SettingsUsersNew
        },
        {
          path: 'users/edit',
          name: 'SettingsUsersEdit',
          component: SettingsUsersEdit,
          props: true
        },

        {
          path: 'agents',
          name: 'SettingsAgentHome',
          component: SettingsAgentHome
        },
        {
          path: 'agents/new',
          name: 'SettingsAgentNew',
          component: SettingsAgentNew
        },
        {
          path: 'agents/edit/:name',
          name: 'SettingsAgentEdit',
          component: SettingsAgentEdit,
          props: true
        },
        {
          path: 'agents/host/new',
          name: 'SettingsHostNew',
          component: SettingsHostNew
        },
        {
          path: 'agents/host/edit/:name',
          name: 'SettingsHostNew',
          component: SettingsHostNew
        },

        {
          path: 'secrets',
          name: 'SettingsSecretHome',
          component: SettingsSecretHome
        },
        {
          path: 'secrets/new',
          name: 'SettingsSecretNew',
          component: SettingsSecretNew,
          props: true
        },
        {
          path: 'secrets/edit',
          name: 'SettingsSecretEdit',
          component: SettingsSecretEdit,
          props: true
        },

        {
          path: 'configs',
          name: 'SettingsConfigHome',
          component: SettingsConfigHome,
        },
        {
          path: 'configs/new',
          name: 'SettingsConfigNew',
          component: SettingsConfigNew,
          props: true
        },
        {
          path: 'configs/edit',
          name: 'SettingsConfigEdit',
          component: SettingsConfigEdit,
          props: true
        }
      ]
    }
  ]
})
