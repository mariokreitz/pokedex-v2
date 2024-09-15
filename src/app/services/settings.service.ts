import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly DEFAULT_AUDIO_VOLUME = 0.25;
  private readonly audioVolume = new BehaviorSubject<number>(
    this.DEFAULT_AUDIO_VOLUME
  );

  readonly currentAudioVolume = this.audioVolume.asObservable();

  constructor() {
    const savedVolume = localStorage.getItem('audioVolume');
    if (savedVolume !== null) {
      this.audioVolume.next(parseFloat(savedVolume));
    }

    this.audioVolume.subscribe((volume) => {
      localStorage.setItem('audioVolume', volume.toString());
    });
  }

  setAudioVolume(volume: number): void {
    this.audioVolume.next(volume);
  }

  getAudioVolume(): number {
    return this.audioVolume.getValue();
  }
}
