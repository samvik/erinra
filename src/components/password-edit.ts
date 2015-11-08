import { Component, View, FORM_DIRECTIVES, NgIf, Inject} from 'angular2/angular2';
import { Router, RouteParams } from 'angular2/router';
import { GDriveStore } from '../utils/gdrive-store';
import { Password } from '../utils/store';

@Component({
  selector: 'password-edit'
})
@View({
  templateUrl: 'src/components/password-edit.html',
  directives: [FORM_DIRECTIVES, NgIf]
})
export class PasswordEdit {
  model : Password = <Password>{};
  id: number;
  database : string;

  databaseIsOpen: boolean = false;

  public constructor(private store : GDriveStore, private router : Router, private params : RouteParams) {
    this.database = params.get("db");
    if(store && store.database && store.database.name == this.database) {
      this.databaseIsOpen = true;

      var id = params.get("id");
      if(id != null) {
        this.id = +id;
        this.model = this.store.database.passwords[this.id];
      }
    }
  }

  private onSubmit(): void {
    if(this.id == null) {
      this.store.database.passwords.push(this.model);
    }
    else {
      this.store.database.passwords[this.id] = this.model;
    }

    this.store.save();

    this.router.navigate(["../DatabaseView", {db: this.database}]);
  }

  private cancel(): void {
    this.router.navigate(["../DatabaseView", {db: this.database}]);
  }
}
