
import { Component, View, CORE_DIRECTIVES } from 'angular2/angular2';
import { RouterLink} from 'angular2/router';
import { GDriveStore, DatabaseDescription } from '../utils/gdrive-store';
import { CreateDatabase } from '../shared/create-database';

@Component({
  selector: 'database-list'
})
@View({
  templateUrl: 'src/components/database-list.html',
  directives: [CORE_DIRECTIVES, CreateDatabase, RouterLink]
})
export class DatabaseList {
  private loading: boolean = true;
  private errorMessage: string = "";

  public constructor(private store : GDriveStore) {
  }

  private afterViewInit() : void {
    this.loading = true;
    this.errorMessage = "";

    this.store.loadDatabaseList().then(
      (resp) => {
        this.loading = false
      },
      (error) => {
        this.loading = false;
        this.errorMessage = error;
        console.log(error);
      });
  }

  private delete(desc : DatabaseDescription) : void {
    this.store.deleteDatabase(desc);
  }

}