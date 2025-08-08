# Configurar Firebase Storage para imágenes

Esta guía cubre cómo habilitar Storage, ajustar reglas, y adaptar el código para subir imágenes y vincularlas a cada propiedad.

## 1) Habilitar Storage en Firebase Console

1. Abrí Firebase Console > tu proyecto > Storage > Empezar.
2. Elegí el bucket por defecto (recomendado): `negociosinmobiliarios-paris.appspot.com`.
3. Confirmá la creación.

## 2) Reglas de seguridad

Recomendado para producción: lectura pública de imágenes y escritura sólo para administradores autenticados (requiere integrar Firebase Auth + custom claims `admin:true`).

Firestore (colección `propiedades`):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /propiedades/{id} {
      allow read: if true; // público
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

Storage:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true; // público
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

Desarrollo local: preferí usar Emuladores (`firebase emulators:start`) para no debilitar reglas en producción mientras desarrollás.

## 3) Conectar Storage en el código

En `src/firebase/firebaseConfig.js`:
- Asegurate de usar `storageBucket: "negociosinmobiliarios-paris.appspot.com"`.
- Exportá `storage`:
  - `import { getStorage } from "firebase/storage";`
  - `const storage = getStorage(app);`
  - `export { db, auth, storage };`

## 4) Servicio de subida

En `src/firebase/uploadService.js`:
- Subí archivos a la ruta `/<categoria>/<propertyId>/<archivo>`.
- Obtené las URLs con `getDownloadURL`.
- Guardá tanto URL como path interno para poder borrar luego en Storage.

La app guarda:
- `images: string[]` (URLs públicas)
- `imagesPaths: string[]` (rutas en Storage)

## 5) Flujo de creación (Admin)

1. Crear el documento en `propiedades` con datos básicos (images: []).
2. Subir imágenes al bucket mediante `uploadService`.
3. Actualizar el documento con `images` (URLs) y `imagesPaths`.

## 6) Edición y borrado

- Para agregar nuevas imágenes: subir y concatenar a `images`/`imagesPaths`.
- Para eliminar: quitar del array y (opcional) borrar del Storage usando `deleteObject(ref(storage, path))`.

## 7) Deploy

1. Revisá `firestore.rules` y `storage.rules`.
2. Opcional: `firebase emulators:start` para probar local.
3. `npm run build` y `firebase deploy` para publicar en Hosting.
