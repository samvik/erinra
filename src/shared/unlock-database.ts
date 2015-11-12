import { Component, View, FORM_DIRECTIVES, Input, Output, EventEmitter} from 'angular2/angular2';

class Model {
  password : string;
}

@Component({
  selector: 'unlock-database'
})
@View({
  templateUrl: 'src/shared/unlock-database.html',
  directives: [FORM_DIRECTIVES],
  styleUrls: ['src/shared/unlock-database.css']
})
export class UnlockDatabase {

  private model : Model = new Model();
  @Input() db;
  @Output() onUnlock: EventEmitter = new EventEmitter();

  public constructor() {
  }

  public unlock(): void {
    this.onUnlock.next(this.model.password);
  }

}
