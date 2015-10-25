import { Pipe, PipeTransform } from 'angular2/angular2';

@Pipe({
  name: 'maskpassword',
  pure: false
})
export class MaskPasswordPipe implements PipeTransform {
  public transform(value: any, args: any[] = []) : any {
    var show: boolean = false;
    if(args.length > 0) {
      show = args[0];
    }

    if(show) {
      return value;
    }
    else {
      var mask: string = "*";
      return mask.repeat(value.length);
    }
  }
}
