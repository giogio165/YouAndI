import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyAKe0jqV4mReNFmWe2tEPeOULyypxivdk4',
  authDomain: 'youandi-ca656.firebaseapp.com',
  databaseURL:
    'https://youandi-ca656-default-rtdb.asia-southeast1.firebasedatabase.app/',
  projectId: 'youandi-ca656',
  storageBucket: 'youandi-ca656.appspot.com',
  messagingSenderId: '468555731083',
  appId: '1:468555731083:web:2b9bfa6504a8c65d06c48e',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const database = getDatabase(app)

export { auth, database }

export default app
