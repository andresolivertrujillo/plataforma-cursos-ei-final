import { Component, OnInit } from '@angular/core';

import { RouterLink } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-dashboard',
    imports: [RouterLink],
    template: `
    <div class="container">
      <h1>Dashboard</h1>
      <div class="row">
        <div class="card">
          <h2>{{ totalCourses }}</h2>
          <p style="color:var(--muted)">Cursos registrados</p>
          <a routerLink="/cursos">Gestionar cursos &rarr;</a>
        </div>
        <div class="card">
          <h2>{{ totalUsers }}</h2>
          <p style="color:var(--muted)">Usuarios registrados</p>
          <a routerLink="/usuarios">Gestionar usuarios &rarr;</a>
        </div>
      </div>
      @if (error) {
        <p class="error">{{ error }}</p>
      }
    </div>
    `
})
export class DashboardComponent implements OnInit {
  totalCourses = 0;
  totalUsers = 0;
  error = '';

  constructor(private courseSrv: CourseService, private userSrv: UserService) {}

  ngOnInit(): void {
    this.courseSrv.list().subscribe({
      next: (c) => (this.totalCourses = c.length),
      error: (e) => (this.error = e.error?.message || 'Error al cargar cursos'),
    });
    this.userSrv.list().subscribe({
      next: (u) => (this.totalUsers = u.length),
      error: () => {},
    });
  }
}
