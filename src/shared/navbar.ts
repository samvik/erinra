import { Component, View, NgClass} from 'angular2/angular2';
import { RouterLink, Router, Location } from 'angular2/router';

@Component({
  selector: 'navbar'
})
@View({
  templateUrl: 'src/shared/navbar.html',
  directives: [RouterLink, NgClass]
})
export class Navbar {
  router : Router;
  location : Location;

  constructor(router: Router, location: Location) {
    this.router = router;
    this.location = location;
  }


}
