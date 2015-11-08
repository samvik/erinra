
import { Component, View, CORE_DIRECTIVES } from 'angular2/angular2';
import { RouteParams } from 'angular2/router';

import { GDriveStore } from '../utils/gdrive-store';
import { DatabaseDescription, Database } from '../utils/store';
import { RouterLink } from 'angular2/router';

import { MaskPasswordPipe } from '../utils/mask-password-pipe';

import { UnlockDatabase } from '../shared/unlock-database';

enum StateEnum {
  NOT_LOADED,
  LOCKED,
  LOADING,
  UNLOCKED,
  ERROR
};

@Component({
  selector: 'database-view'
})
@View({
  templateUrl: 'src/components/database-view.html',
  directives: [CORE_DIRECTIVES, RouterLink, UnlockDatabase],
  pipes: [MaskPasswordPipe]
})
export class DatabaseView {
  private title : string;
  private store: GDriveStore;
  private visiblePasswords: Array<number> = [];
  private errorMessage: string = "";

  public State = StateEnum;
  private state: StateEnum = StateEnum.NOT_LOADED;

  private dbDesc: DatabaseDescription;

  public constructor(store: GDriveStore, params: RouteParams) {
    this.store = store;
    this.title = params.get("db");

    if(!this.store.database || this.store.database.name != this.title) {
      this.store.unloadDatabase();

      this.state = StateEnum.LOADING;
      this.store.listDatabases("title = '" + this.title + "'")
        .then(
          (result : Array<DatabaseDescription>) => {
            if(result && result.length > 0) {
              return result[0];
            }
            return Promise.reject<any>("Database not found.");
          })
        .then(
          (db: DatabaseDescription) => {
            this.dbDesc = db;
            this.state = StateEnum.LOCKED;
          },
          (error) => {
            this.state = StateEnum.ERROR;
            this.errorMessage = error;
            console.log(error);
          });
    }
    else {
      // Database allready unlocked.
      this.state = StateEnum.UNLOCKED;
    }
  }

  private unlock(password: string): void {
    this.state = StateEnum.LOADING;
    this.store.loadDatabase(this.dbDesc, password).then(
        (db: Database) => {
          this.state = StateEnum.UNLOCKED;
        },
        (error) => {
          this.errorMessage = error;
          this.state = StateEnum.LOCKED;
        }
      );
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
