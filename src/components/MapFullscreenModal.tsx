import { useEffect } from 'react'
import { HiOutlineXMark } from 'react-icons/hi2'
import { PropertyMapView } from './PropertyMapView'
import type { Property } from '../data/properties'

interface MapFullscreenModalProps {
  isOpen: boolean
  onClose: () => void
  properties: Property[]
}

export function MapFullscreenModal({
  isOpen,
  onClose,
  properties,
}: MapFullscreenModalProps) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="modal-overlay animate-fade-in fixed inset-0 z-50 flex flex-col bg-black/60 p-4 backdrop-blur-sm">
      <div className="animate-scale-in flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-bold text-slate-900">Mapa en Tiempo Real</h2>
          <button
            type="button"
            onClick={onClose}
            className="btn-animated flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            aria-label="Cerrar mapa"
          >
            <HiOutlineXMark className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1">
          <PropertyMapView zoom={12} active={isOpen} properties={properties} />
        </div>
      </div>
    </div>
  )
}
