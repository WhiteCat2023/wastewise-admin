import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../config/firebase'

const DRIVERS_COLLECTION = 'drivers'

export const createDriver = async ({
  name,
  email,
  phone,
  vehicleNumber,
  licenseNumber,
  status,
}) => {
  if (!name || !email || !phone || !vehicleNumber || !licenseNumber) {
    throw new Error('All fields are required.')
  }

  const payload = {
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    vehicleNumber: vehicleNumber.trim(),
    licenseNumber: licenseNumber.trim(),
    status: status || 'active',
    createdAt: serverTimestamp(),
  }

  const docRef = await addDoc(collection(db, DRIVERS_COLLECTION), payload)
  return { id: docRef.id, ...payload }
}

export const fetchDrivers = (callback) => {
  return onSnapshot(
    collection(db, DRIVERS_COLLECTION),
    (snapshot) => {
      const drivers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      callback(drivers)
    },
    (error) => {
      console.error('Error fetching drivers:', error)
    }
  )
}

export const updateDriver = async (
  id,
  { name, email, phone, vehicleNumber, licenseNumber, status }
) => {
  if (!name || !email || !phone || !vehicleNumber || !licenseNumber) {
    throw new Error('All fields are required.')
  }

  const payload = {
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    vehicleNumber: vehicleNumber.trim(),
    licenseNumber: licenseNumber.trim(),
    status: status || 'active',
    updatedAt: serverTimestamp(),
  }

  const docRef = doc(db, DRIVERS_COLLECTION, id)
  await updateDoc(docRef, payload)
  return { id, ...payload }
}

export const deleteDriver = async (id) => {
  const docRef = doc(db, DRIVERS_COLLECTION, id)
  await deleteDoc(docRef)
}
