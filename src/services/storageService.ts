import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { getFirebaseStorage } from '../lib/firebase'

const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export async function uploadPropertyImage(file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Formato no válido. Usá JPG, PNG, WEBP o GIF.')
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('La imagen supera los 5 MB. Elegí un archivo más liviano.')
  }

  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `properties/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`
  const storageRef = ref(getFirebaseStorage(), path)

  await uploadBytes(storageRef, file, {
    contentType: file.type,
  })

  return getDownloadURL(storageRef)
}
