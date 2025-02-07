import { Component } from '@angular/core';
import { FirebaseService } from '../../../../services/firebase.service';

@Component({
  selector: 'app-register-workout',
  imports: [],
  templateUrl: './register-workout.component.html',
  styleUrl: './register-workout.component.css'
})

export class RegisterWorkoutComponent {
  constructor( firebaseServide: FirebaseService ) {}
  

}
