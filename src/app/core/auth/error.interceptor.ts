import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(() => {}, (e) => this.handleError(e)),
    );
  }

  private handleError(error) {
    if (error instanceof HttpErrorResponse) {
      console.log(error);
      if (error.status === 404) {
        this.router.navigate(['not-found']);
      }
    }
  }

}
