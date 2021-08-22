import { DragDropModule } from '@angular/cdk/drag-drop';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LayoutComponent } from './components/layout/layout.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent
  ],
  imports: [
    BrowserModule,
    DragDropModule,
    MatSlideToggleModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
