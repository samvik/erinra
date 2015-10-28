
import { Component, View, bind } from 'angular2/angular2';
import { RouteConfig, Route, Redirect, ROUTER_DIRECTIVES } from 'angular2/router';

import { Navbar } from '../shared/navbar';

import { GDriveStore } from '../utils/gdrive-store';

import { Dashboard } from './dashboard';
import { Authenticate } from './authenticate';
import { DatabaseList } from './database-list';
import { DatabaseView } from './database-view';
import { PasswordEdit } from './password-edit';

import { AuthenticateRouterOutlet } from '../utils/authenticate-router-outlet';
@Component({
  selector: 'main',
  viewProviders: [GDriveStore]
})
@View({
  templateUrl: 'src/components/main.html',
  directives: [Navbar, AuthenticateRouterOutlet]
})
@RouteConfig([
  new Route({ path: '/', as: "Dashboard", component: Dashboard }),
  new Route({ path: '/authenticate', as: "Authenticate", component: Authenticate }),
  new Route({ path: '/db', as: "DatabaseList", component: DatabaseList }),
  new Route({ path: '/db/:db', as: "DatabaseView", component: DatabaseView }),
  new Route({ path: '/db/:db/add', as: "PasswordAdd", component: PasswordEdit }),
  new Route({ path: '/db/:db/:id', as: "PasswordEdit", component: PasswordEdit })

])
export class Main {
  constructor(){
  }
}
