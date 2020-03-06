import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import { FirebaseConfig } from "../Schema/firebase";
import store from '../Redux/store';
import { login, logout } from '../Redux/Actions/AuthActions';

class FirebaseWrapper {
    private _app: any;
    private readonly CONFIG: FirebaseConfig = {
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY as string,
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN as string,
        databaseURL: process.env.REACT_APP_FIREBASE_DB_URL as string,
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID as string,
        storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET as string,
        messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID as string,
        appId: process.env.REACT_APP_FIREBASE_APP_ID as string,
        measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID as string
    };

    constructor() {
        this.init().then(() => { });
    }

    public async init() {
        if (this._app) {
            throw new Error('App is already initialized!');
        }

        this._app = firebase.initializeApp(this.CONFIG);
        await firebase.auth().signOut();
        firebase.auth()
            .onAuthStateChanged((user: firebase.User | null) => {
                if (user) {
                    store.dispatch(login({ ...user }))
                } else {
                    store.dispatch(logout());
                }
            });
    }

    public loginUser(email: string, password: string): Promise<firebase.auth.UserCredential> {
        return firebase.auth().signInWithEmailAndPassword(email, password);
    }

    get storage() {
        return firebase.storage().ref();
    }
}

export const firebaseWrapper: FirebaseWrapper = new FirebaseWrapper();
