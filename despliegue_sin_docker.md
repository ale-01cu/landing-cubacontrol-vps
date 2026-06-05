# Guía de Despliegue Bare-Metal (Sin Docker) para CubaControl

Esta guía describe cómo desplegar el sistema completo directamente en un VPS Debian sin utilizar Docker, utilizando **Systemd** para mantener PocketBase corriendo en segundo plano, **PM2** para gestionar la Landing de Nuxt, y **Nginx** como Proxy Inverso con SSL gratuito de **Certbot**.

---

## Arquitectura de Red en el Servidor
```
               [ Usuario (Puerto 80/443) ]
                           │
                           ▼
                    [ Nginx Proxy ]
                     ├── / ───────► [ Nuxt App ] (PM2 - Puerto 3000)
                     └── /api/ ───► [ PocketBase ] (Systemd - Puerto 8090)
```

---

## Paso 1: Instalar dependencias en Debian VPS

Conéctate a tu VPS por SSH y ejecuta los siguientes comandos para preparar el sistema:

```bash
# 1. Actualizar repositorios y paquetes del sistema
sudo apt update && sudo apt upgrade -y

# 2. Instalar herramientas básicas auxiliares
sudo apt install -y curl unzip ufw nginx

# 3. Configurar el repositorio oficial de Node.js (Versión 20 LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 4. Instalar pnpm (gestor de paquetes) y PM2 (gestor de procesos) globalmente
sudo npm install -g pnpm pm2
```

---

## Paso 2: Desplegar PocketBase (Backend)

Dado que estás en Linux, no puedes usar el ejecutable `.exe` de Windows. Descargaremos el binario nativo de Linux x64.

### 1. Descargar y preparar PocketBase en el VPS
```bash
# Crear el directorio del backend
mkdir -p ~/cubacontrol/backend
cd ~/cubacontrol/backend

# Descargar la última versión estable (ejemplo con v0.22.20, ajusta si es necesario)
curl -L -o pocketbase.zip https://github.com/pocketbase/pocketbase/releases/download/v0.22.20/pocketbase_0.22.20_linux_amd64.zip

# Descomprimir y borrar el archivo temporal
unzip pocketbase.zip
rm pocketbase.zip
chmod +x pocketbase
```

### 2. Subir tus migraciones locales al VPS
Desde la terminal de tu **PC local** (no en el VPS), sube tu carpeta de migraciones mediante `scp`:
```bash
scp -r pb_migrations usuario@IP_DE_TU_VPS:~/cubacontrol/backend/
```

### 3. Crear el servicio de Systemd
Para que PocketBase se ejecute en segundo plano de forma ininterrumpida, crea un servicio del sistema:
```bash
sudo nano /etc/systemd/system/pocketbase.service
```

Pega el siguiente contenido (reemplaza `tu_usuario` por tu usuario real del VPS):
```ini
[Unit]
Description=PocketBase Service
After=network.target

[Service]
Type=simple
User=tu_usuario
WorkingDirectory=/home/tu_usuario/cubacontrol/backend
ExecStart=/home/tu_usuario/cubacontrol/backend/pocketbase serve --http="127.0.0.1:8090"
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```
*Guarda con `Ctrl+O`, confirma con `Enter` y sal con `Ctrl+X`.*

### 4. Activar e iniciar PocketBase
```bash
# Recargar configuraciones de servicios
sudo systemctl daemon-reload

# Habilitar para que inicie con el sistema y arrancar el proceso
sudo systemctl enable pocketbase
sudo systemctl start pocketbase

# Verificar estado
sudo systemctl status pocketbase
```

---

## Paso 3: Desplegar la Landing (Nuxt)

> [!IMPORTANT]
> **BUENA PRÁCTICA:** Nunca compiles Nuxt directamente en un VPS de bajos recursos (ej. 1GB RAM) porque el proceso de compilación de Vite consume mucha memoria y puede congelar el servidor. Compila localmente en tu PC y sube únicamente la carpeta `.output`.

### 1. Compilar localmente en tu PC
En la raíz de la carpeta `landing-cubacontrol` en tu computadora:
```bash
pnpm run build
```
Esto generará la carpeta comprimida de producción `.output/`.

### 2. Comprimir y subir al VPS
Desde la terminal de tu **PC local**:
```bash
# Comprimir la carpeta generada
tar -czf output.tar.gz .output

# Subirla al servidor
scp output.tar.gz usuario@IP_DE_TU_VPS:~/cubacontrol/
```

### 3. Descomprimir y levantar en el VPS con PM2
De vuelta en la consola de tu **VPS**:
```bash
cd ~/cubacontrol

# Extraer el contenido
tar -xzf output.tar.gz
rm output.tar.gz

# Iniciar la aplicación con PM2 en el puerto 3000
pm2 start .output/server/index.mjs --name "cubacontrol-landing" --env PORT=3000

# Configurar persistencia al reiniciar el VPS
pm2 startup
# (Copia y ejecuta el comando de sudo que te imprima la terminal en este punto)
pm2 save
```

---

## Paso 4: Configurar Nginx (Proxy Inverso)

Nginx escuchará en el puerto público de tu VPS y se encargará de derivar las peticiones a la Landing o a PocketBase según la ruta.

### 1. Crear el bloque del sitio
```bash
sudo nano /etc/nginx/sites-available/cubacontrol
```

Pega la siguiente plantilla (reemplaza `tu_dominio.com` por tu dominio o IP pública):
```nginx
server {
    listen 80;
    server_name tu_dominio.com www.tu_dominio.com;

    # API de Backend - PocketBase
    location /api/ {
        proxy_pass http://127.0.0.1:8090/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Habilitar soporte WebSockets (Suscripciones Realtime de PocketBase)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Frontend - Aplicación Nuxt
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 2. Activar y reiniciar Nginx
```bash
# Crear enlace simbólico para activarlo
sudo ln -s /etc/nginx/sites-available/cubacontrol /etc/nginx/sites-enabled/

# Quitar la configuración por defecto de Nginx si existe
sudo rm -f /etc/nginx/sites-enabled/default

# Validar sintaxis
sudo nginx -t

# Reiniciar servicio
sudo systemctl restart nginx
```

---

## Paso 5: Seguridad y Certificado SSL (HTTPS)

### 1. Configurar Firewall básico (UFW)
Asegura tu servidor permitiendo solo el tráfico web y SSH:
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

### 2. Generar certificado SSL gratuito con Let's Encrypt
```bash
sudo apt install -y python3-certbot-nginx
sudo certbot --nginx -d tu_dominio.com -d www.tu_dominio.com
```
Sigue el asistente en consola (ingresa tu email y acepta los términos). Certbot modificará automáticamente tu archivo de configuración de Nginx para redirigir todo el tráfico HTTP a HTTPS de forma 100% segura.

---
*¡Listo! Tu sistema ya estará online corriendo Bare-Metal de forma eficiente y segura.*
