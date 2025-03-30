# To-Do List App

## Descripción del proyecto
**To-Do List App** es una aplicación de gestión de tareas diseñada para ayudarte a organizar tus actividades diarias de manera eficiente. Este proyecto consta de un frontend desarrollado en React con Tailwind CSS para una interfaz moderna y responsiva, y un backend en Laravel que proporciona una API robusta para gestionar las tareas. La aplicación permite crear, editar, completar y eliminar tareas, con funcionalidades como búsqueda, ordenamiento y agrupación por fechas límite (Hoy, Mañana, Esta semana, Más adelante).

---

## Requisitos del sistema

### Backend (Laravel)
#### Software necesario
1. **PHP** (versión >= 8.0) con las siguientes extensiones:
   - `php-bcmath`
   - `php-ctype`
   - `php-fileinfo`
   - `php-json`
   - `php-mbstring`
   - `php-openssl`
   - `php-pdo`
   - `php-tokenizer`
   - `php-xml`
   - `php-pdo_mysql`
2. **Composer** (versión >= 2.0) - Gestor de dependencias de PHP.
3. **MySQL** (versión >= 5.7) - Base de datos.
4. **Git** - Para clonar el repositorio.
5. **XAMPP** - Para ejecutar MySQL y PHP localmente (opcional, pero recomendado).

### Frontend (React)
#### Software necesario
1. **Node.js** (versión LTS recomendada, como 18.x o 20.x) - Incluye npm.
2. **Git** - Para clonar el repositorio.

---

## Instrucciones para instalar y correr el proyecto

### 1. Clonar el repositorio
Clona el repositorio desde GitHub:

`git clone https://github.com/Nancy-Ramirez/to_do_list_app.git`
`cd to_do_list_app `

### 2. Configurar y ejecutar el backend

#### Navega al directorio del backend:
`cd todo-list-app`

#### Instala las dependencias de PHP con Composer:
`composer install`

#### Copia el archivo de entorno:
`cp .env.example .env`

#### Inicia XAMPP:
Asegurate de que los módulos de Apache y MySQL estén corriendo.

#### Configura la base de datos en .env:
- Abre `phpMyAdmin` (normalmente en http://localhost/phpmyadmin).
- Crea una base de datos llamada todo_list.
- Edita .env con los detalles de tu base de datos.
  `DB_CONNECTION=mysql`
  `DB_HOST=127.0.0.1`
  `DB_PORT=3306`
  `DB_DATABASE=todo_list`
  `DB_USERNAME=root`
  `DB_PASSWORD=`
Ajusta DB_USERNAME y DB_PASSWORD según tu configuración de MySQL).

#### Genera la clave de la aplicación:
`php artisan key:generate`

#### Ejecuta las migraciones:
`php artisan migrate`

#### Inicia el servidor del backend:
`php artisan serve`
El backend estará disponible en http://localhost:8000 por defecto

### 3. Configurar y ejecutar el frontend

#### 1. Asegurate de tener Node.js instalado:
- Descarga e instala desde nodejs.org si aún no lo tienes.
- Verifica en el cmd con: 
  `node -v`
  `npm -v`
  
#### 2. Navega al directorio frontend
`cd todo-list-frontend`

#### 3. Instala las dependencias del frontend
`npm install`

#### 4. Inicia el frontend
`npm start`
El frontend se ejecutará en http'://localhost:3000 por defecto y se conectará al backend en http://localhost:8000
