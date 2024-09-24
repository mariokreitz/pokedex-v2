import { Component } from '@angular/core';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-credits',
  standalone: true,
  imports: [],
  templateUrl: './credits.component.html',
  styleUrl: './credits.component.scss',
})
export class CreditsComponent {
  constructor(private settingsService: SettingsService) {}

  /**
   * Retrieves the currently set language from the settings service.
   *
   * @return {string} The currently set language.
   */
  get language(): string {
    return this.settingsService.getLanguage();
  }

  /**
   *  Initializes the component's view after Angular has initialized the component's view and child views.
   *
   *  @return {void} No return value.
   */
  ngAfterViewInit(): void {
    const content = document.querySelector('.content') as HTMLDivElement;
    if (content) {
      content.style.opacity = '0';
      setTimeout(() => {
        content.style.transition = 'opacity 3000ms ease-in-out';
        content.style.opacity = '1';
      }, 125);
    }
  }
}
