
import { Component, View, bind } from 'angular2/angular2';
import { RouteConfig, RouterOutlet } from 'angular2/router';

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
  { path: '/', as: "Dashboard", component: Dashboard },
  { path: '/create', as: "DatabaseCreate", component: CreateDatabase },
  { path: '/db/...', as: "DatabaseRouter", component: DatabaseRouter },
  { path: '/lock', as: "Lock", component: Lock },
  { path: '/about', as: "About", component: About }
])
export class Main {
  public constructor(){
  }
}
