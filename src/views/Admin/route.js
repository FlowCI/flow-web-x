import React from 'react'
import { Route, IndexRedirect } from 'react-router'
import Component from './index'

import AgentsRoute from './Agents/route'
import CredentialsRoute from './Credentials/route'
import FlowsRoute from './Flows/route'
import MembersRoute from './Members/route'
import NotifyRoute from './Notify/route'
import PluginsRoute from './Plugins/route'
import SystemRoute from './System/route'

export const createRoutes = (path, store) => {
  return <Route path={path} component={Component}>
    <IndexRedirect to='/admin/flows' />
    {FlowsRoute('flows', store)}
    {MembersRoute('members', store)}
    {AgentsRoute('agents', store)}
    {CredentialsRoute('credentials', store)}
    {NotifyRoute('notify', store)}
    {SystemRoute('system', store)}
    {PluginsRoute('plugins', store)}
  </Route>
}

export default createRoutes
