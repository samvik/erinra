
import { Component, View, bind, CORE_DIRECTIVES } from 'angular2/angular2';
import { RouteConfig, RouterOutlet, Route, Redirect, ROUTER_DIRECTIVES } from 'angular2/router';

import { GDriveStore } from '../utils/gdrive-store';

import { DatabaseList } from './database-list';
import { DatabaseView } from './database-view';
import { PasswordEdit } from './password-edit';

import { Spinner } from '../shared/spinner';

@Component({
  selector: 'database-router'
})
@View({
  templateUrl: 'src/components/database-router.html',
  directives: [CORE_DIRECTIVES, RouterOutlet, Spinner],
  styleUrls: ['src/components/database-router.css']
})
@RouteConfig([
  { path: '/', as: "DatabaseList", component: DatabaseList },
  { path: '/:db', as: "DatabaseView", component: DatabaseView },
  { path: '/:db/add', as: "PasswordAdd", component: PasswordEdit },
  { path: '/:db/:id', as: "PasswordEdit", component: PasswordEdit }
])
export class DatabaseRouter {
  private authInProgress: boolean = true;

  constructor(private store: GDriveStore) {
  }

  private afterViewInit() {
    if(!this.store.isAuthenticated) {
      this.store.authenticate(true).then(
        () => {
          this.authInProgress = false;
        },
        (error) => {
          console.log(error);
          this.authInProgress = false;
        }
      );
    }
    else {
      this.authInProgress = false;
    }
  }

  private authenticate() {
    this.store.authenticate(false);
  }
}
