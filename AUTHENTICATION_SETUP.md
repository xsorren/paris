# Configuración de Autenticación para parispropiedadesinfo@gmail.com

## Resumen de Cambios Implementados

He configurado un sistema completo de autenticación para la cuenta `parispropiedadesinfo@gmail.com` que permite subir imágenes al Storage de Firebase.

## Archivos Modificados/Creados

### 1. Configuración de Firebase
- **`src/firebase/firebaseConfig.js`**: Agregado Firebase Storage
- **`storage.rules`**: Configuradas reglas de seguridad para Storage

### 2. Servicios de Autenticación
- **`src/firebase/authService.js`**: Servicio completo de autenticación con Google y email
- **`src/firebase/imageUploadService.js`**: Servicio para subir imágenes al Storage

### 3. Componentes
- **`src/components/Login.js`**: Actualizado con autenticación Google y email
- **`src/components/ImageUpload.js`**: Nuevo componente para subir imágenes
- **`src/firebase/AdminUpload.js`**: Integrado con subida de imágenes

## Características Implementadas

### 🔐 Autenticación
- **Autenticación con Google**: Login directo con cuenta de Google
- **Autenticación con Email**: Login tradicional con email y contraseña
- **Restricción de acceso**: Solo `parispropiedadesinfo@gmail.com` puede acceder
- **Validación automática**: Verificación del email autorizado

### 📷 Subida de Imágenes
- **Múltiples imágenes**: Hasta 10 imágenes por propiedad
- **Validación de archivos**: Solo JPG, PNG, WEBP (máximo 5MB cada una)
- **Vista previa**: Preview de imágenes antes de subir
- **Storage seguro**: Imágenes almacenadas en Firebase Storage con reglas de seguridad

### 🛡️ Seguridad
- **Reglas de Storage**: Solo usuarios autenticados pueden subir
- **Validación de email**: Solo el email específico tiene acceso
- **Limpieza de sesión**: Logout automático si no es el email autorizado

## Cómo Usar

### 1. Iniciar Sesión
1. Ve a `/login`
2. Usa una de estas opciones:
   - **Google**: Haz clic en "Ingresar con Google" y usa `parispropiedadesinfo@gmail.com`
   - **Email**: Usa `parispropiedadesinfo@gmail.com` y la contraseña correspondiente

### 2. Subir Propiedades con Imágenes
1. Ve a `/admin` (solo accesible con la cuenta autorizada)
2. Completa los datos de la propiedad
3. En la sección "Subir Imágenes":
   - Haz clic para seleccionar imágenes
   - Ve la vista previa
   - Haz clic en "Subir X imágenes"
4. Completa el formulario y haz clic en "Subir Propiedad"

## Configuración Adicional Necesaria

### 1. Habilitar Autenticación con Google en Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto `negociosinmobiliarios-paris`
3. Ve a "Authentication" > "Sign-in method"
4. Habilita "Google" como proveedor
5. Configura el email de soporte: `parispropiedadesinfo@gmail.com`

### 2. Configurar Usuario en Firebase Authentication
1. En Firebase Console, ve a "Authentication" > "Users"
2. Agrega manualmente el usuario `parispropiedadesinfo@gmail.com` si no existe
3. O usa el login con Google para crear el usuario automáticamente

### 3. Desplegar Reglas de Storage
```bash
firebase deploy --only storage
```

## Estructura de Storage

Las imágenes se almacenan organizadas por tipo de propiedad y operación:
```
/images/
  ├── casas/
  │   ├── venta/
  │   │   ├── prop_[timestamp]_[random]_[filename].jpg
  │   │   └── prop_[timestamp]_[random]_[filename].png
  │   └── alquiler/
  │       ├── prop_[timestamp]_[random]_[filename].jpg
  │       └── prop_[timestamp]_[random]_[filename].png
  ├── departamentos/
  │   ├── venta/
  │   │   ├── prop_[timestamp]_[random]_[filename].jpg
  │   │   └── prop_[timestamp]_[random]_[filename].png
  │   └── alquiler/
  │       ├── prop_[timestamp]_[random]_[filename].jpg
  │       └── prop_[timestamp]_[random]_[filename].png
  ├── lotes/
  │   ├── venta/
  │   │   ├── prop_[timestamp]_[random]_[filename].jpg
  │   │   └── prop_[timestamp]_[random]_[filename].png
  │   └── alquiler/
  │       ├── prop_[timestamp]_[random]_[filename].jpg
  │       └── prop_[timestamp]_[random]_[filename].png
  ├── locales/
  │   ├── venta/
  │   │   ├── prop_[timestamp]_[random]_[filename].jpg
  │   │   └── prop_[timestamp]_[random]_[filename].png
  │   └── alquiler/
  │       ├── prop_[timestamp]_[random]_[filename].jpg
  │       └── prop_[timestamp]_[random]_[filename].png
  └── otros/
      ├── venta/
      │   ├── prop_[timestamp]_[random]_[filename].jpg
      │   └── prop_[timestamp]_[random]_[filename].png
      └── alquiler/
          ├── prop_[timestamp]_[random]_[filename].jpg
          └── prop_[timestamp]_[random]_[filename].png
```

## Reglas de Seguridad

```javascript
// storage.rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Lectura pública de imágenes
    match /images/{allPaths=**} {
      allow read: if true;
    }
    
    // Escritura solo para usuarios autenticados
    match /images/{allPaths=**} {
      allow write: if request.auth != null;
    }
    
    // Reglas específicas para carpetas organizadas por tipo de propiedad
    match /images/casas/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /images/departamentos/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /images/lotes/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /images/locales/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /images/otros/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Solución de Problemas

### Error: "Solo el email parispropiedadesinfo@gmail.com está autorizado"
- Verifica que estés usando exactamente `parispropiedadesinfo@gmail.com`
- Asegúrate de que el usuario esté creado en Firebase Authentication

### Error: "Error al subir imagen"
- Verifica que las reglas de Storage estén desplegadas
- Asegúrate de que el usuario esté autenticado
- Verifica que el archivo sea una imagen válida (JPG, PNG, WEBP)

### Error: "Error al iniciar sesión con Google"
- Verifica que Google esté habilitado en Firebase Console
- Asegúrate de que el dominio esté autorizado

## Próximos Pasos

1. **Desplegar las reglas**: `firebase deploy --only storage`
2. **Probar la autenticación**: Iniciar sesión con `parispropiedadesinfo@gmail.com`
3. **Probar subida de imágenes**: Subir una propiedad con imágenes
4. **Verificar en Firebase Console**: Confirmar que las imágenes aparecen en Storage

¡El sistema está listo para usar! 🚀
