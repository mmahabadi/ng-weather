import {
  AfterViewInit,
  Component,
  ContentChildren,
  EventEmitter,
  Output,
} from "@angular/core";
import { TabComponent } from "share/tab/tab.component";

@Component({
  selector: "app-tabs",
  templateUrl: "./tabs.component.html",
  styleUrls: ["./tabs.component.scss"],
})
export class TabsComponent implements AfterViewInit {
  @Output() onCloseTab = new EventEmitter();

  @ContentChildren(TabComponent) tabs;

  ngAfterViewInit(): void {
    this.selectFirstTab();
  }

  selectTab(tab: TabComponent) {
    this.tabs.forEach((t) => (t.active = false));
    tab.active = true;
  }

  closeTab(e: Event, tab: TabComponent) {
    e.stopPropagation();
    this.tabs = this.tabs.filter((item) => item.title !== tab.title);
    tab.active = false;
    this.selectFirstTab();
    this.onCloseTab.emit(tab.key);
  }

  private selectFirstTab() {
    //in some cases, this function runs before the content projection is ready
    //so we need to wait a bit before we can select the first tab
    setTimeout(
      (() => {
        if (this.tabs.length === 0) return;

        const activeTab = this.tabs.find((tab) => tab.active);
        if (!activeTab) {
          const firstTab = this.tabs.first || this.tabs[0];
          this.selectTab(firstTab);
        }
      }).bind(this),
      100
    );
  }
}
