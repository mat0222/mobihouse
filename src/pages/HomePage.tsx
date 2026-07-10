import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HiOutlineMagnifyingGlass,
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineEnvelope,
} from 'react-icons/hi2'
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa6'

const heroImage =
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&h=700&fit=crop'

const steps = [
  {
    number: '1',
    title: 'EXPLORAR',
    description: 'Busca y filtra entre miles de propiedades únicas.',
    icon: (
      <svg viewBox="0 0 64 64" className="h-16 w-16" fill="none">
        <rect x="8" y="12" width="48" height="40" rx="4" stroke="#334155" strokeWidth="2" />
        <path d="M8 24h48M20 12v40M36 12v40" stroke="#334155" strokeWidth="1.5" />
        <circle cx="44" cy="36" r="10" stroke="#334155" strokeWidth="2" />
        <path d="M50 42l6 6" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    image:
      'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&h=260&fit=crop',
  },
  {
    number: '2',
    title: 'CONECTAR',
    description: 'Habla con nuestros agentes certificados y agenda visitas.',
    icon: (
      <svg viewBox="0 0 64 64" className="h-16 w-16" fill="none">
        <path
          d="M12 38c0-8 8-14 20-14s20 6 20 14"
          stroke="#334155"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="22" cy="28" r="6" stroke="#334155" strokeWidth="2" />
        <circle cx="42" cy="28" r="6" stroke="#334155" strokeWidth="2" />
        <path d="M18 18c2-3 6-4 10-4M46 18c-2-3-6-4-10-4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="26" y="8" width="12" height="8" rx="3" stroke="#94a3b8" strokeWidth="1.5" />
      </svg>
    ),
    image:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=260&fit=crop',
  },
  {
    number: '3',
    title: 'CERRAR',
    description: 'Recibe asesoría legal y financiera hasta el final.',
    icon: (
      <svg viewBox="0 0 64 64" className="h-16 w-16" fill="none">
        <path
          d="M20 44V28c0-6 5-10 12-10s12 4 12 10v16"
          stroke="#334155"
          strokeWidth="2"
        />
        <circle cx="32" cy="22" r="8" stroke="#334155" strokeWidth="2" />
        <path d="M16 44h32" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
        <path d="M36 52h16M40 48v8" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=260&fit=crop',
  },
]

const socialLinks = [
  { icon: FaFacebookF, label: 'Facebook', href: '#' },
  { icon: FaInstagram, label: 'Instagram', href: '#' },
  { icon: FaTiktok, label: 'TikTok', href: '#' },
  { icon: FaYoutube, label: 'YouTube', href: '#' },
]

export function HomePage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [contactSent, setContactSent] = useState(false)

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    navigate('/propiedades', { state: { search: search.trim() } })
  }

  const handleContact = (e: FormEvent) => {
    e.preventDefault()
    setContactSent(true)
    setContactForm({ name: '', email: '', message: '' })
    setTimeout(() => setContactSent(false), 3000)
  }

  return (
    <div className="relative flex min-w-0 flex-1 flex-col overflow-y-auto bg-white">
      {/* Hero */}
      <section className="relative flex shrink-0 min-h-[420px] items-center">
        <img
          src={heroImage}
          alt="Casa moderna con piscina"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/30 to-transparent" />

        <div className="relative z-10 w-full px-10 py-16 lg:px-16">
          <h1 className="max-w-2xl text-3xl font-bold leading-tight text-white lg:text-4xl">
            Bienvenido a MobiHouse:
            <br />
            Donde Comienza Tu Historia
          </h1>
          <p className="mt-3 max-w-xl text-base text-white/90 lg:text-lg">
            Descubre propiedades exclusivas diseñadas para ti
          </p>

          <form onSubmit={handleSearch} className="mt-8 flex max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl">
            <div className="relative flex flex-1 items-center">
              <HiOutlineMagnifyingGlass className="absolute left-4 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar una propiedad..."
                className="w-full py-4 pl-12 pr-4 text-sm text-slate-700 outline-none"
              />
            </div>
            <button
              type="submit"
              className="btn-animated shrink-0 bg-[#1e5631] px-8 text-sm font-semibold text-white hover:bg-[#164724]"
            >
              Buscar
            </button>
          </form>
        </div>
      </section>

      {/* Proceso */}
      <section className="home-process relative shrink-0 bg-white px-8 py-20 lg:px-16">
        <div className="home-dots-left pointer-events-none absolute left-6 top-12 h-24 w-24 opacity-40" />
        <div className="home-dots-right pointer-events-none absolute right-6 top-12 h-24 w-24 opacity-40" />
        <div className="home-rings-left pointer-events-none absolute -left-8 top-24 h-40 w-40 opacity-30" />
        <div className="home-rings-right pointer-events-none absolute -right-8 top-24 h-40 w-40 opacity-30" />

        <div className="relative mx-auto max-w-6xl">
          <div className="relative mb-10 hidden lg:block">
            <svg
              className="mx-auto w-full max-w-4xl"
              viewBox="0 0 800 80"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M40 50 C160 10, 240 10, 400 45 S560 70, 760 35"
                stroke="#7dd3fc"
                strokeWidth="3"
                strokeDasharray="8 6"
                fill="none"
                opacity="0.85"
              />
            </svg>
          </div>

          <div className="relative grid grid-cols-1 gap-14 lg:grid-cols-3 lg:gap-10">
            {steps.map((step) => (
              <div key={step.title} className="flex flex-col items-center text-center">
                <div className="mb-5 flex h-20 w-20 items-center justify-center">{step.icon}</div>
                <h3 className="text-base font-bold tracking-wide text-slate-800">
                  {step.number}. {step.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500">
                  {step.description}
                </p>
                <img
                  src={step.image}
                  alt={step.title}
                  className="mt-6 h-40 w-full max-w-[240px] rounded-lg object-cover shadow-md"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section className="shrink-0 bg-[#ececec] px-8 py-14 lg:px-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <h2 className="mb-6 text-2xl font-bold text-slate-800">Contáctanos</h2>
            <form onSubmit={handleContact} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Nombre"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="rounded border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#1e5631] focus:ring-1 focus:ring-[#1e5631]"
                />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="rounded border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#1e5631] focus:ring-1 focus:ring-[#1e5631]"
                />
              </div>
              <textarea
                placeholder="Mensaje"
                required
                rows={5}
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                className="w-full resize-none rounded border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#1e5631] focus:ring-1 focus:ring-[#1e5631]"
              />
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  className="btn-animated rounded bg-[#1e5631] px-6 py-3 text-sm font-semibold text-white hover:bg-[#164724]"
                >
                  Enviar Mensaje
                </button>
                {contactSent && (
                  <span className="text-sm font-medium text-green-700">
                    Mensaje enviado correctamente
                  </span>
                )}
              </div>
            </form>
          </div>

          <div className="flex flex-col justify-center lg:pl-8">
            <h3 className="text-xl font-bold tracking-wide text-slate-800">
              MOBIHOUSE EN TODOS LADOS
            </h3>
            <ul className="mt-6 space-y-4 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <HiOutlineMapPin className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
                Dirección Argentina,Cordoba, CP: 6359
              </li>
              <li className="flex items-center gap-3">
                <HiOutlinePhone className="h-5 w-5 shrink-0 text-slate-500" />
                (54) 3456 7890
              </li>
              <li className="flex items-center gap-3">
                <HiOutlineEnvelope className="h-5 w-5 shrink-0 text-slate-500" />
                email@mobihouse.com
              </li>
            </ul>

            <div className="mt-8 flex gap-3">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="btn-animated flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 hover:border-[#1e5631] hover:text-[#1e5631]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
