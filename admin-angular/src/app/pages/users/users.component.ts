import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UserService, AppUser } from '../../services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <h1>Gestion de usuarios (CRUD)</h1>
      <p class="error" *ngIf="error">{{ error }}</p>
      <p class="success" *ngIf="message">{{ message }}</p>

      <div class="card">
        <h3>{{ editingId ? 'Editar usuario' : 'Nuevo usuario' }}</h3>
        <form [formGroup]="form" (ngSubmit)="save()">
          <div class="row">
            <label>Nombre <input formControlName="name" /></label>
            <label>Correo <input type="email" formControlName="email" /></label>
          </div>
          <div class="row">
            <label>Rol
              <select formControlName="role">
                <option value="student">Estudiante</option>
                <option value="admin">Administrador</option>
              </select>
            </label>
            <label *ngIf="!editingId">Contrasena <input type="password" formControlName="password" /></label>
          </div>
          <div class="actions" style="margin-top:12px">
            <button type="submit" [disabled]="form.invalid">{{ editingId ? 'Actualizar' : 'Crear' }}</button>
            <button type="button" class="secondary" *ngIf="editingId" (click)="cancelEdit()">Cancelar</button>
          </div>
        </form>
      </div>

      <div class="card">
        <table>
          <thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Acciones</th></tr></thead>
          <tbody>
            <tr *ngFor="let u of users">
              <td>{{ u.name }}</td>
              <td>{{ u.email }}</td>
              <td>{{ u.role }}</td>
              <td class="actions">
                <button (click)="edit(u)">Editar</button>
                <button class="danger" (click)="remove(u)">Eliminar</button>
              </td>
            </tr>
            <tr *ngIf="users.length === 0"><td colspan="4">No hay usuarios.</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class UsersComponent implements OnInit {
  users: AppUser[] = [];
  editingId: string | null = null;
  error = '';
  message = '';

  private fb = inject(FormBuilder);
  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['student', Validators.required],
    password: ['', [Validators.minLength(6)]],
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
    if (this.form.invalid) return;
    const v = this.form.value;
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
    this.form.patchValue({ name: u.name, email: u.email, role: u.role });
    this.form.get('password')?.clearValidators();
    this.form.get('password')?.updateValueAndValidity();
    this.message = '';
  }

  cancelEdit() {
    this.editingId = null;
    this.form.reset({ role: 'student' });
    this.form.get('password')?.setValidators([Validators.minLength(6)]);
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
