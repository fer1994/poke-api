<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>


# Ejecutar en desarrollo

1. Clonar el respositorio
2. Ejecutar

```
pnpm install
```

3. Tenes NEST CLI instalado 
``
https://nestjs.com/
``
4. Levantar la base de datos

```
docker-compose -d
````

5. Clonar el archivo ```.env.template``` y renombrar la copia a ```.env```

6. Llenar las variables de entorno definidas en el ```.env```

7. Ejecutar la aplicacion

8. Rellenar la BD

```
http://localhost:3000/api/v2/seed
```

## Stack
* MongoDB
* Nest