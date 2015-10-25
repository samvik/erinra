import { Component, View, FORM_DIRECTIVES, NgIf, Inject} from 'angular2/angular2';
import { Router, RouteParams } from 'angular2/router';
import { GDriveStore, Password } from '../utils/gdrive-store';

@Component({
  selector: 'password-edit'
})
@View({
  templateUrl: 'src/components/password-edit.html',
  directives: [FORM_DIRECTIVES, NgIf]
})
export class PasswordEdit {
  store : GDriveStore;
  router : Router;
  model : Password = <Password>{};
  id: number;
  database : string;

  constructor(store : GDriveStore, router : Router, params : RouteParams) {
    this.store = store;
    this.router = router;

    this.database = params.get("db");
    var id = params.get("id");
    if(id != null) {
      this.id = +id;
      this.model = this.store.database.passwords[this.id];
    }
  }

  onSubmit(): void {
    if(this.id == null) {
      this.store.database.passwords.push(this.model);
    }
    else {
      this.store.database.passwords[this.id] = this.model;
    }

    this.store.save();

    this.router.navigate(["/DatabaseView", {db: this.database}]);
  }

  private cancel(): void {
    this.router.navigate(["/DatabaseView", {db: this.database}]);
  }
}
