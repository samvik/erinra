import { Pipe, PipeTransform } from 'angular2/angular2';

@Pipe({
  name: 'orderBy',
  pure: true
})
export class OrderByPipe implements PipeTransform {
  public transform(value: any, args: any[] = []) : any {
    var expression = args[0];
    var field = expression;
    var order = 1;

    if(expression.length > 0) {
      switch(expression[0]) {
        case '-':
          order = -1;
          // Fall through
        case '+':
          field = expression.substr(1);
          break;
      }
    }

    var sorted = value;
    sorted.sort((v, w) => {
      if(field.length > 0) {
        return order*v[field].localeCompare(w[field]);
      }
      else {
        return order*v.localeCompare(w);
      }
    });
    return sorted;
  }
}
