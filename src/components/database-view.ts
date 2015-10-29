
import { Component, View, CORE_DIRECTIVES } from 'angular2/angular2';
import { RouteParams } from 'angular2/router';

import { GDriveStore, DatabaseDescription, Database } from '../utils/gdrive-store';
import { RouterLink } from 'angular2/router';

import { MaskPasswordPipe } from '../utils/mask-password-pipe';

@Component({
  selector: 'database-view'
})
@View({
  templateUrl: 'src/components/database-view.html',
  directives: [CORE_DIRECTIVES, RouterLink],
  pipes: [MaskPasswordPipe]
})
export class DatabaseView {
  private title : string;

  private store: GDriveStore;

  private visiblePasswords: Array<number> = [];

  private errorMessage: string = "";


  public constructor(store: GDriveStore, params: RouteParams) {
    this.store = store;
    this.title = params.get("db");

    if(!this.store.database || this.store.database.name != this.title) {
      this.store.unloadDatabase();

      this.errorMessage = "";

      this.store.listDatabases("title = '" + this.title + "'")
        .then(
          (result : Array<DatabaseDescription>) => {
            if(result && result.length > 0) {
              return result[0];
            }
            throw "Database not found.";
          })
        .then(
          (db: DatabaseDescription) => {
            return this.store.loadDatabase(db);
          })
        .then(
          (db: Database) => {
          },
          (error) => {
            this.errorMessage = error;
            console.log(error);
          }
        );

    }
  }

  private delete(index: number): void {
    this.store.database.passwords.splice(index, 1);
    this.store.save();
  }

  private togglePasswordVisible(index: number): void {
    var pos: number = this.visiblePasswords.indexOf(index);
    if(pos == -1) {
      this.visiblePasswords.push(index);
    }
    else {
      this.visiblePasswords.splice(pos, 1);
    }
  }

  private isVisible(i: number): boolean {
    return this.visiblePasswords.indexOf(i) >= 0;
  }

}
