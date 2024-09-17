import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { UiSettingsComponent } from './components/ui-settings/ui-settings.component';

/**
 * The main application component.
 *
 * This component contains the root outlet of the application and the main
 * components: the header, the pokemon list and the ui settings.
 *
 * @example <app-root></app-root>
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    PokemonListComponent,
    HeaderComponent,
    UiSettingsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}
