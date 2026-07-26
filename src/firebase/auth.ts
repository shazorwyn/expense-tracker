import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  sendPasswordResetEmail,
  type User,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './config';

export async function registerUser(name: string, email: string, password: string): Promise<User> {
  // Step 1: create the Auth account. If this throws, nothing was created — safe to
  // surface the error as-is (e.g. auth/email-already-in-use).
  const credential = await createUserWithEmailAndPassword(auth, email, password);

  // Steps 2 & 3 are "nice to have" — the account already exists at this point, so we
  // don't want a Firestore permission error (e.g. security rules not yet published)
  // to make registration look like it failed when the Auth user was actually created.
  // Instead we log a warning and let the caller proceed; the profile doc can be
  // backfilled later if needed.
  try {
    await updateProfile(credential.user, { displayName: name });
  } catch (err) {
    console.warn('Registered, but failed to set display name:', err);
  }

  try {
    await setDoc(doc(db, 'users', credential.user.uid), {
      uid: credential.user.uid,
      name,
      email,
    });
  } catch (err) {
    console.warn(
      'Registered, but failed to write the user profile document. ' +
        'Check that firestore.rules has been published in the Firebase Console.',
      err
    );
  }

  return credential.user;
}

export async function loginUser(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export function subscribeToAuthChanges(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}
