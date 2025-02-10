import { Component } from '@angular/core';
import { FirebaseService } from '../../../services/firebase.service';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { ClientListComponent } from '../clients/client-list/client-list.component';


@Component({
  selector: 'app-home',
  imports: [SidebarComponent, ClientListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  constructor( firebaseServide: FirebaseService ) {}

}
