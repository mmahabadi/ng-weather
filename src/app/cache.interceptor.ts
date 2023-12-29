import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { CacheService } from "./cache.service";

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  constructor(private cacheService: CacheService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Check if the request is a GET request
    if (req.method !== "GET") {
      return next.handle(req);
    }

    // Generate a unique key for the request based on the URL
    const key = req.url;

    // Attempt to retrieve data from the cache
    const cachedData = this.cacheService.get(key);

    // If data is found in the cache, return it as an Observable
    if (cachedData) {
      return of(new HttpResponse({ body: cachedData }));
    }

    // If data is not in cache, proceed with the HTTP request
    return next.handle(req).pipe(
      map((event) => {
        // Cache the response data
        if (event instanceof HttpResponse) {
          this.cacheService.set(key, event.body);
        }
        return event;
      }),
      catchError((error) => {
        // Handle errors here
        console.error("Error fetching data:", error);
        return of(error);
      })
    );
  }
}
