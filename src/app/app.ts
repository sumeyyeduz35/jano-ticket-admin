// Bu dosya, uygulamanın kök (root) bileşenini tanımlar
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

//-----------------------------------------------------------

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],    // Sayfa yönlendirmeleri için RouterOutlet
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('jano-ticket-admin');
}
