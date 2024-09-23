import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss',
})
export class ImprintComponent implements OnInit {
  constructor(private settingsService: SettingsService) {}

  get language(): string {
    return this.settingsService.getLanguage();
  }

  ngOnInit(): void {}
}
