import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { PercentPipe } from '@angular/common';
import { Limit } from '../../../types/loadingLimits';
import { Router } from '@angular/router';

/**
 * Component that renders the UI settings component.
 *
 * This component displays a button that toggles the visibility of the settings menu.
 * It also displays the settings menu itself, which contains a range input for adjusting the audio volume and
 * a series of radio buttons for selecting the Pokémon loading limit.
 */
@Component({
  selector: 'app-ui-settings',
  standalone: true,
  imports: [PercentPipe],
  templateUrl: './ui-settings.component.html',
  styleUrl: './ui-settings.component.scss',
})
export class UiSettingsComponent implements OnInit {
  /**
   * The available Pokémon loading limits.
   *
   * This property is used to display the radio buttons for selecting the loading limit.
   */
  loadLimits = this.settingsService.getLimits();

  /**
   * Retrieves the currently set language from the settings service.
   *
   * @return {string} The currently set language.
   */
  get language(): string {
    return this.settingsService.getLanguage();
  }

  /**
   * Initializes the UiSettingsComponent with the required services.
   *
   * @param {SettingsService} settingsService - The service providing access to the application settings.
   * @param {Router} router - The Angular router for navigating between routes.
   */
  constructor(
    private settingsService: SettingsService,
    private router: Router
  ) {}

  /**
   * Navigates to the imprint page.
   *
   * @return {void} No return value.
   */
  navigateToImprint(): void {
    this.router.navigate(['/imprint']);
  }

  /**
   * Initializes the component after Angular has initialized all data-bound properties.
   * Sets the initial state of the checkbox.
   *
   * @return {void} No return value.
   */
  ngOnInit(): void {
    this.setCheckboxState();
  }

  /**
   * Toggles the visibility of the settings menu.
   *
   * This method is called when the user clicks on the settings button.
   *
   * @return {void} No return value.
   */
  toggleSettingsVisibility(): void {
    const settingsElement = document.getElementById('settings');
    const settingsMenuElement = document.getElementById('settings-menu');

    if (settingsElement && settingsMenuElement) {
      settingsElement.classList.toggle('settings-big');
      settingsMenuElement.classList.toggle('d_none');
    }
  }

  /**
   * Updates the audio volume by stopping the propagation of the event and then setting the audio volume using the settings service.
   *
   * This method is called when the user changes the audio volume using the range input.
   *
   * @param {Event} event - The event that triggered the volume update.
   * @param {number} volume - The new audio volume.
   * @return {void} No return value.
   */
  setAudioVolume(event: Event, volume: number): void {
    event.stopPropagation();

    this.settingsService.setAudioVolume(volume);
  }

  /**
   * Retrieves the current audio volume.
   *
   * This method is used to display the current audio volume in the settings menu.
   *
   * @return {number} The current audio volume.
   */
  getAudioVolume(): number {
    return this.settingsService.getAudioVolume();
  }

  /**
   * Sets the Pokémon loading limit after prompting the user for confirmation.
   *
   * @param {Event} event - The event that triggered the limit update.
   * @param {Limit} limit - The new Pokémon loading limit.
   * @return {void} No return value.
   */
  setPokemonLimit(event: Event, limit: Limit): void {
    event.stopPropagation();

    if (this.isLoading || limit.isSelected) return;
    const response = confirm(
      this.language == 'en'
        ? 'Changing the Pokemon loading limit may cause errors. Proceed with caution. Continue?'
        : 'Das Ändern des Ladegrenzwerts für Pokémon kann Fehler verursachen. Vorsicht! Fortfahren?'
    );

    if (!response) {
      event.preventDefault();
      return;
    }

    const settingsUiRef = document.getElementById('settings');
    const settingsMenuRef = document.getElementById('settings-menu');

    if (settingsUiRef && settingsMenuRef) {
      settingsUiRef.classList.remove('settings-big');
      settingsMenuRef.classList.add('d_none');
    }

    this.settingsService.setPokemonLimit(limit);
  }

  /**
   * Sets the application language based on the provided event.
   *
   * @param {Event} event - The event that triggered the language update.
   * @return {void} No return value.
   */
  setLanguage(event: Event): void {
    const target = event.target as HTMLInputElement;
    const language = target.checked ? 'de' : 'en';

    this.settingsService.setLanguage(language);
  }

  /**
   * Sets the state of the language switch checkbox based on the current language setting.
   *
   * This function retrieves the language switch checkbox element by its ID and updates its
   * checked state based on the current language setting. If the current language setting is
   * 'de', the checkbox is checked; otherwise, it is unchecked.
   *
   * @return {void} This function does not return a value.
   */
  private setCheckboxState(): void {
    const languageSwitchElement = document.getElementById(
      'languageSwitch'
    ) as HTMLInputElement;
    if (languageSwitchElement) {
      languageSwitchElement.checked =
        this.settingsService.getLanguage() === 'de';
    }
  }

  /**
   * Returns the current loading state of the application.
   *
   * @return {boolean} True if the application is currently loading, false otherwise.
   */
  get isLoading(): boolean {
    return this.settingsService.getIsLoading();
  }
}
