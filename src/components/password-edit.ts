import { Component, View, FORM_DIRECTIVES, NgIf, NgClass, Inject} from 'angular2/angular2';
import { Router, RouteParams } from 'angular2/router';
import { GDriveStore } from '../utils/gdrive-store';
import { Password } from '../utils/store';

import { Alert } from '../shared/alert';
import { PasswordStrengthBar } from '../shared/password-strength-bar';

@Component({
  selector: 'password-edit'
})
@View({
  templateUrl: 'src/components/password-edit.html',
  directives: [FORM_DIRECTIVES, NgIf, NgClass, PasswordStrengthBar, Alert]
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

        this.model = this.store.database.passwords.find((element, index, array) => {
          return element.id == this.id;
        });
      }

    }
  }

  private onSubmit(): void {
    if(this.id == null) {
      this.model.id = Date.now();
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

  private generatePassword(): void {
    var chars: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890/\\-_?!.,@#*|<%$+";
    var password: string = "";

    for(var i = 0; i < 12; ++i) {
      var n = Math.random()*chars.length;
      password = password.concat(chars.charAt(n));
    }

    this.model.password = password;
  }
}
