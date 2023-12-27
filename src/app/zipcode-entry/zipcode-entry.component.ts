import { Component, ViewChild } from "@angular/core";
import { LocationService } from "../location.service";

@Component({
  selector: "app-zipcode-entry",
  templateUrl: "./zipcode-entry.component.html",
})
export class ZipcodeEntryComponent {
  zipcode = "";

  constructor(private service: LocationService) {}

  addLocation() {
    if (!this.zipcode) return;

    this.service.addLocation(this.zipcode);
    this.zipcode = "";
  }
}
