
import { Component, View, CORE_DIRECTIVES } from 'angular2/angular2';
import { RouteParams } from 'angular2/router';

import { GDriveStore } from '../utils/gdrive-store';
import { DatabaseDescription, Database } from '../utils/store';
import { RouterLink } from 'angular2/router';

import { MaskPasswordPipe } from '../utils/mask-password-pipe';
import { FilterPipe } from '../utils/filter-pipe';
import { OrderByPipe } from '../utils/order-by-pipe';

import { UnlockDatabase } from '../shared/unlock-database';
import { PasswordStrengthBar } from '../shared/password-strength-bar';
import { SearchBox } from '../shared/search-box';

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
  styleUrls: ['src/components/database-view.css'],
  directives: [CORE_DIRECTIVES, RouterLink,
    UnlockDatabase, PasswordStrengthBar, SearchBox],
  pipes: [MaskPasswordPipe, FilterPipe, OrderByPipe]
})
export class DatabaseView {
  private title : string;
  private store: GDriveStore;
  private visiblePasswords: Array<number> = [];
  private errorMessage: string = "";

  public State = StateEnum;
  private state: StateEnum = StateEnum.NOT_LOADED;

  private dbDesc: DatabaseDescription;

  private filterExpression: string = "";

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

  private getIndexFromId(id: number): number {
    var index = -1;
    for(var i = 0; i < this.store.database.passwords.length; ++i) {
      if(this.store.database.passwords[i].id == id) {
        index = i;
        break;
      }
    }
    return index;
  }

  private delete(id: number): void {
    var index = this.getIndexFromId(id);
    if(index != -1) {
      this.store.database.passwords.splice(index, 1);
      this.store.save();
    }
  }

  private togglePasswordVisible(id: number): void {
    var index = this.getIndexFromId(id);
    if(index != -1) {
      var pos: number = this.visiblePasswords.indexOf(index);
      if(pos == -1) {
        this.visiblePasswords.push(index);
      }
      else {
        this.visiblePasswords.splice(pos, 1);
      }
    }
  }

  private isVisible(id: number): boolean {
    var result = false;

    var index = this.getIndexFromId(id);
    if(index != -1) {
      result = this.visiblePasswords.indexOf(index) >= 0;
    }

    return result;
  }

  private filterChanged(value: string): void {
    this.filterExpression = value;
  }

  private filterComparator(item: any, expression: string): boolean {
    return (item.title.toLowerCase().indexOf(expression) != -1);
  }

}
