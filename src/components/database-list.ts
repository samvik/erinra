
import { Component, View, NgIf, NgFor } from 'angular2/angular2';
import { RouterLink} from 'angular2/router';
import { GDriveStore, DatabaseDescription } from '../utils/gdrive-store';
import { CreateDatabase } from '../shared/create-database';

@Component({
  selector: 'database-list'
})
@View({
  templateUrl: 'src/components/database-list.html',
  directives: [NgIf, NgFor, CreateDatabase, RouterLink]
})
export class DatabaseList {
  store : GDriveStore;

  public constructor(store : GDriveStore) {
    this.store = store;
    this.store.authenticate(true).then(() => this.store.loadDatabaseList());
  }

  private _authenticate() : void {
    this.store.authenticate(false).then(() => this.store.loadDatabaseList());
  }

  private _new() : void {

  }

  private delete(desc : DatabaseDescription) : void {
    this.store.deleteDatabase(desc);
  }

}
