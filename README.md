# ExamenParcial
Aquí tienes un ejemplo de un archivo `README.md` simple y resumido para tu proyecto en GitHub, con las instrucciones para construir y ejecutar la imagen Docker:

```markdown
# Mi Proyecto

Este es un proyecto basado en Node.js (Next.js) que utiliza Docker para su despliegue.

## Requisitos
- Docker instalado en tu sistema.

## Instrucciones

### 1. Construir la Imagen Docker
Construye la imagen Docker desde el `Dockerfile` en el directorio actual:
```bash
docker build -t my-app:latest .
```

### 2. Ejecutar el Contenedor
Inicia un contenedor a partir de la imagen construida, exponiendo el puerto 3000:
```bash
docker run -d -p 3000:3000 my-app:latest
```

### 3. Acceder a la Aplicación
Abre tu navegador y visita:
```
http://localhost:3000
```
