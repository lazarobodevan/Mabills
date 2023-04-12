import {NgModule} from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CategoriesComponent } from "./components/categories/categories.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { ExpensesComponent } from "./components/expenses/expenses.component";
import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from "./components/login/login.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { SignupComponent } from "./components/signup/signup.component";

const routes: Routes = [
    {path: '', component: LoginComponent},
    {path: 'home', component: HomeComponent},
    {path: 'expenses', component: ExpensesComponent},
    {path: 'categories', component: CategoriesComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'profile', component: ProfileComponent},
    {path: 'signup', component: SignupComponent}

]

@NgModule({
    declarations: [],
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule{}