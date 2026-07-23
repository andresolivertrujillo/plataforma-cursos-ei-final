import { Component, OnInit, inject } from '@angular/core';

import { AbstractControl, ReactiveFormsModule, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { UserService, AppUser } from '../../services/user.service';

function trimmedRequired(control: AbstractControl): ValidationErrors | null {
  return typeof control.value === 'string' && control.value.trim() ? null : { trimmedRequired: true };
}

@Component({
    selector: 'app-users',
    imports: [ReactiveFormsModule],
    template: `
    <div class="container">
      <h1>Gestion de usuarios (CRUD)</h1>
      @if (error) {
        <p class="error">{{ error }}</p>
      }
      @if (message) {
        <p class="success">{{ message }}</p>
      }

      <div class="card">
        <h3>{{ editingId ? 'Editar usuario' : 'Nuevo usuario' }}</h3>
        <form [formGroup]="form" (ngSubmit)="save()">
          <div class="row">
            <label>Nombre <input formControlName="name" /></label>
            <label>Correo
              <input type="email" formControlName="email" />
              @if ((form.get('email')?.dirty || submitted) && form.get('email')?.hasError('required')) {
                <small class="field-error">El correo es obligatorio.</small>
              }
              @if ((form.get('email')?.dirty || submitted) && !form.get('email')?.hasError('required') && form.get('email')?.hasError('email')) {
                <small class="field-error">Ingresa un correo valido.</small>
              }
            </label>
          </div>
          <div class="row">
            <label>Rol
              <select formControlName="role">
                <option value="student">Estudiante</option>
                <option value="admin">Administrador</option>
              </select>
            </label>
            @if (!editingId) {
              <label>Contrasena
                <input type="password" formControlName="password" />
                @if ((form.get('password')?.touched || submitted) && form.get('password')?.hasError('required')) {
                  <small
                    class="error"
                  >La contrasena es obligatoria.</small>
                }
                @if ((form.get('password')?.touched || submitted) && !form.get('password')?.hasError('required') && form.get('password')?.hasError('minlength')) {
                  <small
                    class="error"
                  >La contrasena debe tener al menos 6 caracteres.</small>
                }
              </label>
            }
          </div>
          <div class="actions" style="margin-top:12px">
            <button type="submit" [disabled]="form.invalid">{{ editingId ? 'Actualizar' : 'Crear' }}</button>
            @if (editingId) {
              <button type="button" class="secondary" (click)="cancelEdit()">Cancelar</button>
            }
          </div>
        </form>
      </div>

      <div class="card">
        <div class="table-scroll" tabindex="0" aria-label="Tabla de usuarios">
          <table>
          <thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Acciones</th></tr></thead>
          <tbody>
            @for (u of users; track u._id) {
              <tr>
                <td>{{ u.name }}</td>
                <td>{{ u.email }}</td>
                <td>{{ u.role }}</td>
                <td class="actions">
                  <button (click)="edit(u)">Editar</button>
                  <button class="danger" (click)="remove(u)">Eliminar</button>
                </td>
              </tr>
            }
            @if (users.length === 0) {
              <tr><td colspan="4">No hay usuarios.</td></tr>
            }
          </tbody>
          </table>
        </div>
      </div>
    </div>
    `
})
export class UsersComponent implements OnInit {
  users: AppUser[] = [];
  editingId: string | null = null;
  error = '';
  message = '';
  submitted = false;

  private fb = inject(FormBuilder);
  form = this.fb.group({
    name: ['', [Validators.required, trimmedRequired]],
    email: ['', [Validators.required, Validators.email]],
    role: ['student', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(private srv: UserService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.srv.list().subscribe({
      next: (data) => (this.users = data),
      error: (e) => (this.error = e.error?.message || 'Error al cargar'),
    });
  }

  save() {
    this.submitted = true;
    const raw = this.form.getRawValue();
    this.form.patchValue(
      {
        name: raw.name?.trim() ?? '',
        email: raw.email?.trim() ?? '',
      },
      { emitEvent: false }
    );
    this.form.updateValueAndValidity();
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    if (this.editingId) {
      this.srv.update(this.editingId, { name: v.name!, email: v.email!, role: v.role! }).subscribe({
        next: () => { this.message = 'Usuario actualizado'; this.cancelEdit(); this.load(); },
        error: (e) => (this.error = e.error?.message || 'Error'),
      });
    } else {
      this.srv.create({ name: v.name!, email: v.email!, role: v.role!, password: v.password! }).subscribe({
        next: () => { this.message = 'Usuario creado'; this.cancelEdit(); this.load(); },
        error: (e) => (this.error = e.error?.message || 'Error'),
      });
    }
  }

  edit(u: AppUser) {
    this.editingId = u._id!;
    this.submitted = false;
    this.form.patchValue({ name: u.name, email: u.email, role: u.role, password: '' });
    this.form.get('password')?.setValidators([Validators.minLength(6)]);
    this.form.get('password')?.updateValueAndValidity();
    this.message = '';
  }

  cancelEdit() {
    this.editingId = null;
    this.submitted = false;
    this.form.reset({ role: 'student' });
    this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.form.get('password')?.updateValueAndValidity();
  }

  remove(u: AppUser) {
    if (!confirm(`Eliminar a "${u.name}"?`)) return;
    this.srv.remove(u._id!).subscribe({
      next: () => { this.message = 'Usuario eliminado'; this.load(); },
      error: (e) => (this.error = e.error?.message || 'Error'),
    });
  }
}
