
import { Component, View, NgIf, NgFor } from 'angular2/angular2';
import { RouterLink } from 'angular2/router';
import { GDriveStore } from '../utils/gdrive-store';


@Component({
  selector: 'database-list'
})
@View({
  templateUrl: 'src/components/dashboard.html',
  directives: [RouterLink]
})
export class Dashboard {

  public constructor() {

  }
}
