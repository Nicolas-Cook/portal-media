# Portal Películas y Series

Portal de películas y series haciendo uso the la API de TMDB para mostrar películas, series y guardar favoritas.

# Setup

## Backend

1. **PostgreSQL**: Versión 17.0
2. **Ejecutar scripts SQL para creación de la base de datos y tablas**: Navegar a carpeta `backend` y ejecutar `psql -U {usuario} -f database_setup.sql` (archivo en carpeta backend)
3. **Instalar dependencias**: Desde la carpeta `backend`, ejecutar `npm install`
4. **Configuración**: Ingresar API Key (obtenida desde https://www.themoviedb.org/settings/api) en archivo **.env** (en carpeta backend) y cambiar credenciales para base de datos según sea necesario
5. **Iniciar el backend**: Desde la carpeta `backend`, ejecutar `npm start`

## Frontend
1. **Instalar dependencias**: Navegar a carpeta `frontend` y ejecutar `npm install`
2. **Iniciar el frontend**: Desde la carpeta `frontend`, ejecutar `npm run dev`

## License

This project is licensed under the MIT License.