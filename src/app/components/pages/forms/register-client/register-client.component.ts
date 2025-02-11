import { Component } from '@angular/core';
import { FirebaseService } from '../../../../services/firebase.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-client',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-client.component.html',
  styleUrl: './register-client.component.css'
})

export class RegisterClientComponent {
  loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor( firebaseServide: FirebaseService ) {}
  async onSubmit(): Promise<void> {

    // Si ha rellenado todos los campos y son válidos
    if (this.loginForm.valid) {

    }

  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

}
