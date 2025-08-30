import { Component } from '@angular/core';
import { MenubarTemplate } from '../menubar/menubar';

@Component({
  selector: 'app-dashboard',
  imports: [MenubarTemplate],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

}
