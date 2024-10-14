import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { PercentPipe } from '@angular/common';
import { Limit } from '../../../types/loadingLimits';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { CommonModule } from '@angular/common';

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
  imports: [PercentPipe, CommonModule ],
  templateUrl: './ui-settings.component.html',
  styleUrl: './ui-settings.component.scss',
})
export class UiSettingsComponent implements OnInit {

  // Inserting a dictionary of translations for each language
  getLabel = (key: string, language: string): string => {
    const translations_dict: { [key: string]: { [key: string]: string } } = {
      en: {
        impressum: "Imprint",
        credits: "Credits",
        settings: "Settings",
        language: "Language:",
        volume: "Volume",
        danger_zone: "Danger zone",
        danger_zone_text: "i know what i'm doing",
        limit: "Pokemon loading limit",
        default: "(default)",
        yes: "Yes",
        no: "No",
      },
      de: {
        impressum: "Impressum",
        credits: "Credits",
        settings: "Einstellungen",
        language: "Sprache:",
        volume: "Lautstärke",
        danger_zone: "Gefahrenbereich",
        danger_zone_text: "ich weiß was ich tue",
        limit: "Pokemon Ladelimit",
        default: "(standard)",
        yes: "Ja",
        no: "Nein",
      },
      pt: {
        impressum: "Autoria",
        credits: "Créditos",
        settings: "Configurações",
        language: "Idioma:",
        volume: "Volume",
        danger_zone: "Área de testes",
        danger_zone_text: "Sei o que estou fazendo",
        limit: "Limite de Pokémon carregados",
        default: "(padrão)",
        yes: "Sim",
        no: "Não",
      }
    };
  
    // If the translation exists, returns it, case contrary, returns english(default)
    return translations_dict[language]?.[key] || translations_dict["en"][key];
  }
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
   * An observable boolean value that is used to store the response of the confirmation dialog.
   *
   * @private
   * @type {BehaviorSubject<boolean>}
   */
  private _response = new BehaviorSubject<boolean>(false);

  /**
   * Gets the response as an observable boolean value.
   *
   * @return {Observable<boolean>} The response as an observable boolean value.
   */
  get response(): Observable<boolean> {
    return this._response.asObservable();
  }

  /**
   * Sets the response value.
   *
   * @param {boolean} value - The new response value.
   */
  set response(value: boolean) {
    this._response.next(value);
  }

  /**
   * Sets the current Pokémon limit and updates the UI accordingly.
   *
   * @param {Event} event - The event that triggered the limit update.
   * @param {Limit} limit - The new Pokémon limit to be set.
   * @return {void} No return value.
   */
  setPokemonLimit(event: Event, limit: Limit): void {
    event.stopPropagation();

    if (this.isLoading || limit.isSelected) return;

    this.isModalOpen = true;
    this.response = false;

    this.response.subscribe((shouldUpdate) => {
      if (shouldUpdate) {
        this.hideSettingsUIandMenu();
        this.settingsService.setPokemonLimit(limit);
      }
    });
  }

  /**
   * Handles the click event on the confirmation buttons in the settings modal.
   *
   * @param {Event} event - The click event triggered by the user.
   * @return {void} No return value.
   */
  handleConfirmationClick(event: Event): void {
    event.stopPropagation();
    const targetElement = event.target as HTMLButtonElement;
    const isConfirmation = targetElement.classList.contains('btn-yes');
    this.isModalOpen = false;
    this.response = isConfirmation;
  }

  /**
   * Hides the settings UI and menu by removing the 'settings-big' class from the settings element and adding the 'd_none' class to the settings menu element.
   *
   * @return {void} No return value.
   */
  hideSettingsUIandMenu(): void {
    const settingsElement = document.getElementById('settings');
    const settingsMenuElement = document.getElementById('settings-menu');

    if (settingsElement && settingsMenuElement) {
      settingsElement.classList.remove('settings-big');
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
  // This functions stops the selector from closing before selecting the language
  stopEvent(event: Event): void {
    event.stopPropagation();
  }
  setLanguage(event: Event): void {
    const target = event.target as HTMLSelectElement;  // Agora estamos lidando com um <select>
    const language = target.value;  // O valor selecionado ('en' ou 'de')
  
    this.settingsService.setLanguage(language);  // Define o idioma conforme o valor selecionado
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
