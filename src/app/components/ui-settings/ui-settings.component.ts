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
   * Indicates whether the settings menu is currently visible.
   *
   * This property is used to toggle the visibility of the settings menu.
   *
   * @type {boolean}
   */
  isModalOpen: boolean = false;

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
   * @private
   * @type {boolean}
   * @description
   * Property that is used to determine whether the settings menu is visible or not.
   */
  private _response: boolean = false;

  /**
   * Get the value of the response property.
   *
   * @return {boolean} The value of the response property.
   */
  get response(): boolean {
    return this._response;
  }

  /**
   * Sets the response value.
   *
   * @param {boolean} value - The new response value.
   *
   */
  set response(value: boolean) {
    this._response = value;
  }

  /**
   * Sets the Pokémon loading limit based on the provided event and limit.
   *
   * @param {Event} event - The event that triggered the Pokémon loading limit update.
   * @param {Limit} limit - The new Pokémon loading limit.
   * @return {void} No return value.
   */
  setPokemonLimit(event: Event, limit: Limit): void {
    event.stopPropagation();

    if (this.isLoading || limit.isSelected) return;

    this.isModalOpen = true;

    setTimeout(() => {
      const buttons = document.querySelectorAll<HTMLButtonElement>('.btn');

      if (!buttons) return;

      buttons.forEach((button) => {
        button.addEventListener('click', (e) => {
          e.stopPropagation();
          const isYesButton = button.classList.contains('btn-yes');
          this.isModalOpen = false;
          this.response = isYesButton;

          if (!this.response) {
            event.preventDefault();
            return;
          }

          this.changeSettingsUIandMenuVisibility();
          this.settingsService.setPokemonLimit(limit);
        });
      });
    }, 30);
  }

  /**
   * Changes the visibility of the settings UI and menu.
   *
   * This method removes the 'settings-big' class from the settings UI element and adds the 'd_none' class to the settings menu element.
   *
   * @return {void} No return value.
   */
  changeSettingsUIandMenuVisibility(): void {
    const settingsUIElement = document.getElementById('settings');
    const settingsMenuElement = document.getElementById('settings-menu');

    if (settingsUIElement && settingsMenuElement) {
      settingsUIElement.classList.remove('settings-big');
      settingsMenuElement.classList.add('d_none');
    }
  }

  /**
   * Retrieves the confirmation text for changing the Pokémon loading limit based on the current language setting.
   *
   * @return {string} The confirmation text in the currently set language.
   */
  get confirmationText(): string {
    return this.language == 'en'
      ? 'Changing the Pokemon loading limit may cause errors. Proceed with caution. Continue?'
      : 'Das Ändern des Ladegrenzwerts für Pokémon kann möglicherweiße Fehler verursachen... Fortfahren?';
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

  /**
   * Navigates to the imprint page.
   *
   * @return {void} No return value.
   */
  navigateToImprint(): void {
    this.router.navigate(['/imprint']);
  }

  /**
   * Navigates to the credits page.
   *
   * @return {void} No return value.
   */
  navigateToCredits(): void {
    this.router.navigate(['/credits']);
  }
}
function handleConfirmation() {
  throw new Error('Function not implemented.');
}
