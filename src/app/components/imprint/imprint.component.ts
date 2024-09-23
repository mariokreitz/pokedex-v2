import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { SettingsService } from '../../services/settings.service';
import { BackToTopComponent } from '../back-to-top/back-to-top.component';

/**
 * Imprint component
 *
 * This component displays the application's imprint information.
 */
@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [RouterOutlet, BackToTopComponent],
  templateUrl: './imprint.component.html',
  styleUrls: ['./imprint.component.scss'],
})
export class ImprintComponent implements OnInit {
  /**
   * Constructor
   *
   * Initializes the ImprintComponent with the required services.
   *
   * @param {SettingsService} settingsService - The service providing access to the application settings.
   * @param {Router} router - The Angular router for navigating between routes.
   */
  constructor(
    private settingsService: SettingsService,
    public router: Router
  ) {}

  /**
   * Retrieves the currently set language from the settings service.
   *
   * @return {string} The currently set language.
   */
  get language(): string {
    return this.settingsService.getLanguage();
  }

  /**
   * Initializes the component.
   *
   * @return {void} No return value.
   */
  ngOnInit(): void {}

  /**
   * Navigates to the application's home route.
   *
   * @return {void} No return value.
   */
  navigateToHome(): void {
    this.router.navigate(['/']);
  }
}
