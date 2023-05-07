import {NgModule} from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CategoriesComponent } from "./components/categories/categories.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { ExpensesComponent } from "./components/expenses/expenses.component";
import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from "./components/login/login.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { SignupComponent } from "./components/signup/signup.component";
import { AuthGuard } from "./guards/auth.guard";
import { LoggedInAuthGuard } from "./guards/logged-in-auth.guard";

const routes: Routes = [
    {path: '', component: LoginComponent, canActivate:[LoggedInAuthGuard]},
    {path: 'home', component: HomeComponent, canActivate:[AuthGuard]},
    {path: 'expenses', component: ExpensesComponent, canActivate:[AuthGuard]},
    {path: 'categories', component: CategoriesComponent, canActivate:[AuthGuard]},
    {path: 'dashboard', component: DashboardComponent, canActivate:[AuthGuard]},
    {path: 'profile', component: ProfileComponent, canActivate:[AuthGuard]},
    {path: 'signup', component: SignupComponent, canActivate:[LoggedInAuthGuard]}

]

@NgModule({
    declarations: [],
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule{}