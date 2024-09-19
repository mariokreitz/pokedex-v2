import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Pokemon } from '../../../../types/pokedex';
import { DecimalPipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import Chart from 'chart.js/auto';
import { SettingsService } from '../../../services/settings.service';

/**
 * Displays a popup with information about a Pokémon.
 *
 * @param {Pokemon} selectedPokemon - The Pokémon to display.
 */
@Component({
  selector: 'app-pokemon-popup',
  standalone: true,
  imports: [UpperCasePipe, TitleCasePipe, DecimalPipe],
  templateUrl: './pokemon-popup.component.html',
  styleUrl: './pokemon-popup.component.scss',
})
export class PokemonPopupComponent implements OnInit {
  /**
   * The Pokémon to display.
   */
  @Input() selectedPokemon: Pokemon | null = null;

  /**
   * The conversion factor from centimeters to meters.
   */
  private readonly CM = 10;

  /**
   * The conversion factor from hectograms to kilograms.
   */
  private readonly HECTOGRAM = 100;

  /**
   * The audio volume to use for the Pokémon's cries.
   */
  private audioVolume = 0.25;

  /**
   * Whether the Pokémon's cry is currently playing.
   */
  private isAudioPlaying = false;

  /**
   * The selected language.
   */
  private selectedLanguage = 'en';

  /**
   * The ID of the Pokémon.
   */
  id!: number;

  /**
   * The name of the Pokémon.
   */
  name!: string;

  /**
   * The Pokémon's HP number.
   */
  hp_number!: number;

  /**
   * The Pokémon's HP text.
   */
  hp_text!: string;

  /**
   * The URL of the Pokémon's image, or null if no image is available.
   */
  imgSrc!: string | null;

  /**
   * The names of the Pokémon's types.
   */
  types!: string[];

  /**
   * The Pokémon's stats.
   */
  stats!: {
    base_stat: number;
    effort: number;
    stat: { name: string; url: string };
  }[];

  /**
   * The Pokémon's description.
   */
  description!: string;

  /**
   * The Pokémon's cries, if available.
   */
  cries?: {
    latest: string;
    legacy: string;
  };

  /**
   * The Pokémon's height in meters.
   */
  height!: number;

  /**
   * The Pokémon's weight in kilograms.
   */
  weight!: number;

  /**
   * The items that the Pokémon is holding.
   */
  held_items!: {
    item: { name: string; url: string };
    version_details: {
      rarity: number;
    }[];
  }[];

  /**
   * The Pokémon's game indices.
   */
  game_indices!: {
    game_index: number;
    version: { name: string; url: string };
  }[];

  /**
   * The items that the Pokémon can hold, if available.
   */
  items?: {
    name: string;
    sprites: {
      default: string | null;
    };
  }[];

  /**
   * The Pokémon's abilities.
   */
  abilities!: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }[];

  constructor(private settingsService: SettingsService) {}

  /**
   * Initializes the component by subscribing to the current audio volume and language.
   *
   * @return {void} No return value.
   */
  ngOnInit(): void {
    this.settingsService.currentAudioVolume.subscribe((volume) => {
      this.audioVolume = volume;
    });

    this.settingsService.currentLanguage.subscribe((language) => {
      this.selectedLanguage = language;
    });
  }

  /**
   *  Handles changes to the component's input properties.
   *
   *  @param {SimpleChanges} changes - An object containing the changes to the input properties.
   *  @return {void} No return value.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedPokemon'] && this.selectedPokemon) {
      this.updatePokemonData();
      this.createStatsChart();
      this.addDynamicBackground();
      this.resetTabDisplay();
    }
  }

  /**
   * Updates the component's data based on the selected Pokémon.
   *
   * Extracts and processes the Pokémon's data, including its ID, name, image source, types, description, stats, and other attributes.
   *
   * @return {void} No return value.
   */
  private updatePokemonData(): void {
    const {
      abilities,
      flavor_text_entries,
      game_indices,
      height,
      held_items,
      id,
      names,
      sprites,
      stats,
      types,
      weight,
      cries,
      items,
    } = this.selectedPokemon as Pokemon;

    this.id = id;
    this.name = names.find(
      (name) => name.language.name === this.selectedLanguage
    )!.name;

    this.imgSrc =
      sprites.other.dream_world.front_default ??
      sprites.other['official-artwork'].front_default;
    this.types = types.map(({ type }) => type.name);
    const filteredDescription = flavor_text_entries.filter(
      ({ language }: { language: { name: string } }) =>
        language.name === this.selectedLanguage
    );
    const randomDescription =
      filteredDescription[
        Math.floor(Math.random() * filteredDescription.length)
      ];
    this.description = randomDescription.flavor_text;
    this.cries = cries;
    this.stats = stats;
    this.hp_number = stats[0].base_stat;
    this.hp_text = stats[0].stat.name;
    this.height = (height * this.CM) / 100;
    this.weight = (weight * this.HECTOGRAM) / 1000;
    this.game_indices = game_indices;
    this.held_items = held_items;
    this.items = Array.isArray(items) ? items : [];
    this.abilities = abilities;
  }

  /**
   * Dynamically adds a background class to the overview card element.
   *
   * @return {void} No return value.
   */
  private addDynamicBackground(): void {
    const overviewCard = document.getElementById('overview-card');

    if (overviewCard) {
      overviewCard.className = 'overview-card';
      overviewCard.classList.add('type', this.types[0]);
    }
  }

  /**
   * Plays the cry of a Pokémon.
   *
   * If the cry audio URL is available, it creates a new Audio object, sets the volume,
   * and plays the audio. It also adds an event listener to stop the audio when it ends.
   * If the audio URL is not available, it displays an alert message.
   *
   * @return {void}
   */
  playCry(): void {
    const { latest, legacy } = this.cries || {};
    const audioUrl = latest || legacy;

    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.volume = this.audioVolume;
      if (!this.isAudioPlaying) {
        this.isAudioPlaying = true;
        audio.play();
      }
      audio.addEventListener('ended', () => {
        this.isAudioPlaying = false;
      });
    } else {
      alert('Cry not found');
    }
  }

  /**
   *  Closes the popup by hiding the overview element and re-enabling body scrolling.
   *
   *  @return {void} No return value.
   */
  closePopup(): void {
    const overview = document.getElementById('overview') as HTMLDivElement;
    if (overview) {
      overview.classList.add('d_none');
    }
    document.body.classList.remove('no-scroll');
  }

  /**
   * Creates a radar chart displaying the base stats of a Pokémon.
   *
   * @return {void} This function does not return anything.
   */
  private createStatsChart(): void {
    const ctx = this.getCanvasElement('chart');

    const labels = this.getStatLabels();
    const data = this.stats.map((stat) => stat.base_stat);

    const chart = Chart.getChart(ctx);
    if (chart) {
      chart.destroy();
    }

    new Chart(ctx, {
      type: 'radar',
      data: { labels, datasets: [{ label: 'Stats', data }] },
      options: {
        scales: {
          r: {
            ticks: { display: false, stepSize: 20 },
            pointLabels: { color: 'white' },
            angleLines: { display: true, color: 'rgba(255, 255, 255, 0.75)' },
            grid: { color: 'rgba(255, 255, 255, 0.75)' },
            suggestedMin: 0,
            suggestedMax: 120,
          },
        },
        plugins: {
          legend: { display: false },
        },
      },
    });
  }

  /**
   * Returns an array of stat labels based on the selected language.
   *
   * @return {string[]} An array of stat labels.
   */
  private getStatLabels(): string[] {
    const labels = ['HP', 'Attack', 'Defense', 'Sp. Atk', 'Sp. Def', 'Speed'];
    if (this.selectedLanguage === 'de') {
      labels[0] = 'HP';
      labels[1] = 'Angriff';
      labels[2] = 'Verteidigung';
      labels[3] = 'SP. Angriff';
      labels[4] = 'SP. Verteidigung';
      labels[5] = 'Initiative';
    }
    return labels;
  }

  /**
   * Returns the HTMLCanvasElement with the given id from the document.
   *
   * @param {string} id - The id of the canvas element to retrieve.
   * @return {HTMLCanvasElement} The HTMLCanvasElement with the given id.
   */
  private getCanvasElement(id: string): HTMLCanvasElement {
    return document.getElementById(id) as HTMLCanvasElement;
  }

  /**
   * Opens a tab based on the provided tab name and updates the active tab links.
   *
   * @param {Event} event - The event that triggered the tab opening.
   * @param {string} tabName - The name of the tab to be opened.
   * @return {void}
   */
  openTab(event: Event, tabName: string): void {
    const tabContents =
      document.querySelectorAll<HTMLDivElement>('.tabcontent');

    tabContents.forEach((tabContent) => {
      tabContent.style.display = 'none';
    });

    const tabs = document.querySelectorAll<HTMLImageElement>('.tablinks');

    tabs.forEach((tab) => tab.classList.remove('active'));

    const selectedTab = document.getElementById(tabName);

    if (selectedTab) {
      selectedTab.style.display = 'block';

      if (event.currentTarget) {
        (event.currentTarget as HTMLImageElement).classList.add('active');
      }
    }
  }

  /**
   * Resets the display of tab contents based on their IDs.
   *
   * @return {void} This function does not return a value.
   */
  resetTabDisplay(): void {
    const tabContents = document.querySelectorAll<HTMLElement>('.tabcontent');

    tabContents.forEach((tabContent) => {
      tabContent.style.display =
        tabContent.id === 'stats-Chart' ? 'block' : 'none';
    });
  }
}
