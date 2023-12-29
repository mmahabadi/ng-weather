import { Injectable, Signal, signal } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { CurrentConditions } from "./current-conditions/current-conditions.type";
import { ConditionsAndZip } from "./conditions-and-zip.type";
import { Forecast } from "./forecasts-list/forecast.type";
import { LocationService } from "./location.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { CacheService } from "./cache.service";

@Injectable({
  //I prepared provided root in order to make this service tree-shakable
  providedIn: "root",
})
export class WeatherService {
  static URL = "/api/weather/data/2.5";
  static APPID = "5a4b2d457ecbef9eb2a71e480b947604";
  static ICON_URL =
    "/api/icons/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/";
  private currentConditions = signal<ConditionsAndZip[]>([]);

  constructor(
    private http: HttpClient,
    private locationService: LocationService,
    private cacheService: CacheService
  ) {
    this.locationService.locations$
      .pipe(takeUntilDestroyed())
      .subscribe((locations) => {
        // Filter out the removed locations from currentConditions
        this.removeDeletedCurrentLocations(locations);

        // Add the new locations to currentConditions
        this.addNewCurrentLocations(locations);
      });
  }

  addCurrentConditions(zipcode: string): void {
    // generate the url for the API call and use it as the key for the cache
    const url = `${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`;

    // Here we make a request to get the current conditions data from the API. Note the use of backticks and an expression to insert the zipcode
    this.http.get<CurrentConditions>(url).subscribe(
      (data) => {
        this.currentConditions.update((conditions) => [
          ...conditions,
          { zip: zipcode, data },
        ]);
        this.cacheService.set(url, data);
      },
      (error) => {
        alert("Could not find weather data for " + zipcode);
        // remove the zipcode from the list of locations when the API call fails
        // in order to keep the UI in sync with the data
        this.locationService.removeLocation(zipcode);
      }
    );
  }

  removeCurrentConditions(zipcode: string) {
    this.currentConditions.update((conditions) => {
      for (let i in conditions) {
        if (conditions[i].zip == zipcode) conditions.splice(+i, 1);
      }
      return conditions;
    });
  }

  getCurrentConditions(): Signal<ConditionsAndZip[]> {
    return this.currentConditions.asReadonly();
  }

  getForecast(zipcode: string): Observable<Forecast> {
    // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
    return this.http.get<Forecast>(
      `${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`
    );
  }

  getWeatherIcon(id): string {
    if (id >= 200 && id <= 232)
      return WeatherService.ICON_URL + "art_storm.png";
    else if (id >= 501 && id <= 511)
      return WeatherService.ICON_URL + "art_rain.png";
    else if (id === 500 || (id >= 520 && id <= 531))
      return WeatherService.ICON_URL + "art_light_rain.png";
    else if (id >= 600 && id <= 622)
      return WeatherService.ICON_URL + "art_snow.png";
    else if (id >= 801 && id <= 804)
      return WeatherService.ICON_URL + "art_clouds.png";
    else if (id === 741 || id === 761)
      return WeatherService.ICON_URL + "art_fog.png";
    else return WeatherService.ICON_URL + "art_clear.png";
  }

  private removeDeletedCurrentLocations(locations: string[]) {
    this.currentConditions().forEach((condition) => {
      if (!locations.includes(condition.zip)) {
        this.removeCurrentConditions(condition.zip);
      }
    });
  }

  private addNewCurrentLocations(locations: string[]) {
    locations.forEach((loc: string) => {
      if (
        this.currentConditions().find(
          (cond: ConditionsAndZip) => cond.zip === loc
        )
      )
        return;
      this.addCurrentConditions(loc);
    });
  }
}
