import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import {MatIconModule} from '@angular/material/icon';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { InputFieldComponent } from './components/input-field/input-field.component';
import { ActionButtonComponent } from './components/action-button/action-button.component';
import { HomeComponent } from './components/home/home.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { SideBarItemComponent } from './components/side-bar-item/side-bar-item.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InputFieldComponent,
    ActionButtonComponent,
    HomeComponent,
    SideBarComponent,
    SideBarItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
