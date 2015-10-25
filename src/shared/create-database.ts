import { Component, View, FORM_DIRECTIVES} from 'angular2/angular2';
import { GDriveStore } from '../utils/gdrive-store';
class Model {
  name : string;
  password : string;
}

@Component({
  selector: 'create-database'
})
@View({
  templateUrl: 'src/shared/create-database.html',
  directives: [FORM_DIRECTIVES]
})
export class CreateDatabase {

  private model : Model = new Model();
  private store : GDriveStore;

  public constructor(store : GDriveStore) {
    this.store = store;
  }

  public create(): void {
    this.store.createDatabase(this.model.name, this.model.password).then((resp) => {
      console.log("Create: ", resp);
    });
  }
}
