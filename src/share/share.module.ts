import { NgModule } from "@angular/core";
import { TabsComponent } from "share/tabs/tabs.component";
import { TabComponent } from "./tab/tab.component";

const COMPONENTS = [TabsComponent, TabComponent];
@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class ShareModule {}
