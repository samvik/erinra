
import { Component, View } from 'angular2/angular2';
import { RouteConfig } from 'angular2/router';

import { GDrive } from '../utils/gdrive';

@Component({
  selector: 'test-app'
})
@View({
  templateUrl: 'src/components/main.html'
})
export class Main {
  name: string;

  gdrive : GDrive = new GDrive();

  constructor(){
    this.name = 'Angular2';
    setTimeout(() => {
      this.name = 'Angular2!!!'
    },1500);
  }

  test() {
    this.gdrive.authenticate().then(() => {
      console.log("Resolved");
      this.name = "Auth!!!!!";
    });
  }

  list() {
    this.gdrive.listFiles().then((resp) => {
      console.log(resp);
      this.name = "List!!!!";
    })
  }

}
