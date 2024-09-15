import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { HeaderComponent } from './components/header/header.component';
import { UiSettingsComponent } from './components/ui-settings/ui-settings.component';

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
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor() {}
}
