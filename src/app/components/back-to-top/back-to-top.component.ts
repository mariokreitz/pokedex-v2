import { Component, OnInit } from '@angular/core';

/**
 * Back to top button component
 *
 * This component displays a button that allows the user to quickly scroll to the top of the page.
 */
@Component({
  selector: 'app-back-to-top',
  standalone: true,
  imports: [],
  templateUrl: './back-to-top.component.html',
  styleUrl: './back-to-top.component.scss',
})
export class BackToTopComponent implements OnInit {
  /**
   * The button element
   */
  private buttonElement: HTMLElement | null = null;

  /**
   * Handles the scroll event
   *
   * If the user has scrolled more than 200 pixels from the top of the page, the button is displayed.
   * Otherwise, it is hidden.
   */
  private handleScrollEvent = (): void => {
    if (!this.buttonElement) {
      return;
    }

    const isScrolledDown =
      document.body.scrollTop > 200 || document.documentElement.scrollTop > 200;

    this.buttonElement.style.display = isScrolledDown ? 'flex' : 'none';
  };

  /**
   * Scrolls the page to the top
   *
   * This method is called when the user clicks the button.
   */
  scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Initializes the component
   *
   * This method is called when the component is initialized.
   * It adds an event listener to the window to listen for the scroll event.
   */
  ngOnInit(): void {
    this.buttonElement = document.getElementById('backToTop');
    window.addEventListener('scroll', this.handleScrollEvent);
  }
}
