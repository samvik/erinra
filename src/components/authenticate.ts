import { Component, View, NgIf, NgFor } from 'angular2/angular2';
import { Router } from 'angular2/router';
import { GDriveStore } from '../utils/gdrive-store';


@Component({
  selector: 'database-list'
})
@View({
  template: 'Authenticate!!!<button (click)="authenticate()">Authenticate</button>'
})
export class Authenticate {
  store : GDriveStore;

  public constructor(store : GDriveStore, private router: Router) {
    this.store = store;
  }

  public authenticate(): void {
    this.store.authenticate(false).then(() => {
      this.router.navigate(["/DatabaseList"])
    });
  }
}
