import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PseudoauthService } from '../../../../services/pseudoauth.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';

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

  loginError: string | null = null; // Mensaje de error

  constructor(
    private firebaseService: PseudoauthService,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.firebaseService.isLoggedIn()) {
      const uid = this.firebaseService.getUID();
      this.router.navigate(['/home', uid]);
    }
  }

  async onSubmit(): Promise<void> {
    this.loginError = null; // Reiniciar el mensaje de error al intentar iniciar sesión

    if (this.loginForm.valid) {
      const email: string = this.loginForm.get('email')!.value ?? ''; 
      const password: string = this.loginForm.get('password')!.value ?? '';

      if (await this.firebaseService.login(email, password)) {
        const uid = this.firebaseService.getUID();
        this.router.navigate(['/home', uid]);
      } else {
        this.loginError = 'Correo o contraseña incorrectos. Inténtalo de nuevo.';
      }
    }
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}
