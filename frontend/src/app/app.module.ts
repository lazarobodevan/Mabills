import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import {MatIconModule} from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { InputFieldComponent } from './components/input-field/input-field.component';
import { ActionButtonComponent } from './components/action-button/action-button.component';
import { HomeComponent } from './components/home/home.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { SideBarItemComponent } from './components/side-bar-item/side-bar-item.component';
import { ExpensesComponent } from './components/expenses/expenses.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthService } from './services/auth.service';
import { FormsModule } from '@angular/forms';
import { CardComponent } from './components/card/card.component';
import { TransactionCardComponent } from './components/transaction-card/transaction-card.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { CategoryItemComponent } from './components/category-item/category-item.component';
import { ProfileComponent } from './components/profile/profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ModalComponent } from './components/modal/modal.component';
import { SignupComponent } from './components/signup/signup.component';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InputFieldComponent,
    ActionButtonComponent,
    HomeComponent,
    SideBarComponent,
    SideBarItemComponent,
    ExpensesComponent,
    DashboardComponent,
    CardComponent,
    TransactionCardComponent,
    CategoriesComponent,
    CategoryItemComponent,
    ProfileComponent,
    ModalComponent,
    SignupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      progressBar:true,
      positionClass:'toast-bottom-right',
      preventDuplicates:true
    })
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
