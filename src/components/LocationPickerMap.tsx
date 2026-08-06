import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MAP_CENTER } from '../data/properties'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

const pickerIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

interface LocationPickerMapProps {
  lat: number
  lng: number
  onChange: (coords: { lat: number; lng: number }) => void
  active?: boolean
}

interface GeocodeResult {
  display_name: string
  lat: string
  lon: string
}

function MapClickHandler({
  onChange,
}: {
  onChange: (coords: { lat: number; lng: number }) => void
}) {
  useMapEvents({
    click(event) {
      onChange({
        lat: Number(event.latlng.lat.toFixed(6)),
        lng: Number(event.latlng.lng.toFixed(6)),
      })
    },
  })

  return null
}

function MapCenterSync({
  lat,
  lng,
  active,
  zoom,
}: {
  lat: number
  lng: number
  active: boolean
  zoom: number
}) {
  const map = useMap()

  useEffect(() => {
    if (!active) return
    const timer = window.setTimeout(() => {
      map.invalidateSize()
      map.setView([lat, lng], map.getZoom(), { animate: false })
    }, 150)
    return () => window.clearTimeout(timer)
  }, [active, map])

  useEffect(() => {
    map.flyTo([lat, lng], zoom, { duration: 0.6 })
  }, [lat, lng, zoom, map])

  return null
}

export function LocationPickerMap({
  lat,
  lng,
  onChange,
  active = true,
}: LocationPickerMapProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GeocodeResult[]>([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [mapZoom, setMapZoom] = useState(14)

  const position = {
    lat: Number.isFinite(lat) ? lat : MAP_CENTER.lat,
    lng: Number.isFinite(lng) ? lng : MAP_CENTER.lng,
  }

  const handleSearch = async () => {
    const text = query.trim()
    if (text.length < 3) {
      setSearchError('Escribí al menos 3 caracteres para buscar.')
      return
    }

    setSearching(true)
    setSearchError('')
    setResults([])

    try {
      const url = new URL('https://nominatim.openstreetmap.org/search')
      url.searchParams.set('format', 'json')
      url.searchParams.set('q', text)
      url.searchParams.set('limit', '5')
      url.searchParams.set('countrycodes', 'ar')
      url.searchParams.set('addressdetails', '1')

      const response = await fetch(url.toString(), {
        headers: {
          Accept: 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('No se pudo buscar la ubicación')
      }

      const data = (await response.json()) as GeocodeResult[]
      if (data.length === 0) {
        setSearchError('No se encontraron resultados. Probá con otra dirección o barrio.')
        return
      }

      setResults(data)
    } catch {
      setSearchError('Error al buscar. Intentá de nuevo en unos segundos.')
    } finally {
      setSearching(false)
    }
  }

  const selectResult = (result: GeocodeResult) => {
    const nextLat = Number(Number(result.lat).toFixed(6))
    const nextLng = Number(Number(result.lon).toFixed(6))
    setMapZoom(16)
    onChange({ lat: nextLat, lng: nextLng })
    setResults([])
    setQuery(result.display_name.split(',').slice(0, 3).join(','))
    setSearchError('')
  }

  return (
    <div className="flex h-full flex-col">
      <div className="relative z-[1000] border-b border-slate-200 bg-white p-2">
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  void handleSearch()
                }
              }}
              placeholder="Buscar barrio, calle o ciudad..."
              className="w-full rounded-lg border border-slate-200 py-2 pl-8 pr-3 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            />
          </div>
          <button
            type="button"
            onClick={() => void handleSearch()}
            disabled={searching}
            className="shrink-0 rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-white hover:bg-cyan-600 disabled:opacity-50"
          >
            {searching ? '...' : 'Buscar'}
          </button>
        </div>

        {searchError && <p className="mt-2 text-xs text-red-600">{searchError}</p>}

        {results.length > 0 && (
          <ul className="mt-2 max-h-36 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-sm">
            {results.map((result) => (
              <li key={`${result.lat}-${result.lon}-${result.display_name}`}>
                <button
                  type="button"
                  onClick={() => selectResult(result)}
                  className="w-full border-b border-slate-100 px-3 py-2 text-left text-xs text-slate-700 last:border-b-0 hover:bg-cyan-50"
                >
                  {result.display_name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="min-h-0 flex-1">
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={14}
          scrollWheelZoom
          className="h-full w-full"
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onChange={onChange} />
          <MapCenterSync
            lat={position.lat}
            lng={position.lng}
            active={active}
            zoom={mapZoom}
          />
          <Marker
            position={[position.lat, position.lng]}
            icon={pickerIcon}
            draggable
            eventHandlers={{
              dragend: (event) => {
                const marker = event.target as L.Marker
                const next = marker.getLatLng()
                onChange({
                  lat: Number(next.lat.toFixed(6)),
                  lng: Number(next.lng.toFixed(6)),
                })
              },
            }}
          />
        </MapContainer>
      </div>
    </div>
  )
}
