import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore'
import { db } from '../config/firebase'

const ANNOUNCEMENTS_COLLECTION = 'announcements'

export const submitAnnouncement = async ({
	title,
	message,
	createdBy,
	nextPickupDate,
	scheduleDay,
	type,
}) => {
	if (!title || !message) {
		throw new Error('Title and message are required.')
	}

	const payload = {
		title: title.trim(),
		message: message.trim(),
		createdBy: createdBy || null,
		createdAt: serverTimestamp(),
		nextPickup: nextPickupDate || null,
		schedule: scheduleDay || null,
		type: type || 'general',
	}

	const docRef = await addDoc(collection(db, ANNOUNCEMENTS_COLLECTION), payload)
	return { id: docRef.id, ...payload }
}

export const fetchAnnouncements = (callback) => {
  return onSnapshot(
    collection(db, ANNOUNCEMENTS_COLLECTION),
    (snapshot) => {
      const announcements = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      callback(announcements)
    },
    (error) => {
      console.error('Error fetching announcements:', error)
    }
  )
}