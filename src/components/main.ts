
import { Component, View, bind } from 'angular2/angular2';
import { RouteConfig, Route, Redirect, ROUTER_DIRECTIVES } from 'angular2/router';

import { Navbar } from '../shared/navbar';

import { GDriveStore } from '../utils/gdrive-store';

import { DatabaseList } from './database-list';
import { DatabaseView } from './database-view';
import { PasswordEdit } from './password-edit';

@Component({
  selector: 'main',
  viewProviders: [GDriveStore]
})
@View({
  templateUrl: 'src/components/main.html',
  directives: [Navbar, ROUTER_DIRECTIVES]
})
@RouteConfig([
  new Route({ path: '/', as: "DatabaseList", component: DatabaseList }),
  new Route({ path: '/:db', as: "DatabaseView", component: DatabaseView }),
  new Route({ path: '/:db/:id', as: "PasswordEdit", component: PasswordEdit }),
  new Route({ path: '/:db/add', as: "PasswordAdd", component: PasswordEdit }),
])
export class Main {
  constructor(){
  }
}
