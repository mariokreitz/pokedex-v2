/**
 * The root component of the application.
 *
 * This component is the top-level component in the application's component
 * tree. It contains the application's header, the Pokémon list, the UI
 * settings, and the back to top button.
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
import { ImprintComponent } from './components/imprint/imprint.component';

/**
 * The root component of the application.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    PokemonListComponent,
    HeaderComponent,
    UiSettingsComponent,
    BackToTopComponent,
    ImprintComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}
