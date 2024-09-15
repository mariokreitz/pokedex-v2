import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Pokemon } from '../../../../types/pokedex';
import { DecimalPipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import Chart from 'chart.js/auto';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'app-pokemon-popup',
  standalone: true,
  imports: [UpperCasePipe, TitleCasePipe, DecimalPipe],
  templateUrl: './pokemon-popup.component.html',
  styleUrl: './pokemon-popup.component.scss',
})
export class PokemonPopupComponent implements OnInit {
  @Input() selectedPokemon: Pokemon | null = null;
  // https://github.com/veekun/pokedex/blob/master/pokedex/db/tables.py#L1649
  // The height of the Pokémon, in tenths of a meter (decimeters = 10cm)
  // The weight of the Pokémon, in tenths of a kilogram (hectograms = 100gramm)
  private readonly CM = 10;
  private readonly HECTOGRAM = 100;

  private audioVolume = 0.25;
  private isAudioPlaying = false;

  id!: number;
  name!: string;
  hp_number!: number;
  hp_text!: string;
  imgSrc!: string | null;
  types!: string[];
  stats!: {
    base_stat: number;
    effort: number;
    stat: { name: string; url: string };
  }[];
  description!: string;
  cries?: {
    latest: string;
    legacy: string;
  };
  height!: number;
  weight!: number;
  held_items!: {
    item: { name: string; url: string };
    version_details: {
      rarity: number;
    }[];
  }[];
  game_indices!: {
    game_index: number;
    version: { name: string; url: string };
  }[];
  items?: {
    name: string;
    sprites: {
      default: string | null;
    };
  }[];
  abilities!: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }[];

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.settingsService.currentAudioVolume.subscribe((volume) => {
      this.audioVolume = volume;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedPokemon']) {
      if (this.selectedPokemon) {
        const {
          abilities,
          flavor_text_entries,
          game_indices,
          height,
          held_items,
          id,
          moves,
          name,
          names,
          order,
          species,
          sprites,
          stats,
          types,
          weight,
          cries,
          items,
        } = this.selectedPokemon;
        this.id = id;
        this.name = name;
        this.imgSrc =
          sprites.other.dream_world.front_default ??
          sprites.other['official-artwork'].front_default;
        this.types = types.map(({ type }) => type.name);
        const filteredDescription = flavor_text_entries.filter(
          ({ language }) => language.name === 'en'
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
        this.createStatsChart();
        this.addDynamicBackground();
      }
    }
    this.resetTabDisplay();
  }

  /**
   * Dynamically adds a CSS class to the overview card element based on the Pokémon's type.
   *
   * This function retrieves the overview card element and adds a CSS class corresponding to the Pokémon's primary type.
   *
   * @return {void}
   */
  private addDynamicBackground(): void {
    const overviewCard = document.getElementById('overview-card');

    if (overviewCard) {
      overviewCard.className = 'overview-card';
      overviewCard.classList.add('type', this.types[0]);
    }
  }

  /**
   * Plays the cry of the current Pokémon.
   *
   * Retrieves the latest or legacy cry URL from the Pokémon's cries object and creates a new Audio object to play the cry.
   * If the cry is found, it sets the audio volume and plays the cry. It also adds an event listener to reset the isAudioPlaying flag when the cry ends.
   * If the cry is not found, it displays an alert message.
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
   * Closes the popup by hiding the 'overview' element and removing the 'no-scroll' class from the document body.
   *
   * @return {void} This function does not return anything.
   */
  closePopup(): void {
    const overview = document.getElementById('overview') as HTMLDivElement;
    if (overview) {
      overview.classList.add('d_none');
    }
    document.body.classList.remove('no-scroll');
  }

  /**
   * Creates a radar chart to display the Pokémon's stats.
   *
   * The chart is created using the Chart.js library and is displayed in the 'stats-Chart' canvas element.
   * The chart data is generated from the Pokémon's stats, with each stat being represented by a point on the chart.
   * The chart options are customized to display the chart in a radar style, with a white background and gray grid lines.
   *
   * @return {void}
   */
  private createStatsChart(): void {
    const ctx = this.getCanvasElement('chart');

    const labels = ['HP', 'Attack', 'Defense', 'Sp. Atk', 'Sp. Def', 'Speed'];
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
   * Retrieves an HTMLCanvasElement from the document by its id.
   *
   * @param {string} id - The id of the HTMLCanvasElement to retrieve.
   * @return {HTMLCanvasElement} The HTMLCanvasElement with the specified id.
   */
  private getCanvasElement(id: string): HTMLCanvasElement {
    return document.getElementById(id) as HTMLCanvasElement;
  }

  /**
   * Opens a tab based on the provided tab name and event.
   *
   * @param {Event} event - The event that triggered the tab opening.
   * @param {string} tabName - The name of the tab to open.
   * @return {void} No return value.
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

  resetTabDisplay(): void {
    /**
     * Resets the display of tabs to their default state.
     *
     * @return {void} No return value.
     */
    const tabContents = document.querySelectorAll<HTMLElement>('.tabcontent');

    tabContents.forEach((tabContent) => {
      tabContent.style.display =
        tabContent.id === 'stats-Chart' ? 'block' : 'none';
    });
  }
}
