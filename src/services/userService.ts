import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { db } from '../firebase/config';

export async function updateUserName(user: User, name: string) {
  await updateProfile(user, { displayName: name });
  await updateDoc(doc(db, 'users', user.uid), { name });
}
