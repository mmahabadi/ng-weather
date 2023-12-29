import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { ZipcodeEntryComponent } from "./zipcode-entry/zipcode-entry.component";
import { ForecastsListComponent } from "./forecasts-list/forecasts-list.component";
import { CurrentConditionsComponent } from "./current-conditions/current-conditions.component";
import { MainPageComponent } from "./main-page/main-page.component";
import { RouterModule } from "@angular/router";
import { routing } from "./app.routing";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { ShareModule } from "share/share.module";
import { CacheInterceptor } from "./cache.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    ZipcodeEntryComponent,
    ForecastsListComponent,
    CurrentConditionsComponent,
    MainPageComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    routing,
    ServiceWorkerModule.register("/ngsw-worker.js", {
      enabled: environment.production,
    }),
    ShareModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheInterceptor,
      multi: true,
    },
    {
      provide: "CACHE_DURATION",
      useValue: 2 * 60 * 60 * 1000, // Default caching duration: 2 hours
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
