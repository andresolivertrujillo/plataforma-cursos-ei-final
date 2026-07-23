import { Component, inject } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule],
    template: `
    <div class="container">
      <div class="card login-box">
        <h1>Panel Administrativo</h1>
        <p style="color:var(--muted)">Ingresa con una cuenta de administrador.</p>
        @if (error) {
          <p class="error">{{ error }}</p>
        }
        <form [formGroup]="form" (ngSubmit)="submit()">
          <label>Correo
            <input type="email" formControlName="email" />
          </label>
          @if (form.get('email')?.touched && form.get('email')?.invalid) {
            <small class="error">Email invalido</small>
          }
          <label style="margin-top:12px">Contrasena
            <input type="password" formControlName="password" />
          </label>
          @if (form.get('password')?.touched && form.get('password')?.invalid) {
            <small class="error">Requerido</small>
          }
          <button type="submit" style="margin-top:16px; width:100%" [disabled]="form.invalid || loading">
            {{ loading ? 'Ingresando...' : 'Ingresar' }}
          </button>
        </form>
      </div>
    </div>
    `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    if (this.form.invalid) return;
    this.error = '';
    this.loading = true;
    const { email, password } = this.form.value;
    this.auth.login(email!, password!).subscribe({
      next: () => {
        if (this.auth.getRole() !== 'admin') {
          this.error = 'Esta cuenta no tiene rol de administrador.';
          this.auth.logout();
          this.loading = false;
          return;
        }
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al iniciar sesion';
        this.loading = false;
      },
    });
  }
}
