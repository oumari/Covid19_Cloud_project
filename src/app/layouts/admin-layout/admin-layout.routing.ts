import { Routes } from '@angular/router';

import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { CountryComponent } from 'app/country/country.component';
import { HomeComponent } from 'app/home/home.component';
import { AuthService } from 'app/service/auth.service';
import { NewsComponent } from 'app/news/news.component';
import { NewsGuardService } from 'app/service/news.guard.service';

export const AdminLayoutRoutes: Routes = [

    { path: 'country', component: CountryComponent },
    { path: 'home', component: HomeComponent },
    { path: 'user-profile', component: UserProfileComponent },
    { path: 'news', component: NewsComponent, canActivate: [AuthService, NewsGuardService] }


];
