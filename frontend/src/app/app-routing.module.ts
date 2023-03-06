import {NgModule} from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { ExpensesComponent } from "./components/expenses/expenses.component";
import { HomeComponent } from "./components/home/home.component";
import { InvestedComponent } from "./components/invested/invested.component";
import { LoginComponent } from "./components/login/login.component";

const routes: Routes = [
    {path: '', component: LoginComponent},
    {path: 'home', component: HomeComponent},
    {path: 'expenses', component: ExpensesComponent},
    {path: 'invested', component: InvestedComponent},
    {path: 'dashboard', component: DashboardComponent}
]

@NgModule({
    declarations: [],
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule{}