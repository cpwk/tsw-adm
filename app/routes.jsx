import React from 'react';
import {HashRouter, Redirect, Route, Switch} from 'react-router-dom'
import Page from './components/common/Page';
import Login from './components/login/Login';
import Dashboard from './components/dashboard/Dashboard';
import Index from './Index';

import Admins from './components/admin/Admins';
import AdminEdit from './components/admin/AdminEdit';
import Roles from './components/admin/Roles';
import RoleEdit from './components/admin/RoleEdit';

import Banners from './components/banner/Banners'
import Orders from './components/order/Orders'
import Product from "./components/product/Product";
import Sort from "./components/sort/Sort";
import User from "./components/user/User";

const routes = (
    <HashRouter>
        <Switch>
            <Route path='/' children={() => (
                <Page>
                    <Switch>

                        <Redirect exact from='/' to='/app/dashboard/index'/>

                        <Route path='/' exact component={Index}/>

                        <Route path='/login' exact component={Login}/>

                        <Route path='/app' children={() => (
                            <Index>

                                <Route path='/app/dashboard/index' component={Dashboard}/>

                                <Route path={'/app/admin/admins'} component={Admins}/>
                                <Route path={'/app/admin/admin-edit/:id'} component={AdminEdit}/>
                                <Route path={'/app/admin/roles'} component={Roles}/>
                                <Route path={'/app/admin/role-edit/:id'} component={RoleEdit}/>
                                <Route path={'/app/info/banners'} component={Banners}/>
                                <Route path={'/app/info/product'} component={Product}/>
                                <Route path={'/app/info/sort'} component={Sort}/>
                                <Route path={'/app/info/user'} component={User}/>
                                <Route path={'/app/info/order'} component={Orders}/>
                            </Index>
                        )}/>

                    </Switch>
                </Page>
            )}>
            </Route>

        </Switch>
    </HashRouter>
);


export default routes;
