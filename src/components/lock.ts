
import { Component, View, NgIf, NgFor } from 'angular2/angular2';
import { GDriveStore } from '../utils/gdrive-store';


@Component({
  selector: 'database-list'
})
@View({
  templateUrl: 'src/components/lock.html'
})
export class Lock {
  public constructor(store : GDriveStore) {
    console.log("Databases locked!");
    store.unloadDatabase();
  }
}
