import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-credits',
  standalone: true,
  imports: [],
  templateUrl: './credits.component.html',
  styleUrl: './credits.component.scss',
})
export class CreditsComponent implements OnInit {
  audio: HTMLAudioElement | undefined;
  /**
   * Retrieves the currently set language from the settings service.
   *
   * @return {string} The currently set language.
   */
  get language(): string {
    return this.settingsService.getLanguage();
  }
  /**
   * Constructor
   *
   * Initializes the CreditsComponent with the necessary services.
   *
   * @param {SettingsService} settingsService - The settings service that provides the necessary data for this component.
   */
  constructor(private settingsService: SettingsService) {
    this.audio = new Audio('./assets/game-music-loop-7-145285.mp3');
  }

  ngOnInit(): void {
    if (this.audio) {
      let initialVolume = 0;
      this.audio.loop = true;
      this.audio.volume = initialVolume;
      const intervalId = setInterval(() => {
        if (initialVolume < this.settingsService.getAudioVolume()) {
          initialVolume += 0.01;
          this.audio!.volume = initialVolume;
        } else {
          clearInterval(intervalId);
        }
      }, 90);
      this.audio.play();
      this.audio.loop = true;
    }
  }

  ngOnDestroy(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
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
