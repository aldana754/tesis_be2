# 🚀 Guía de Deploy en Railway - Paso a Paso

## 📋 Pre-requisitos

✅ Cuenta de GitHub con el proyecto subido
✅ Cuenta en [Railway](https://railway.app) (gratis)
✅ El proyecto compilado localmente sin errores

## 🚀 Pasos para Deployment

### 1. **Preparar el Repositorio en GitHub**

```bash
# Si no tienes Git inicializado
git init
git add .
git commit -m "Initial commit - Ready for Railway deployment"

# Conectar con GitHub (reemplaza con tu repo)
git remote add origin https://github.com/tu-usuario/tu-repo.git
git branch -M main
git push -u origin main
```

### 2. **Crear Proyecto en Railway**

1. Ve a [railway.app](https://railway.app)
2. Haz clic en **"Start a New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Autoriza Railway para acceder a tus repos
5. Selecciona tu repositorio del backend

### 3. **Agregar Base de Datos PostgreSQL**

1. En tu proyecto Railway, haz clic en **"New"**
2. Selecciona **"Database"**
3. Elige **"PostgreSQL"**
4. Railway configurará automáticamente las variables de conexión

### 4. **Configurar Variables de Entorno**

Ve a la pestaña **"Variables"** de tu servicio y agrega:

```bash
# OBLIGATORIO - JWT Secret
JWT_SECRET=tu_jwt_secret_super_largo_y_seguro_para_produccion_123456789

# OBLIGATORIO - Environment
NODE_ENV=production

# OPCIONAL - Puerto (Railway lo asigna automáticamente)
PORT=3000

# OPCIONAL - CORS para tu frontend
CORS_ORIGIN=https://tu-frontend.vercel.app
```

### 5. **Verificar el Deploy**

1. Railway detectará automáticamente `package.json`
2. Ejecutará `npm ci` y `npm run build`
3. Iniciará con `npm start`
4. En 2-3 minutos tendrás tu URL de deploy

### 6. **Poblar la Base de Datos**

Una vez desplegado, ejecuta el seeding:

**Opción A - Desde Railway CLI:**
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Conectar al proyecto
railway link

# Ejecutar seeding
railway run npm run seed
```

**Opción B - Desde el proyecto local:**
```bash
# Configurar DATABASE_URL de Railway en .env
DATABASE_URL=postgresql://usuario:password@host:puerto/database

# Ejecutar seeding local apuntando a Railway
npm run seed
```

## 🔍 URLs y Testing

### URLs de tu API:
- **Base:** `https://tu-proyecto-railway.up.railway.app`
- **Health:** `https://tu-proyecto-railway.up.railway.app/health`
- **API:** `https://tu-proyecto-railway.up.railway.app/api`

### Testing con Postman:
1. Importa `POSTMAN_COLLECTION_COMPLETE.json`
2. Cambia `baseUrl` a tu URL de Railway
3. Ejecuta **"Login with Seeded User"**
4. Prueba **"Add Multiple Preferences"**

## 🚨 Troubleshooting

### ❌ **Build Fails**
```bash
# Verifica localmente
npm run build

# Revisa logs en Railway → Deployments → View Logs
```

### ❌ **Database Connection Error**
- Verifica que PostgreSQL esté añadido al proyecto
- Las variables `PGHOST`, `PGUSER`, etc. se configuran automáticamente

### ❌ **JWT Errors**
- Asegúrate de configurar `JWT_SECRET` en Variables
- Debe ser un string largo y seguro

### ❌ **CORS Errors**
- Configura `CORS_ORIGIN` con la URL de tu frontend
- O usa `*` para desarrollo

### ❌ **502/503 Errors**
- Verifica que `PORT` esté configurado correctamente
- Railway asigna un puerto dinámico, el código ya lo maneja

## 📊 Monitoreo

### Ver Logs:
1. Railway Dashboard → Tu Proyecto
2. Clic en el servicio backend
3. **"Deployments"** → **"View Logs"**

### Métricas:
- Railway proporciona métricas de CPU/RAM automáticamente
- Accesibles desde el dashboard

## 🎯 Próximos Pasos

1. **Frontend:** Desplegar en Vercel/Netlify
2. **Domain:** Configurar dominio personalizado
3. **CI/CD:** Railway hace deploy automático en cada push
4. **Scaling:** Railway escala automáticamente según uso

## ✅ Checklist Final

- [ ] Repositorio en GitHub
- [ ] Proyecto Railway creado
- [ ] PostgreSQL agregado
- [ ] `JWT_SECRET` configurado
- [ ] `NODE_ENV=production` configurado
- [ ] Deploy exitoso (check `/health`)
- [ ] Base de datos poblada (seeding)
- [ ] API funcionando (test con Postman)
- [ ] CORS configurado para frontend

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Railway
2. Verifica las variables de entorno
3. Prueba localmente con `npm run build && npm start`
4. Railway tiene documentación excelente: [docs.railway.app](https://docs.railway.app)
