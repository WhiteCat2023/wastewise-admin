import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from '../config/firebase'

const scheduleCollection = collection(db, 'schedules')

export const fetchSchedules = (callback) => {
  const q = query(scheduleCollection, orderBy('pickupDate', 'desc'))
  return onSnapshot(q, (snapshot) => {
    const schedulesList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    callback(schedulesList)
  })
}

export const createSchedule = async (scheduleData) => {
  try {
    const docRef = await addDoc(scheduleCollection, {
      ...scheduleData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return docRef.id
  } catch (error) {
    throw error
  }
}

export const updateSchedule = async (scheduleId, scheduleData) => {
  try {
    const scheduleRef = doc(db, 'schedules', scheduleId)
    await updateDoc(scheduleRef, {
      ...scheduleData,
      updatedAt: new Date(),
    })
  } catch (error) {
    throw error
  }
}

export const deleteSchedule = async (scheduleId) => {
  try {
    const scheduleRef = doc(db, 'schedules', scheduleId)
    await deleteDoc(scheduleRef)
  } catch (error) {
    throw error
  }
}
