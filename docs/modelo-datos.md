# Modelo de datos

Base de datos: `plataforma_cursos` en MongoDB Atlas. Tres colecciones principales.

```mermaid
erDiagram
    USER ||--o{ ENROLLMENT : realiza
    COURSE ||--o{ ENROLLMENT : contiene

    USER {
      ObjectId _id
      string name
      string email "unico"
      string password "hasheado bcrypt"
      string role "admin | student"
      date createdAt
    }
    COURSE {
      ObjectId _id
      string title
      string description
      string category
      string instructor
      number credits
      number capacity
      number price
      boolean active
      date createdAt
    }
    ENROLLMENT {
      ObjectId _id
      ObjectId student "ref User"
      ObjectId course "ref Course"
      string status "inscrito | cancelado | completado"
      date createdAt
    }
```

## Reglas / validaciones

- `User.email` es unico.
- `Enrollment` tiene indice unico compuesto `{ student, course }`: un estudiante no puede inscribirse dos veces al mismo curso.
- Al inscribirse se valida el cupo (`capacity`) contra el numero de inscripciones activas.
- `credits` entre 1 y 10; `capacity` y `price` no negativos.
