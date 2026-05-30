import { AppComponent } from './app.component';
import { WelcomeEnvelopeDemoComponent } from './components/welcome-envelope-demo/welcome-envelope-demo.component';

export const routes = [
  {
    path: 'welcome-demo',
    name: 'WelcomeEnvelopeDemoComponent',
    component: WelcomeEnvelopeDemoComponent,
  },
  { path: '**', name: 'AppComponent', component: AppComponent },
];
