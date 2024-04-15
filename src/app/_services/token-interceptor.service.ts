import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CurrentUserService } from './current-user.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private currentUserService: CurrentUserService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let tokenizedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.currentUserService.token}`
      }
    });

    return next.handle(tokenizedRequest);
  }
}