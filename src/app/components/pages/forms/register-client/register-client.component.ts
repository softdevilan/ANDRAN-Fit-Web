import { Component } from '@angular/core';
import { FirebaseService } from '../../../../services/firebase.service';

@Component({
  selector: 'app-register-client',
  imports: [],
  templateUrl: './register-client.component.html',
  styleUrl: './register-client.component.css'
})

export class RegisterClientComponent {
  constructor( firebaseServide: FirebaseService ) {}
  

}
