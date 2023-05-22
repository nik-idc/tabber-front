import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private userService: UserService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let tokenizedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.userService.token}`
      }
    });

    return next.handle(tokenizedRequest);
  }
}