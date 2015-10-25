
import { Component, View, NgIf, NgFor } from 'angular2/angular2';
import { RouteParams } from 'angular2/router';

import { GDriveStore, DatabaseDescription } from '../utils/gdrive-store';
import { RouterLink } from 'angular2/router';

import { MaskPasswordPipe } from '../utils/mask-password-pipe';

@Component({
  selector: 'database-view'
})
@View({
  templateUrl: 'src/components/database-view.html',
  directives: [NgIf, NgFor, RouterLink],
  pipes: [MaskPasswordPipe]
})
export class DatabaseView {
  private title : string;

  private store: GDriveStore;
  private errorMessage: string;
  private visiblePassword: number = -1;

  public constructor(store: GDriveStore, params: RouteParams) {
    this.store = store;
    this.title = params.get("db");



    if(!this.store.isAuthenticated) {
      this.errorMessage = "Authentication needed.";
    }
    else if(!this.store.database || this.store.database.name != this.title) {
      this.store.listDatabases("title = '" + this.title + "'").then(
        (result : Array<DatabaseDescription>) => {
          if(result && result.length > 0) {
            this.store.loadDatabase(result[0]);
          }
          else {
            this.errorMessage = "Database not found.";
          }
        }
      );
    }
  }

  public delete(index: number) : void {
    this.store.database.passwords.splice(index, 1);
    this.store.save();
  }


  private togglePasswordVisible(index : number) : void {
    this.visiblePassword = index;
  }

}
