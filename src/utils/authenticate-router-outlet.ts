import {Directive, Attribute, ElementRef, DynamicComponentLoader} from 'angular2/angular2';
import {Router, RouterOutlet, ComponentInstruction} from 'angular2/router';

import { GDriveStore } from './gdrive-store';
import { Authenticate } from '../components/authenticate'

@Directive({
  selector: 'router-outlet'
})
export class AuthenticateRouterOutlet extends RouterOutlet {
  publicRoutes:any;
  private parentRouter:Router;

  private store: GDriveStore;
  constructor(_elementRef:ElementRef, _loader:DynamicComponentLoader,
              _parentRouter:Router, @Attribute('name') nameAttr:string, store: GDriveStore) {
    super(_elementRef, _loader, _parentRouter, nameAttr);
    this.store = store;
    this.parentRouter = _parentRouter;
    this.publicRoutes = {
      '': true,
      '/': true
    };
  }

  activate(instruction: ComponentInstruction) {
    var url = this.parentRouter.lastNavigationAttempt;
    console.log(url);
    if (!this.publicRoutes[url] && !this.store.isAuthenticated) {
      console.log("Redirect");

      this.parentRouter.navigate(['/Authenticate']);
    }
    return super.activate(instruction);
  }
}
