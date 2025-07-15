import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, collection } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

export const registerUser = async (email, password, userData) => {
  try {
    // Create authentication account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user profile document
    await setDoc(doc(db, 'users', user.uid), {
      email: email,
      name: userData.name,
      dateOfBirth: userData.dateOfBirth,
      location: userData.location,
      profileImageUrl: userData.profileImageUrl || null,
      createdAt: new Date().toISOString(),
    });

    // Add default connections subcollection
    const connections = [
      { id: "1", name: "Alice Johnson", compatibility: 85, img: "https://randomuser.me/api/portraits/women/1.jpg" },
      { id: "2", name: "Michael Smith", compatibility: 72, img: "https://randomuser.me/api/portraits/men/2.jpg" },
      { id: "3", name: "Sophia Martinez", compatibility: 50, img: "https://randomuser.me/api/portraits/women/3.jpg" },
      { id: "mSkhXidLxpW7QZFJgkERDSI8N8m2", name: "Marco Polo", compatibility: 100, img: "https://randomuser.me/api/portraits/men/1.jpg" },
      { id: "s1K8XeLj4PUXWLEEb5WLwGFtkx73", name: "Marco Berk Monfiglio", compatibility: 100, img: "https://randomuser.me/api/portraits/men/3.jpg" },
    ];
    for (const conn of connections) {
      await setDoc(doc(db, 'users', user.uid, 'connections', conn.id), conn);
    }

    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log('Sign out successful');
    return { success: true };
  } catch (error) {
    console.log('Error during sign out', error.message);
    return { success: false, error: error.message };
  }
};
