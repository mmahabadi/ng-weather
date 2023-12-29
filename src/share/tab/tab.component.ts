import { Component, Input } from "@angular/core";

@Component({
  selector: "app-tab",
  templateUrl: "./tab.component.html",
})
export class TabComponent {
  @Input({ required: true }) title = "";
  @Input({ required: true }) key = "";
  active: boolean = false;
}
