/**
 * A component that displays the game's credits.
 *
 * This component is rendered when the user navigates to the credits view.
 *
 * @package
 */
import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { Router } from '@angular/router';

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
   * Initializes the CreditsComponent by setting up the audio playback and event listeners.
   *
   * @param {SettingsService} settingsService - The settings service used to retrieve the current language.
   * @param {Router} router - The router used to navigate to the root route when the audio ends.
   */
  constructor(
    private settingsService: SettingsService,
    private router: Router
  ) {
    this.audio = new Audio('./assets/game-music-loop-7-145285.mp3');

    this.audio.addEventListener('ended', () => {
      if (this.audio) {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.audio.volume = 0;
      }
      this.router.navigate(['/']);
    });

    document.addEventListener('keydown', (event) => this.handleKeydown(event));
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
   * Initializes the component's view after Angular has initialized the component's view and child views.
   *
   * This function sets the opacity of the '.content' element to 0, hides the vertical scrollbar, and gradually
   * increases the opacity to 1 over a duration of 3000ms using CSS transition. It also translates the '.content'
   * element upwards by a distance equal to the window's inner height, and repeats this translation every 10ms.
   *
   * @return {void} No return value.
   */
  ngAfterViewInit(): void {
    const content = document.querySelector('.content') as HTMLDivElement;
    if (content) {
      content.style.opacity = '0';
      document.body.classList.add('no-scroll');
      setTimeout(() => {
        content.style.transition = 'opacity 3000ms ease-in-out';
        content.style.opacity = '1';
      }, 125);

      let translateY = window.innerHeight;
      setInterval(() => {
        translateY -= 1;
        content.style.transform = `translateY(${translateY}px)`;
      }, 10);
    }
  }

  /**
   * Handles keydown events to provide a way to navigate away from the current view.
   *
   * @param {KeyboardEvent} event - The keyboard event triggered by the user.
   * @return {void} No return value.
   */
  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.router.navigate(['/']);
    }
  }
}
