# Auditoría Lighthouse

La auditoría final se ejecutó sobre los tres frontends desplegados después de despertar el backend de Render.

## Metodología

- Lighthouse: 13.4.1.
- Modalidad: navegación.
- Dispositivo: escritorio (`desktop`).
- URLs públicas desplegadas en Vercel.
- Reportes guardados en formato HTML dentro de `docs/lighthouse/`.

## Resultados

| Aplicación | Performance | Accessibility | Best Practices | SEO | Agentic Browsing |
|---|---:|---:|---:|---:|---:|
| Next.js público | 100 | 98 | 96 | 100 | 100 |
| React estudiante | 100 | 97 | 100 | 82 | 67 |
| Angular administrador | 100 | 96 | 100 | 82 | 67 |

## Reportes HTML

- [Next.js público](lighthouse/public-next.html)
- [React estudiante](lighthouse/student-react.html)
- [Angular administrador](lighthouse/admin-angular.html)

## Observaciones

- Las tres aplicaciones obtuvieron 100 en rendimiento en la ejecución registrada.
- Next.js alcanzó 100 en SEO; las SPA React y Angular obtuvieron 82 y pueden mejorar metadatos específicos para cada documento.
- Accesibilidad se mantuvo entre 96 y 98; los detalles de cada oportunidad están incluidos en los reportes HTML.
- El sitio público obtuvo 96 en buenas prácticas; el reporte correspondiente contiene las auditorías concretas pendientes.
- La categoría Agentic Browsing forma parte de Lighthouse 13 y se conserva en el resumen para reflejar íntegramente la ejecución.
