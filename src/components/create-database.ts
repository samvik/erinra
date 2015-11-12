import { Component, View, NgIf, FORM_DIRECTIVES} from 'angular2/angular2';
import { Router, RouterLink } from 'angular2/router';
import { GDriveStore } from '../utils/gdrive-store';

import { Alert } from '../shared/alert';

class Model {
  name : string;
  password : string;
}

@Component({
  selector: 'create-database'
})
@View({
  templateUrl: 'src/components/create-database.html',
  directives: [FORM_DIRECTIVES, NgIf, RouterLink, Alert]
})
export class CreateDatabase {

  private model : Model = new Model();

  public constructor(private store : GDriveStore, private router: Router) {
  }

  public create(): void {
    var name: string = this.sanitizeName(this.model.name);

    this.store.createDatabase(name, this.model.password).then((resp) => {
      this.router.navigate(['/DatabaseRouter', 'DatabaseView', {db: name} ]);
    },
    (error) => {
      console.log(error);
    });
  }

  private sanitizeName(name: string) : string {
    return name.replace(" ", "-");
  }
}
