/**
 * A component that displays the game's credits.
 *
 * This component is rendered when the user navigates to the credits view.
 *
 * @package
 */
import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';

/**
 * The component that displays the game's credits.
 *
 * The component displays the game's authors and their respective roles.
 *
 * @standalone
 * @imports []
 * @templateUrl ./credits.component.html
 * @styleUrl ./credits.component.scss
 */
@Component({
  selector: 'app-credits',
  standalone: true,
  imports: [],
  templateUrl: './credits.component.html',
  styleUrl: './credits.component.scss',
})
export class CreditsComponent implements OnInit {
  /**
   * The audio element that is used to play the credits music.
   *
   * The audio element is retrieved in the {@link ngOnInit} method and is
   * undefined until then.
   */
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

  /**
   * Initializes the component by setting up the audio playback.
   *
   * This function checks if the audio element is available, sets the initial volume to 0, and starts playing the audio in a loop.
   * It also gradually increases the volume to the user's preferred level over time.
   *
   * @return {void} No return value.
   */
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

  /**
   *  Destroys the component and stops the audio playback.
   *
   *  This method is called when the component is being destroyed. It pauses the audio
   *  playback and resets the current time to 0.
   *
   *  @return {void} No return value.
   */
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
