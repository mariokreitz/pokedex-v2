/**
 * The main application component.
 *
 * This component is the root component of the application, and contains the
 * entire application.
 *
 * @example
 * <app-root></app-root>
 */
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { UiSettingsComponent } from './components/ui-settings/ui-settings.component';
import { BackToTopComponent } from './components/back-to-top/back-to-top.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    PokemonListComponent,
    HeaderComponent,
    UiSettingsComponent,
    BackToTopComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}
