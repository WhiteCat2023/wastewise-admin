import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../config/firebase'

const REPORTS_COLLECTION = 'reports'

export const fetchReports = (callback) => {
  return onSnapshot(
    collection(db, REPORTS_COLLECTION),
    (snapshot) => {
      const reports = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      callback(reports)
    },
    (error) => {
      console.error('Error fetching reports:', error)
    }
  )
}

export const fetchReportsThisWeek = (callback) => {
  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay())
  startOfWeek.setHours(0, 0, 0, 0)

  const q = query(
    collection(db, REPORTS_COLLECTION),
    where('createdAt', '>=', Timestamp.fromDate(startOfWeek))
  )

  return onSnapshot(
    q,
    (snapshot) => {
      const reports = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      callback(reports)
    },
    (error) => {
      console.error('Error fetching this week reports:', error)
    }
  )
}
