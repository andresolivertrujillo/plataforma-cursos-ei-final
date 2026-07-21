import './globals.css';

export const metadata = {
  title: 'EduPlatform - Cursos',
  description: 'Catalogo publico de cursos - Plataforma de Gestion de Cursos',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
