import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PseudoauthService } from '../../../../services/pseudoauth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(
    // Usamos el pseudologin de momento
    private firebaseService: PseudoauthService,
    private router: Router
  ) {}

  ngOnInit(): void {

    // Con el pseudologin, esto no va a funcionar realmente
    if(this.firebaseService.isLoggedIn()){
      const uid = this.firebaseService.getUID();
      this.router.navigate(['/home', uid]);
    }

  }

  async onSubmit(): Promise<void> {

    // Si ha rellenado todos los campos y son válidos
    if (this.loginForm.valid) {
      const email: string = this.loginForm.get('email')!.value ?? ''; 
      const password: string = this.loginForm.get('password')!.value ?? '';

      // Hacemos el pseudologin
      if (await this.firebaseService.login(email, password)){
        const uid = this.firebaseService.getUID();

        // Si los datos son correctos, redirigimos al home del entrenador específico
        this.router.navigate(['/home', uid]);

      } else {
        console.error('Error en el login.');
      }
    }

  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}