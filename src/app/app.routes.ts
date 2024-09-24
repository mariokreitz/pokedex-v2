import { Routes } from '@angular/router';
import { ImprintComponent } from './components/imprint/imprint.component';
import { CreditsComponent } from './components/credits/credits.component';

export const routes: Routes = [
  { path: 'imprint', component: ImprintComponent },
  { path: 'credits', component: CreditsComponent },
  { path: '**', redirectTo: '' },
];
