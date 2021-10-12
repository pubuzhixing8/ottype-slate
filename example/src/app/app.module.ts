import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SlateModule } from 'slate-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DemoButtonComponent } from './components/button/button.component';
import { DemoCaretComponent } from './components/caret/caret.component';
import { DemoCaretLeafComponent } from './components/leaf/leaf.component';
import { DemoMarkTextComponent } from './components/text/text.component';
import { DemoClientComponent } from './client/client.component';
import { DemoRoomComponent } from './room/room.component';

@NgModule({
  declarations: [
    AppComponent,
    DemoButtonComponent,
    DemoMarkTextComponent,
    DemoRoomComponent,
    DemoClientComponent,
    DemoCaretComponent,
    DemoCaretLeafComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    SlateModule
  ],
  entryComponents: [
    DemoMarkTextComponent,
    DemoCaretLeafComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
