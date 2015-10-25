//import deps
import 'zone.js';
import 'reflect-metadata';
//you may need es6-shim if you get an error relating to list.fill
//import es6-shim;

import 'bootstrap';
import 'bootstrap/css/bootstrap.min.css!';
import '../style.css!'

import { bootstrap, bind } from 'angular2/angular2';
import { ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy } from 'angular2/router';
import { HTTP_PROVIDERS } from 'angular2/http';

import { Main } from './components/main';
bootstrap(Main, [
  ROUTER_PROVIDERS,
  bind(LocationStrategy).toClass(HashLocationStrategy),
  HTTP_PROVIDERS
  ]);
