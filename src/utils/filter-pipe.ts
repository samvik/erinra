import { Pipe, PipeTransform } from 'angular2/angular2';

@Pipe({
  name: 'filter',
  pure: true
})
export class FilterPipe implements PipeTransform {

  public transform(value: any, args: any[] = []) : any {
    var expression = args[0];
    var comparator = args[1];

    return value.filter((item) => {
      return comparator(item, expression);
    });
  }
}
