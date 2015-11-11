
import { Component, View, CORE_DIRECTIVES } from 'angular2/angular2';
import { RouterLink} from 'angular2/router';
import { GDriveStore } from '../utils/gdrive-store';
import { DatabaseDescription } from '../utils/store';

import { OrderByPipe } from '../utils/order-by-pipe';
import { FilterPipe } from '../utils/filter-pipe';

import { SearchBox } from '../shared/search-box';

@Component({
  selector: 'database-list'
})
@View({
  templateUrl: 'src/components/database-list.html',
  directives: [CORE_DIRECTIVES, RouterLink, SearchBox],
  pipes: [OrderByPipe, FilterPipe]
})
export class DatabaseList {
  private loading: boolean = true;
  private errorMessage: string = "";

  private filterExpression: string = "";

  public constructor(private store : GDriveStore) {
  }

  private afterViewInit() : void {
    this.loading = true;
    this.errorMessage = "";

    this.store.loadDatabaseList().then(
      (resp) => {
        this.loading = false
      },
      (error) => {
        this.loading = false;
        this.errorMessage = error;
        console.log(error);
      });
  }

  private delete(desc : DatabaseDescription) : void {
    this.store.deleteDatabase(desc);
  }

  private filterChanged(value: string): void {
    this.filterExpression = value;
  }

  private filterComparator(item: any, expression: string): boolean {
    return (item.title.toLowerCase().indexOf(expression) != -1);
  }

}
