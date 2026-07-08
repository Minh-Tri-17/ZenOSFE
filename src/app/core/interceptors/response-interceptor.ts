import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from '../models/api.model';
import { tap } from 'rxjs';

export const responseInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        if (req.method == 'GET') return;

        if (!isApiResponse(event.body)) return;

        if (event.body.isSuccess && event.body.message) toastr.success(event.body.message);

        if (!event.body.isSuccess && event.body.message) toastr.error(event.body.message);
      }
    }),
  );

  function isApiResponse(body: any): body is ApiResponse<any> {
    return body && typeof body === 'object' && 'isSuccess' in body;
  }
};
