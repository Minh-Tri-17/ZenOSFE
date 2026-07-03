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

        const body = event.body;

        if (!isApiResponse(body)) return;

        if (body.isSuccess && body.message) toastr.success(body.message);

        if (!body.isSuccess && body.message) toastr.error(body.message);
      }
    }),
  );

  function isApiResponse(body: any): body is ApiResponse<any> {
    return body && typeof body === 'object' && 'isSuccess' in body;
  }
};
