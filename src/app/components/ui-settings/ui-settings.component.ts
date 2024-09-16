import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { PercentPipe } from '@angular/common';
import { Limit } from '../../../types/loadingLimits';

@Component({
  selector: 'app-ui-settings',
  standalone: true,
  imports: [PercentPipe],
  templateUrl: './ui-settings.component.html',
  styleUrl: './ui-settings.component.scss',
})
export class UiSettingsComponent implements OnInit {
  loadLimits = this.settingsService.getLimits();

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {}

  /**
   * Toggles the visibility of the settings menu.
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
   * @return {number} The current audio volume.
   */
  getAudioVolume(): number {
    return this.settingsService.getAudioVolume();
  }

  setPokemonLimit(event: Event, limit: Limit): void {
    event.stopPropagation();

    this.settingsService.setPokemonLimit(limit);
  }
}
