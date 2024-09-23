/**
 * A component that displays a loading animation.
 *
 * @example
 * <app-loading></app-loading>
 *
 * @author [Your Name]
 * @version 1.0.0
 * @since 1.0.0
 */
import { Component } from '@angular/core';

/**
 * LoadingComponent
 *
 * A component that displays a loading animation.
 *
 * Selector: app-loading
 * TemplateUrl: ./loading.component.html
 * StyleUrl: ./loading.component.scss
 */
@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent {}
