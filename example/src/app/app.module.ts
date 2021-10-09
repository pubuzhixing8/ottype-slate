import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SlateModule } from 'slate-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DemoButtonComponent } from './components/button/button.component';
import { DemoMarkTextComponent } from './components/text/text.component';
import { DemoRichtextComponent } from './richtext/richtext.component';

@NgModule({
  declarations: [
    AppComponent,
    DemoButtonComponent,
    DemoMarkTextComponent,
    DemoRichtextComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    SlateModule
  ],
  entryComponents: [
    DemoMarkTextComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
