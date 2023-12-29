import { Inject, Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class CacheService {
  private storage: Storage;

  constructor(@Inject("CACHE_DURATION") private cacheDuration: number) {
    this.storage = localStorage;
  }

  set(key: string, value: any): void {
    const entry = {
      data: value,
      cacheTime: new Date().getTime(),
    };
    this.storage.setItem(key, JSON.stringify(entry));
  }

  get(key: string): any | null {
    const entry = this.storage.getItem(key);

    if (entry) {
      const { data, cacheTime } = JSON.parse(entry);

      const cacheAge = cacheTime + this.cacheDuration - new Date().getTime();

      if (cacheAge > 0) {
        return data;
      } else {
        this.remove(key);
      }
    }

    return null;
  }

  remove(key: string): void {
    this.storage.removeItem(key);
  }
}
