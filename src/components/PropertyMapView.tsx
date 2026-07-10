import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MAP_CENTER, type Property } from '../data/properties'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

L.Marker.prototype.options.icon = defaultIcon

interface PropertyMapViewProps {
  zoom?: number
  active?: boolean
  properties: Property[]
  center?: { lat: number; lng: number }
}

function MapResizer({ active }: { active: boolean }) {
  const map = useMap()

  useEffect(() => {
    if (!active) return

    const timer = window.setTimeout(() => {
      map.invalidateSize()
    }, 150)

    return () => window.clearTimeout(timer)
  }, [active, map])

  return null
}

export function PropertyMapView({
  zoom = 13,
  active = true,
  properties,
  center,
}: PropertyMapViewProps) {
  const mapCenter = center ?? (properties[0]
    ? { lat: properties[0].lat, lng: properties[0].lng }
    : MAP_CENTER)

  return (
    <MapContainer
      center={[mapCenter.lat, mapCenter.lng]}
      zoom={zoom}
      scrollWheelZoom
      className="h-full w-full"
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapResizer active={active} />
      {properties.map((property) => (
        <Marker key={property.id} position={[property.lat, property.lng]}>
          <Popup>
            <strong>{property.title}</strong>
            <br />
            {property.price}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
