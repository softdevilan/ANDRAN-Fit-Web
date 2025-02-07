import { Component } from '@angular/core';
import { FirebaseService } from '../../../../services/firebase.service';

@Component({
  selector: 'app-client-list',
  imports: [],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.css'
})

export class ClientListComponent {
  constructor( firebaseServide: FirebaseService ) {}
  

}
