import { Component, OnInit, inject } from '@angular/core';

import { AbstractControl, ReactiveFormsModule, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { CourseService, Course } from '../../services/course.service';

function trimmedRequired(control: AbstractControl): ValidationErrors | null {
  return typeof control.value === 'string' && control.value.trim() ? null : { trimmedRequired: true };
}

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
            <label>Titulo
              <input formControlName="title" />
              @if ((form.get('title')?.dirty || submitted) && form.get('title')?.invalid) {
                <small class="field-error">El titulo es obligatorio y no puede contener solo espacios.</small>
              }
            </label>
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
        <div class="table-scroll" tabindex="0" aria-label="Tabla de cursos">
          <table>
          <thead>
            <tr><th>Titulo</th><th>Categoria</th><th>Docente</th><th>Cred.</th><th>Cap.</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            @for (c of courses; track c._id) {
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
    </div>
    `
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  editingId: string | null = null;
  error = '';
  message = '';
  submitted = false;

  private fb = inject(FormBuilder);
  form = this.fb.group({
    title: ['', [Validators.required, trimmedRequired]],
    description: ['', [Validators.required, trimmedRequired]],
    category: ['', [Validators.required, trimmedRequired]],
    instructor: ['', [Validators.required, trimmedRequired]],
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
    this.submitted = true;
    const value = this.form.getRawValue();
    this.form.patchValue(
      {
        title: value.title?.trim() ?? '',
        description: value.description?.trim() ?? '',
        category: value.category?.trim() ?? '',
        instructor: value.instructor?.trim() ?? '',
      },
      { emitEvent: false }
    );
    this.form.updateValueAndValidity();
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const normalized = this.form.getRawValue();
    const payload: Course = {
      title: normalized.title!,
      description: normalized.description!,
      category: normalized.category!,
      instructor: normalized.instructor!,
      credits: normalized.credits!,
      capacity: normalized.capacity!,
      price: normalized.price ?? 0,
    };
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
    this.submitted = false;
    this.form.patchValue(c);
    this.message = '';
  }

  cancelEdit() {
    this.editingId = null;
    this.submitted = false;
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
