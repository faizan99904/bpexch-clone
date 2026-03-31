import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import {provideRouter} from "@angular/router";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {routes} from './app/app.routes';
import {authInterceptor } from './app/interceptor/jwt.interceptor';
import {DatePipe} from "@angular/common";

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    ...appConfig.providers,
    DatePipe
  ]
}).catch(err => console.error(err));





