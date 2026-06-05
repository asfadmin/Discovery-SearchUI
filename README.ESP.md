# SearchUI
[![en](https://img.shields.io/badge/lang-en-red.svg)](./README.md)
[![
CodeFactor](https://www.codefactor.io/repository/github/asfadmin/discovery-searchui/badge?s=fe1df8c7275093962e0c42abffa97803a397c825)](https://www.codefactor.io/repository/github/asfadmin/discovery-searchui) 

[![Únase al chat en https://gitter.im/ASFDiscovery/Vertex](https://badges.gitter.im/ASFDiscovery/Vertex.svg)](https://gitter.im/ASFDiscovery/Vertex?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Aplicación web de búsqueda de ASF desarrollada en Angular

## Implementaciones
| Madurez | Despliegue |
| --- | --- |
| Devel | https://search-dev.asf.alaska.edu/ |
| Test | https://search-test.asf.alaska.edu/ |
| Prod | https://search.asf.alaska.edu/ |

### Despliegue Personal (deployment.py)

- Para ejecutar, instale la AWS CLI ([docs](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html))
- Luego cree credenciales de identificación para la cuenta Discovery-NonProd ([docs](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey))
- Configure las credenciales localmente usando `aws configure`, establezca la región predeterminada en `us-east-1` y el formato de salida en `json`, y use las credenciales generadas previamente.

**Ejemplo:**
```
 python deployment.py will --branch devel
```

## Inicializar después de descargar
Después de descargar por primera vez el repositorio, configure su instancia ejecutando `npm install` desde el directorio raíz del proyecto. Si no tiene npm instalado, vaya [aquí](https://www.npmjs.com/get-npm) para obtener instrucciones de instalación.

## Servidor de desarrollo

La aplicación se ejecuta localmente usando Angular CLI. Las instrucciones de instalación se pueden encontrar [aquí](https://angular.io/cli).

Después de instalar Angular, ejecute `ng serve` para iniciar un servidor de desarrollo. Navegue a `http://localhost:4200/`. La aplicación se recargará automáticamente si cambia alguno de los archivos fuente.  También puede proporcionar un número de puerto opcional, por ejemplo `ng serve --port 4444`.

### Dominio personalizado

Para que ciertos servicios funcionen, es necesario configurar un dominio `.asf.alaska.edu` que apunte a su servidor local en su archivo hosts. Este proceso varía según el sistema operativo que esté utilizando.

Agregue la siguiente línea utilizando uno de los métodos descritos a continuación para que `local.asf.alaska.edu` apunte a su servidor de desarrollo local:
```
127.0.0.1   local.asf.alaska.edu
```
| OS | Method |
| --- | --- |
| Mac/Linux | modify the /etc/hosts file |
| Windows | Modify c:\windows\system32\drivers\etc\hosts as Administrator |
```
ng serve --port 4444 --host local.asf.alaska.edu
ng serve --port 4445 --ssl true --host local.asf.alaska.edu
```

### Configuración de HTTPS
Algunos servicios de Vertex requieren HTTPS para funcionar. Angular admite la ejecución con SSL, aunque algunos navegadores pueden no aceptar certificados autofirmados y bloquear el acceso a la página a través de HTTPS. Para evitar este problema, [mkcert](https://github.com/FiloSottile/mkcert) puede actuar como Autoridad Certificadora para verificar los certificados que genera.
1. Siga las instrucciones para instalar mkcert en su [README](https://github.com/FiloSottile/mkcert#installation).
3. Ejecute `mkcert -install` (puede requerir permisos de administrador).
4. Para generar los certificados que usará Angular, ejecute `mkcert local.asf.alaska.edu`. Si desea especificar la ubicación donde generar los certificados (**recomendado**), puede usar los parámetros `-cert-file` y `-key-file`, por ejemplo: `mkcert -cert-file ~/mkcert/cert.pem -key-file ~/mkcert/key.pem local.asf.alaska.edu`
5. Ejecute Angular con las siguientes banderas para indicar que use SSL y dónde están la clave y el certificado:
```
ng serve --host=local.asf.alaska.edu --ssl true --ssl-cert ~/mkcert/cert.pem --ssl-key ~/mkcert/key.pem 
```


## Generar código (Code scaffolding)

Ejecute `ng generate component nombre-del-componente` para generar un nuevo componente. También puede usar `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Instalar paquetes NPM
Ejecute `npm install --save nombre_del_paquete` para instalar un paquete.

## Compilar

Ejecute `ng build` para compilar el proyecto. Los artefactos de compilación se almacenarán en el directorio `dist/`. Use la bandera `--prod` para una compilación de producción.

## Traducción de textos
El paquete [ngx-translate](http://www.ngx-translate.com/) se utiliza para habilitar el soporte multilingüe.  
Cualquier texto visible para el usuario en la interfaz (exceptuando posiblemente valores de metadatos y nombres de marca) debe mostrarse usando un *translate pipe*.

Aquí hay un ejemplo:
```
<button
  [matMenuTriggerFor]="helpMenu"
  matTooltip="{{ 'HELP_AND_INFORMATION' | translate }}"
  class="spacing nav-icon-buttons" color="basic" mat-button>
  <mat-icon class="large-icon">help_outline</mat-icon>
  <div class="text-under faint-text">{{ 'HELP' | translate }}</div>
</button>
```
Puede ver que tanto el texto en el *tooltip* como el texto del botón pasan por el *translate pipe*: `{{ 'HELP_AND_INFORMATION' | translate }}`.
El *translate pipe* traducirá la clave, por ejemplo `'HELP_AND_INFORMATION'`, y la reemplazará con el valor correspondiente del archivo JSON del idioma actual en uso, por ejemplo `assets/i18n/en.json`.  
Agregue pares clave/valor a los archivos JSON utilizando [BabelEdit](https://www.codeandweb.com/babeledit).

El archivo `assets/i18n/vertex.babel` es el archivo de proyecto que debe abrir con BabelEdit para acceder a todos los archivos JSON de traducción.  
Use BabelEdit para agregar, cambiar y eliminar pares clave/valor.

## Pruebas

Las pruebas se ejecutan mediante [Ghost Inspector](https://ghostinspector.com/).

## Ayuda adicional

Para obtener más ayuda sobre Angular CLI, use `ng help` o consulte el [README de Angular CLI](https://github.com/angular/angular-cli/blob/master/README.md).

Más información sobre la aplicación está disponible en el [wiki](https://github.com/asfadmin/SearchUI/wiki).

Este proyecto fue generado con [Angular CLI](https://github.com/angular/angular-cli) versión 6.2.4.
