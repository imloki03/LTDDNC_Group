import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: 'AIzaSyDgtLKEiwZj2YBOLqETuB1rwnGP_Sqnbls',
    authDomain: 'projectctandroid.firebaseapp.com',
    projectId: 'projectctandroid',
    storageBucket: 'projectctandroid.appspot.com',
    messagingSenderId: '1079334863903',
    appId: '1:1079334863903:android:d400c83e24e8846a7d012a'
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
