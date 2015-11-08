
import { Component, View, bind } from 'angular2/angular2';
import { RouteConfig, Route, RouterOutlet } from 'angular2/router';

import { Dashboard } from './dashboard';
import { DatabaseRouter } from './database-router';
import { CreateDatabase } from './create-database';
import { Lock } from './lock';
import { About } from './about';

import { Navbar } from '../shared/navbar';

import { GDriveStore } from '../utils/gdrive-store';


@Component({
  selector: 'main',
  providers: [GDriveStore]
})
@View({
  templateUrl: 'src/components/main.html',
  directives: [Navbar, RouterOutlet]
})
@RouteConfig([
  new Route({ path: '/', as: "Dashboard", component: Dashboard }),
  new Route({ path: '/create', as: "DatabaseCreate", component: CreateDatabase }),
  new Route({ path: '/db/...', as: "DatabaseRouter", component: DatabaseRouter }),
  new Route({ path: '/lock', as: "Lock", component: Lock }),
  new Route({ path: '/about', as: "About", component: About })
])
export class Main {
  public constructor(){
  }
}
