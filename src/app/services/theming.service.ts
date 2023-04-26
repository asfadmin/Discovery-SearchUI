import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemingService {
  public theme$: BehaviorSubject<string> = new BehaviorSubject('light');

  constructor() {
    const darkModeOn =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    // If dark mode is enabled then directly switch to the dark-theme
    if(darkModeOn){
      this.theme$.next("dark");
    }

    // Watch for changes of the preference
    window.matchMedia("(prefers-color-scheme: dark)").addListener(e => {
      const turnOn = e.matches;
      this.theme$.next(turnOn ? "dark" : "light");
    });
  }

  public setTheme(themeName: string): void {
    let body = document.getElementsByTagName("body")[0];
    // removes all classes from body, probably not best for later on
    body.removeAttribute('class');
    body.classList.add(themeName);
  }
}
