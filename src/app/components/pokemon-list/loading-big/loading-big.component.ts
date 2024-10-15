import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../../services/settings.service';

/**
 * @packageDocumentation
 *
 * A component that displays a loading screen with a big loading text.
 *
 * This component is used as a fallback when the application is still loading.
 *
 * @example
 * <app-loading-big></app-loading-big>
 */
@Component({
  selector: 'app-loading-big',
  standalone: true,
  imports: [],
  templateUrl: './loading-big.component.html',
  styleUrl: './loading-big.component.scss',
})
/**
 * A component that displays a loading screen with a big loading text.
 *
 * This component is used as a fallback when the application is still loading.
 *
 * @example
 * <app-loading-big></app-loading-big>
 */
export class LoadingBigComponent implements OnInit {
  /**
   * Creates an instance of LoadingBigComponent.
   *
   * @param {SettingsService} settingsService - The settings service that provides the necessary data for this component.
   */
  constructor(private settingsService: SettingsService) {}

  /**
   * The time in milliseconds between each loading text change.
   * @private
   * @type {number}
   */
  private readonly TIMEOUT = 1200;

  /**
   * An array of loading texts in English.
   * @type {string[]}
   */
  loadingEnglishText: string[] = [
    'Loading... waiting for Pikachu to charge up!',
    'Just a moment. Our servers are taking a nap like Snorlax.',
    "Catching data... hope it's not a Ditto in disguise!",
    'Magikarp is flopping around. Please hold on!',
    'Warming up the server with a Fire Blast!',
    'Our loading screen is evolving into a faster version!',
    'Searching for a Master Ball to speed this up!',
    "Processing... trying not to get caught in a Trainer's net!",
    "Loading... we promise it's not a Slowpoke's fault!",
    'Preparing your adventure. our server is on its own quest!',
  ];

  /**
   * An array of loading texts in German.
   * @type {string[]}
   */
  loadingGermanText: string[] = [
    'Lädt... warte bis Pikachu aufgeladen ist!',
    'Einen Moment bitte. Unsere Server machen gerade ein Schläfchen wie Relaxo.',
    'Daten werden gesammelt... hoffentlich ist es kein Ditto in Verkleidung!',
    'Karpador plumpst herum. Bitte einen Moment Geduld!',
    'Server wird mit einem Feuersturm aufgewärmt!',
    'Unser Ladescreen entwickelt sich zu einer schnelleren Version!',
    'Auf der Suche nach einem Meisterball, um das Ganze zu beschleunigen!',
    'Verarbeitung... wir versuchen, nicht in einem Trainernetz gefangen zu werden!',
    'Lädt... wir versprechen, es liegt nicht an einem Flegmon!',
    'Bereite dein Abenteuer vor. Unser Server ist auf eigener Quest!',
  ];

    /**
   * An array of loading texts in Portuguese.
   * @type {string[]}
   */
    loadingPortugueseText: string[] = [
      'Carregando... aguardando o Pikachu carregar!',
      'Um momento. Nossos servidores estão tirando uma soneca como o Snorlax.',
      'Obtendo dados... tomara que não seja um Ditto disfarçado!',
      'Aquecendo o servidor com um Fire Blast!',
      'Nossa tela de carregamento está evoluindo para uma versão mais rápida!',
      'Procurando uma Master Ball para resolver isso logo!',
      'Processando... tentando não ser pego na rede de um treinador!',
      'Carregando... prometo que não é culpa do Slowpoke!',
      'Preparando sua aventura. Nosso servidor está em sua própria missão!',
    ];

  /**
   * Returns a random loading text based on the current language setting.
   *
   * @return {string} A random loading text in the current language.
   */
  private getRandomLoadingText(): string {
    const language = this.settingsService.getLanguage();

    const loadingTexts = (() => {
      switch (language) {
        case 'de':
          return this.loadingGermanText;
        case 'pt':
          return this.loadingPortugueseText;
        default:
          return this.loadingEnglishText; // English as default
      }
    })();

    return loadingTexts[Math.floor(Math.random() * loadingTexts.length)];
  }

  /**
   * Returns the length of the loading text array.
   *
   * @return {number} The length of the loading text array.
   */
  private getArrayLength(): number {
    return this.loadingEnglishText.length;
  }

  /**
   * Initializes the component by generating random loading texts and assigning them to the "bottom_content" element at random intervals.
   *
   * @return {void} No return value, initializes the component instead.
   */
  ngOnInit(): void {
    const bottomContentElement = document.getElementById('bottom_content');

    const arrayLength = this.getArrayLength();

    if (bottomContentElement) {
      for (let i = 0; i < arrayLength; i++) {
        setTimeout(() => {
          bottomContentElement.textContent = this.getRandomLoadingText();
        }, Math.floor(Math.random() * this.TIMEOUT) * i);
      }
    }
  }
}
