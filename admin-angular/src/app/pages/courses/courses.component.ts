import { Component, OnInit, inject } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CourseService, Course } from '../../services/course.service';

@Component({
    selector: 'app-courses',
    imports: [ReactiveFormsModule],
    template: `
    <div class="container">
      <h1>Gestion de cursos (CRUD)</h1>
      @if (error) {
        <p class="error">{{ error }}</p>
      }
      @if (message) {
        <p class="success">{{ message }}</p>
      }

      <div class="card">
        <h3>{{ editingId ? 'Editar curso' : 'Nuevo curso' }}</h3>
        <form [formGroup]="form" (ngSubmit)="save()">
          <div class="row">
            <label>Titulo <input formControlName="title" /></label>
            <label>Categoria <input formControlName="category" /></label>
          </div>
          <div class="row">
            <label>Instructor <input formControlName="instructor" /></label>
            <label>Creditos <input type="number" formControlName="credits" /></label>
          </div>
          <div class="row">
            <label>Capacidad <input type="number" formControlName="capacity" /></label>
            <label>Precio <input type="number" formControlName="price" /></label>
          </div>
          <label>Descripcion <input formControlName="description" /></label>
          <div class="actions" style="margin-top:12px">
            <button type="submit" [disabled]="form.invalid">{{ editingId ? 'Actualizar' : 'Crear' }}</button>
            @if (editingId) {
              <button type="button" class="secondary" (click)="cancelEdit()">Cancelar</button>
            }
          </div>
        </form>
      </div>

      <div class="card">
        <table>
          <thead>
            <tr><th>Titulo</th><th>Categoria</th><th>Docente</th><th>Cred.</th><th>Cap.</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            @for (c of courses; track c) {
              <tr>
                <td>{{ c.title }}</td>
                <td>{{ c.category }}</td>
                <td>{{ c.instructor }}</td>
                <td>{{ c.credits }}</td>
                <td>{{ c.capacity }}</td>
                <td class="actions">
                  <button (click)="edit(c)">Editar</button>
                  <button class="danger" (click)="remove(c)">Eliminar</button>
                </td>
              </tr>
            }
            @if (courses.length === 0) {
              <tr><td colspan="6">No hay cursos.</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
    `
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  editingId: string | null = null;
  error = '';
  message = '';

  private fb = inject(FormBuilder);
  form = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    category: ['', Validators.required],
    instructor: ['', Validators.required],
    credits: [3, [Validators.required, Validators.min(1), Validators.max(10)]],
    capacity: [30, [Validators.required, Validators.min(1)]],
    price: [0, [Validators.min(0)]],
  });

  constructor(private srv: CourseService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.srv.list().subscribe({
      next: (data) => (this.courses = data),
      error: (e) => (this.error = e.error?.message || 'Error al cargar'),
    });
  }

  save() {
    if (this.form.invalid) return;
    const payload = this.form.value as Course;
    const req = this.editingId
      ? this.srv.update(this.editingId, payload)
      : this.srv.create(payload);
    req.subscribe({
      next: () => {
        this.message = this.editingId ? 'Curso actualizado' : 'Curso creado';
        this.cancelEdit();
        this.load();
      },
      error: (e) => (this.error = e.error?.message || 'Error al guardar'),
    });
  }

  edit(c: Course) {
    this.editingId = c._id!;
    this.form.patchValue(c);
    this.message = '';
  }

  cancelEdit() {
    this.editingId = null;
    this.form.reset({ credits: 3, capacity: 30, price: 0 });
  }

  remove(c: Course) {
    if (!confirm(`Eliminar "${c.title}"?`)) return;
    this.srv.remove(c._id!).subscribe({
      next: () => {
        this.message = 'Curso eliminado';
        this.load();
      },
      error: (e) => (this.error = e.error?.message || 'Error al eliminar'),
    });
  }
}
