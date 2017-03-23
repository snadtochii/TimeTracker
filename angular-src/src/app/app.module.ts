import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes} from '@angular/router';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ChartsModule } from 'ng2-charts';
import { ChartComponent } from './components/chart/chart.component';

import { ValidateService } from './services/validate.service';
import { FlashMessagesModule} from 'angular2-flash-messages';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { CasesService} from './services/cases.service';
import { DayDetailsComponent } from './components/day-details/day-details.component';
import { DatePickerModule } from 'ng2-datepicker';
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { WeeklyStatisticsComponent } from './components/weekly-statistics/weekly-statistics.component';

const appRoutes: Routes = [
  { path: "", component: HomeComponent},
  { path: "register", component: RegisterComponent},
  { path: "login", component: LoginComponent},
  { path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard]},
  { path: "profile", component: ProfileComponent, canActivate: [AuthGuard]},  
]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DashboardComponent,
    ProfileComponent,
    ChartComponent,
    DayDetailsComponent,
    DatepickerComponent,
    WeeklyStatisticsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule,
    ChartsModule,
    DatePickerModule 
  ],
  providers: [ValidateService, AuthService, AuthGuard, CasesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
