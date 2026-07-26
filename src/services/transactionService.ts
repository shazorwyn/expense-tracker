import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { NewTransaction, Transaction } from '../types';

const COLLECTION = 'transactions';

export function subscribeToTransactions(
  userId: string,
  callback: (transactions: Transaction[]) => void,
  onError?: (error: Error) => void
) {
  const q = query(collection(db, COLLECTION), where('userId', '==', userId), orderBy('date', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const transactions = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Transaction);
      callback(transactions);
    },
    (error) => onError?.(error)
  );
}

export async function addTransaction(userId: string, transaction: NewTransaction) {
  await addDoc(collection(db, COLLECTION), {
    ...transaction,
    userId,
    createdAt: Date.now(),
  });
}

export async function updateTransaction(id: string, updates: Partial<NewTransaction>) {
  await updateDoc(doc(db, COLLECTION, id), updates);
}

export async function deleteTransaction(id: string) {
  await deleteDoc(doc(db, COLLECTION, id));
}
