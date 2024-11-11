
## Instalación local

Antes de iniciar,

Los archivos ```.env``` y ```.test.env``` fueron enviados separados, agregarlos manualmente al proyecto para su correcto funcionamiento

**El servidor usa el puerto 3000 para iniciar, asegurarse tenerlo libre o cambiarlo en el archivo ```.env```**


Para inicializar el proyecto de forma local, ejecutar

```bash
  npm install
```

Se debe traspilar de typescript a javascript, utilizaremos el siguiente comando

```bash
  tsc -w
```

Una vez instalado y traspilado, para inicializar el servidor ejecutaremos en una terminal nueva. 

```bash
  npm run dev
```


El proyecto tiene una fuerte dependencia en entorno de desarrollo de typescript y nodemon que viene dentro de las dependencias del ```package.json``` en caso de no ser reconocido se deberá instalar de forma global

```bash
  npm install -g nodemon typescript
```

Para correr la suite de pruebas utilizaremos
```bash
  npm run test
```
**Algunos casos en la suite de pruebas pueden fallar, es normal, esto debido a la prueba de endpoints por ejemplo de eliminar un usuario este viene "hardcodeado" y no lo encontrará en la base de datos, para corregirlo asignar el ID de un usuario que si exista.**

## Instalación por Docker

### Contenedor de la app
Una vez descargado el proyecto e instalado Docker, ejecutar

```
 docker build -t mi-app-node .
```
Esto creará una imagen de Docker que podrá ser utilizada en un contenedor. Para correr el contenedor ejecutar

```
 docker run -d -p 3000:3000 app-node
```
Asegurarse que el puerto 3000 del equipo local esté libre

### Contenedor y migración de base de datos

Se deberá instalar una imagen y crear un contenedor para SQL Server, seguir este turorial canónico [Aquí](https://learn.microsoft.com/es-es/sql/linux/quickstart-install-connect-docker?view=sql-server-ver16&tabs=cli&pivots=cs1-bash)

La migración de la base de datos se puede consultar en la siguiente [referencia](https://learn.microsoft.com/en-us/sql/linux/tutorial-restore-backup-in-sql-server-container?view=sql-server-ver16&tabs=cli)

Hay dos formas de migrar la base de datos

1. 
- Dentro del repositorio hay una base de datos llamada ```backup-database```. Ejecutaremos el siguiente comando (Se debe abrir la terminal en la carpeta del proyecto)
```
    docker cp backup-database sql1:/var/opt/mssql/backup/my-backup.bak
```
- Una vez copiado el backup ejecutar
```
docker exec -it sql1 opt/mssql-tools18/bin/sqlcmd -No -S localhost -U sa -P '<Your password>' -Q 'RESTORE FILELISTONLY FROM DISK = "/var/opt/mssql/my-backup.bak"'
docker exec -it sql1 opt/mssql-tools18/bin/sqlcmd -No -S localhost -U sa -P '<Your password>' -Q 'RESTORE DATABASE macropay FROM DISK = "/var/opt/mssql/backup/my-backup.bak" WITH MOVE "macropay" TO "/var/opt/mssql/data/macropay.mdf", MOVE "macropay_log.ldf" TO "/var/opt/mssql/data/macropay_log.ldf"'
```
2.
- Ejecutar las sentencias por separado para crearlas directo en la base de datos
```
docker exec -it sql1 opt/mssql-tools18/bin/sqlcmd -No -S localhost -U sa -P 'Password1!' -Q 'CREATE DATABASE macropay;'
docker exec -it sql1 opt/mssql-tools18/bin/sqlcmd -No -S localhost -U sa -P 'Password1!' -Q 'USE macropay; CREATE TABLE Users(id int IDENTITY(1,1) PRIMARY KEY, name nvarchar(200) NOT NULL UNIQUE, last_name nvarchar(200) NOT NULL UNIQUE, pass nvarchar(100) NOT NULL, email nvarchar(50) NOT NULL UNIQUE, createdAt datetime2(7), updatedAt datetime2(7));'
docker exec -it sql1 opt/mssql-tools18/bin/sqlcmd -No -S localhost -U sa -P 'Password1!' -Q 'USE macropay; SELECT * FROM Users';
```