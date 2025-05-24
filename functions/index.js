// src/index.js o src/App.js
import firebaseApp from './firebase-config';
// si querés usar Firestore o Auth:
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

// Ahora podés usar `db` o `auth` en tu app
