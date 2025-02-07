import { Component } from '@angular/core';
import { FirebaseService } from '../../../../services/firebase.service';

@Component({
  selector: 'app-client-details',
  imports: [],
  templateUrl: './client-details.component.html',
  styleUrl: './client-details.component.css'
})

export class ClientDetailsComponent {
  constructor( firebaseServide: FirebaseService ) {}
  

}
