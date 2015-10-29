
import { Component, View, bind } from 'angular2/angular2';
import { RouteConfig, Route, RouterOutlet } from 'angular2/router';

import { Dashboard } from './dashboard';
import { DatabaseRouter } from './database-router';

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
  new Route({ path: '/db/...', as: "DatabaseRouter", component: DatabaseRouter })
])
export class Main {
  public constructor(){
  }
}
