import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
export const LOCATIONS: string = "locations";

@Injectable({
  //I prepared provided root in order to make this service tree-shakable
  providedIn: "root",
})
export class LocationService {
  private locationsSource$ = new BehaviorSubject<string[]>(this.init());
  locations$ = this.locationsSource$.asObservable();

  constructor() {
    this.locations$.pipe(takeUntilDestroyed()).subscribe((locations) => {
      localStorage.setItem(LOCATIONS, JSON.stringify(locations));
    });
  }

  addLocation(zipcode: string) {
    const locations = this.locationsSource$.getValue();
    const index = locations.indexOf(zipcode);
    if (index === -1) {
      locations.push(zipcode);
      this.locationsSource$.next(locations);
    }
  }

  removeLocation(zipcode: string) {
    const locations = this.locationsSource$.getValue();
    const index = locations.indexOf(zipcode);
    if (index !== -1) {
      locations.splice(index, 1);
      this.locationsSource$.next(locations);
    }
  }

  emit(locations: string[]) {
    this.locationsSource$.next(locations);
  }

  private init() {
    const data = localStorage.getItem(LOCATIONS);
    return (JSON.parse(data) as string[]) ?? [];
  }
}
