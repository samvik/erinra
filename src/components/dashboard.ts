
import { Component, View, NgIf, NgFor } from 'angular2/angular2';
import { GDriveStore } from '../utils/gdrive-store';


@Component({
  selector: 'database-list'
})
@View({
  template: 'Dashboard'
})
export class Dashboard {
  store : GDriveStore;

  public constructor(store : GDriveStore) {
    this.store = store;
  }
}
