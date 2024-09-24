/**
 * The root component of the application.
 *
 * This component is the top-level component in the application's component
 * tree. It contains the application's header, the Pokémon list, the UI
 * settings, and the back to top button.
 *
 * @example
 * <app-root></app-root>
 *
 * @remarks
 * This component is marked as `standalone: true` to indicate that it does not
 * rely on any external modules.
 */
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { UiSettingsComponent } from './components/ui-settings/ui-settings.component';
import { BackToTopComponent } from './components/back-to-top/back-to-top.component';
import { ImprintComponent } from './components/imprint/imprint.component';
import { CreditsComponent } from './components/credits/credits.component';

/**
 * The root component of the application.
 *
 * This component contains the application's header, the Pokémon list, the UI
 * settings, and the back to top button.
 *
 * @example
 * <app-root></app-root>
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    PokemonListComponent,
    HeaderComponent,
    UiSettingsComponent,
    BackToTopComponent,
    ImprintComponent,
    CreditsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  /**
   * The router instance used to navigate between routes.
   *
   * @remarks
   * This router instance is used to navigate between routes.
   */
  constructor(
    /**
     * The router instance used to navigate between routes.
     */
    public router: Router
  ) {}
}
