import { Routes } from '@angular/router';
import { ImprintComponent } from './components/imprint/imprint.component';

export const routes: Routes = [
  { path: 'imprint', component: ImprintComponent },
  { path: '**', redirectTo: '' },
];
