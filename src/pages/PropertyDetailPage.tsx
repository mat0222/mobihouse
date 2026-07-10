import { useState, type FormEvent } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import {
  HiOutlineArrowLeft,
  HiOutlineArrowLongRight,
  HiOutlineCalendarDays,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineEnvelope,
  HiOutlineXMark,
} from 'react-icons/hi2'
import { FaWhatsapp } from 'react-icons/fa6'
import {
  MdApartment,
  MdBathtub,
  MdBed,
  MdElevator,
  MdFitnessCenter,
  MdPool,
  MdSecurity,
  MdSquareFoot,
} from 'react-icons/md'
import { PropertyMapView } from '../components/PropertyMapView'
import { useAuth } from '../contexts/AuthContext'
import { useProperties } from '../contexts/PropertiesContext'
import type { Amenity, Property } from '../data/properties'

const amenityIcons: Record<Amenity, typeof MdPool> = {
  Piscina: MdPool,
  Gimnasio: MdFitnessCenter,
  Ascensor: MdElevator,
  'Seguridad 24/7': MdSecurity,
}

const badgeStyles: Record<Property['badge'], string> = {
  NUEVO: 'bg-blue-500 text-white',
  'EN ALQUILER': 'bg-[#d4b896] text-[#5c4a32]',
  'EN VENTA': 'bg-[#a8d5a2] text-[#2d5a28]',
}

type ModalType = 'info' | 'visit' | null

export function PropertyDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { properties } = useProperties()
  const property = properties.find((item) => item.id === Number(id))
  const [activeImage, setActiveImage] = useState(0)
  const [modal, setModal] = useState<ModalType>(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [infoForm, setInfoForm] = useState({ message: '' })
  const [visitForm, setVisitForm] = useState({
    date: '',
    time: '',
    phone: '',
    notes: '',
  })

  if (!property) {
    return <Navigate to="/propiedades" replace />
  }

  const images = property.images.length > 0 ? property.images : [property.image]
  const canGoPrev = activeImage > 0
  const canGoNext = activeImage < images.length - 1

  const goPrev = () => {
    if (canGoPrev) setActiveImage((index) => index - 1)
  }

  const goNext = () => {
    if (canGoNext) setActiveImage((index) => index + 1)
  }

  const closeModal = () => {
    setModal(null)
    setInfoForm({ message: '' })
    setVisitForm({ date: '', time: '', phone: '', notes: '' })
  }

  const showSuccess = (message: string) => {
    setSuccessMessage(message)
    window.setTimeout(() => setSuccessMessage(''), 5000)
  }

  const handleInfoSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!infoForm.message.trim()) return

    closeModal()
    showSuccess(
      `Tu solicitud sobre "${property.title}" fue enviada. ${property.agent.name} te responderá pronto.`,
    )

    const whatsappText = encodeURIComponent(
      `Hola ${property.agent.name}, soy ${user?.name ?? 'un interesado'}. Quiero más información sobre "${property.title}" (${property.price}).\n\n${infoForm.message.trim()}`,
    )
    window.open(
      `https://wa.me/${property.agent.whatsapp.replace(/\D/g, '')}?text=${whatsappText}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  const handleVisitSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!visitForm.date || !visitForm.time) return

    closeModal()
    showSuccess(
      `Visita solicitada para el ${visitForm.date} a las ${visitForm.time}. ${property.agent.name} te confirmará los detalles.`,
    )

    const whatsappText = encodeURIComponent(
      `Hola ${property.agent.name}, soy ${user?.name ?? 'un interesado'}. Quiero programar una visita para "${property.title}".\n\nFecha: ${visitForm.date}\nHorario: ${visitForm.time}${visitForm.phone ? `\nTeléfono: ${visitForm.phone}` : ''}${visitForm.notes ? `\nNotas: ${visitForm.notes}` : ''}`,
    )
    window.open(
      `https://wa.me/${property.agent.whatsapp.replace(/\D/g, '')}?text=${whatsappText}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-[#f5f7fa] px-6 py-8 lg:px-10">
      <Link
        to="/propiedades"
        className="btn-animated mb-6 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#004d40]"
      >
        <HiOutlineArrowLeft className="h-4 w-4" />
        Volver a propiedades
      </Link>

      {successMessage && (
        <div className="animate-fade-in mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {successMessage}
        </div>
      )}

      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-2xl bg-white p-4 shadow-sm lg:p-5">
          <div className="overflow-hidden rounded-xl">
            <img
              src={images[activeImage]}
              alt={`${property.title} - imagen ${activeImage + 1}`}
              className="aspect-[16/10] w-full object-cover"
            />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={goPrev}
              disabled={!canGoPrev}
              className="btn-animated flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Imagen anterior"
            >
              <HiOutlineChevronLeft className="h-5 w-5" />
            </button>

            <div className="grid flex-1 grid-cols-5 gap-2">
              {images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`overflow-hidden rounded-lg transition ${
                    index === activeImage
                      ? 'ring-2 ring-cyan-500 ring-offset-2 ring-offset-white'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Miniatura ${index + 1}`}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={goNext}
              disabled={!canGoNext}
              className="btn-animated flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Imagen siguiente"
            >
              <HiOutlineChevronRight className="h-5 w-5" />
            </button>
          </div>
        </section>

        <aside className="rounded-2xl bg-white p-6 shadow-sm lg:p-7">
          <h1 className="text-2xl font-bold leading-tight text-slate-900 lg:text-3xl">
            {property.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <p className="text-3xl font-bold text-[#004d40]">{property.price}</p>
            <span
              className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${badgeStyles[property.badge]}`}
            >
              {property.badge}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#004d40]">
                <MdSquareFoot className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Área</p>
                <p className="text-sm font-semibold text-slate-900">{property.area} M²</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#004d40]">
                <MdBed className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Habitaciones</p>
                <p className="text-sm font-semibold text-slate-900">{property.bedrooms}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#004d40]">
                <MdBathtub className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Baños / Garajes</p>
                <p className="text-sm font-semibold text-slate-900">
                  {property.bathrooms} / {property.garages}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#004d40]">
                <MdApartment className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Tipo</p>
                <p className="text-sm font-semibold text-slate-900">{property.type}</p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm leading-relaxed text-slate-600">{property.description}</p>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-slate-900">Amenities</h2>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {property.amenities.map((amenity) => {
                const Icon = amenityIcons[amenity]
                return (
                  <div key={amenity} className="flex items-center gap-2 text-sm text-slate-600">
                    <Icon className="h-4 w-4 text-[#004d40]" />
                    {amenity}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-[1fr_1.1fr] gap-3">
            <div className="h-36 overflow-hidden rounded-xl border border-slate-200">
              <PropertyMapView
                properties={[property]}
                zoom={14}
                active
                center={{ lat: property.lat, lng: property.lng }}
              />
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Contacto del Agente</p>
              <div className="mt-3 flex items-center gap-3">
                <img
                  src={property.agent.avatar}
                  alt={property.agent.name}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-[#004d40]/20"
                />
                <p className="text-sm font-medium text-slate-900">{property.agent.name}</p>
              </div>
              <div className="mt-4 space-y-2">
                <a
                  href={`https://wa.me/${property.agent.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-animated flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  <FaWhatsapp className="h-4 w-4 text-emerald-600" />
                  WhatsApp
                </a>
                <a
                  href={`mailto:${property.agent.email}?subject=Consulta%20sobre%20${encodeURIComponent(property.title)}`}
                  className="btn-animated flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  <HiOutlineEnvelope className="h-4 w-4" />
                  Enviar Correo
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={() => setModal('info')}
              className="btn-animated flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3.5 text-sm font-semibold text-white hover:bg-cyan-600"
            >
              Solicitar Más Información
              <HiOutlineArrowLongRight className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setModal('visit')}
              className="btn-animated w-full rounded-xl border border-slate-300 bg-white py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Programar una Visita
            </button>
          </div>
        </aside>
      </div>

      {modal === 'info' && (
        <div className="modal-overlay animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={handleInfoSubmit}
            className="animate-scale-in w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Solicitar más información</h2>
                <p className="mt-1 text-sm text-slate-500">{property.title}</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Cerrar"
              >
                <HiOutlineXMark className="h-5 w-5" />
              </button>
            </div>

            <label htmlFor="info-message" className="mb-1.5 block text-sm font-medium text-slate-700">
              ¿Qué te gustaría saber?
            </label>
            <textarea
              id="info-message"
              value={infoForm.message}
              onChange={(event) => setInfoForm({ message: event.target.value })}
              rows={4}
              required
              placeholder="Ej: ¿Está disponible para mudanza inmediata? ¿Incluye expensas?"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-600"
              >
                Enviar solicitud
              </button>
            </div>
          </form>
        </div>
      )}

      {modal === 'visit' && (
        <div className="modal-overlay animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={handleVisitSubmit}
            className="animate-scale-in w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Programar una visita</h2>
                <p className="mt-1 text-sm text-slate-500">{property.title}</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Cerrar"
              >
                <HiOutlineXMark className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="visit-date" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Fecha preferida
                </label>
                <input
                  id="visit-date"
                  type="date"
                  value={visitForm.date}
                  onChange={(event) => setVisitForm({ ...visitForm, date: event.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <div>
                <label htmlFor="visit-time" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Horario preferido
                </label>
                <input
                  id="visit-time"
                  type="time"
                  value={visitForm.time}
                  onChange={(event) => setVisitForm({ ...visitForm, time: event.target.value })}
                  required
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <div>
                <label htmlFor="visit-phone" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Teléfono (opcional)
                </label>
                <input
                  id="visit-phone"
                  type="tel"
                  value={visitForm.phone}
                  onChange={(event) => setVisitForm({ ...visitForm, phone: event.target.value })}
                  placeholder="+54 11 1234-5678"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <div>
                <label htmlFor="visit-notes" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Notas adicionales (opcional)
                </label>
                <textarea
                  id="visit-notes"
                  value={visitForm.notes}
                  onChange={(event) => setVisitForm({ ...visitForm, notes: event.target.value })}
                  rows={3}
                  placeholder="Ej: Prefiero visita por la tarde"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
              <HiOutlineCalendarDays className="h-4 w-4 shrink-0" />
              El agente confirmará tu visita por WhatsApp.
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-600"
              >
                Confirmar visita
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
