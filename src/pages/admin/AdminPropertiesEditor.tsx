import { useState, type FormEvent } from 'react'
import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlinePlus,
  HiOutlineMapPin,
  HiOutlinePhoto,
} from 'react-icons/hi2'
import { LocationPickerMap } from '../../components/LocationPickerMap'
import { useProperties } from '../../contexts/PropertiesContext'
import {
  amenitiesFromFeatures,
  DEFAULT_FEATURES,
  PROPERTY_TYPES,
  withPropertyDefaults,
  type Property,
  type PropertyBadge,
  type PropertyFeatures,
  type PropertyType,
} from '../../data/properties'
import { uploadPropertyImage } from '../../services/storageService'

const emptyForm = {
  title: '',
  price: '',
  badge: 'EN VENTA' as PropertyBadge,
  type: 'Departamento' as PropertyType,
  bedrooms: 2,
  bathrooms: 1,
  area: 80,
  lat: -34.5889,
  lng: -58.42,
  image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&h=300&fit=crop',
  features: { ...DEFAULT_FEATURES },
}

const featureLabels: { key: keyof PropertyFeatures; label: string }[] = [
  { key: 'patio', label: 'Patio' },
  { key: 'pileta', label: 'Pileta' },
  { key: 'ascensor', label: 'Ascensor' },
  { key: 'agua', label: 'Agua' },
  { key: 'gas', label: 'Gas' },
  { key: 'electricidad', label: 'Electricidad' },
]

export function AdminPropertiesPage() {
  const { properties, loading, error, addProperty, updateProperty, deleteProperty } =
    useProperties()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [formError, setFormError] = useState('')

  const openCreate = () => {
    setEditingId(null)
    setForm({ ...emptyForm, features: { ...DEFAULT_FEATURES } })
    setFormError('')
    setShowForm(true)
  }

  const openEdit = (property: Property) => {
    setEditingId(property.id)
    setForm({
      title: property.title,
      price: property.price,
      badge: property.badge,
      type: property.type,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      lat: property.lat,
      lng: property.lng,
      image: property.image,
      features: { ...property.features },
    })
    setFormError('')
    setShowForm(true)
  }

  const toggleFeature = (key: keyof PropertyFeatures) => {
    setForm((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [key]: !prev.features[key],
      },
    }))
  }

  const handleImageUpload = async (file: File | undefined) => {
    if (!file) return

    setUploadingImage(true)
    setFormError('')

    try {
      const url = await uploadPropertyImage(file)
      setForm((prev) => ({ ...prev, image: url }))
    } catch (uploadError) {
      setFormError(
        uploadError instanceof Error
          ? uploadError.message
          : 'No se pudo subir la imagen. Revisá las reglas de Firebase Storage.',
      )
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (uploadingImage) return

    setSaving(true)
    setFormError('')

    const payload = {
      ...form,
      amenities: amenitiesFromFeatures(form.features),
    }

    try {
      if (editingId) {
        await updateProperty(editingId, payload)
      } else {
        await addProperty(withPropertyDefaults(payload))
      }
      setShowForm(false)
    } catch (submitError) {
      setFormError(
        submitError instanceof Error
          ? submitError.message
          : 'No se pudo guardar la propiedad en Firebase',
      )
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    const confirmed = window.confirm(`¿Eliminar "${title}"? Esta acción no se puede deshacer.`)
    if (!confirmed) return

    try {
      await deleteProperty(id)
    } catch (deleteError) {
      window.alert(
        deleteError instanceof Error
          ? deleteError.message
          : 'No se pudo eliminar la propiedad',
      )
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestión de Propiedades</h1>
          <p className="text-slate-500">
            {loading
              ? 'Sincronizando con Firebase...'
              : `${properties.length} propiedades en el catálogo`}
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          disabled={loading || Boolean(error)}
          className="btn-animated flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <HiOutlinePlus className="h-5 w-5" />
          Nueva propiedad
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Cargando propiedades...</div>
        ) : properties.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No hay propiedades. Creá la primera desde el botón superior.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Propiedad</th>
                <th className="px-5 py-3">Precio</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3">Ambientes</th>
                <th className="px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={property.image}
                        alt=""
                        className="h-10 w-14 rounded object-cover"
                      />
                      <span className="font-medium text-slate-900">{property.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-700">{property.price}</td>
                  <td className="px-5 py-4">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      {property.badge}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {property.bedrooms} hab · {property.area} m²
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(property)}
                        className="btn-animated rounded-lg p-2 text-slate-500 hover:bg-cyan-50 hover:text-cyan-600"
                        aria-label="Editar"
                      >
                        <HiOutlinePencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(property.id, property.title)}
                        className="btn-animated rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                        aria-label="Eliminar"
                      >
                        <HiOutlineTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={(event) => void handleSubmit(event)}
            className="animate-scale-in max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl"
          >
            <h2 className="mb-4 text-lg font-bold text-slate-900">
              {editingId ? 'Editar propiedad' : 'Nueva propiedad'}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="mb-1 block text-sm text-slate-600">Título</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-600">Precio</label>
                <input
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-600">Estado</label>
                <select
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value as PropertyBadge })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                  <option value="NUEVO">NUEVO</option>
                  <option value="EN VENTA">EN VENTA</option>
                  <option value="EN ALQUILER">EN ALQUILER</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-600">Tipo</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as PropertyType })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-600">Habitaciones</label>
                <input
                  type="number"
                  min={1}
                  value={form.bedrooms}
                  onChange={(e) => setForm({ ...form, bedrooms: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-600">Baños</label>
                <input
                  type="number"
                  min={1}
                  value={form.bathrooms}
                  onChange={(e) => setForm({ ...form, bathrooms: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-600">Área (m²)</label>
                <input
                  type="number"
                  min={1}
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>

              <div className="col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="mb-3 text-sm font-medium text-slate-700">Características y servicios</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {featureLabels.map(({ key, label }) => (
                    <label
                      key={key}
                      className="flex cursor-pointer items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm text-slate-700 shadow-sm"
                    >
                      <input
                        type="checkbox"
                        checked={form.features[key]}
                        onChange={() => toggleFeature(key)}
                        className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <label className="mb-1 block text-sm text-slate-600">Imagen</label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  {form.image && (
                    <img
                      src={form.image}
                      alt="Vista previa"
                      className="h-24 w-36 rounded-lg object-cover border border-slate-200"
                    />
                  )}
                  <div className="min-w-0 flex-1 space-y-2">
                    <label className="btn-animated inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                      <HiOutlinePhoto className="h-4 w-4 text-cyan-600" />
                      {uploadingImage ? 'Subiendo...' : 'Subir desde la PC'}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        disabled={uploadingImage || saving}
                        onChange={(event) => {
                          void handleImageUpload(event.target.files?.[0])
                          event.target.value = ''
                        }}
                      />
                    </label>
                    <input
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      placeholder="O pegá una URL de imagen"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    />
                    <p className="text-xs text-slate-400">JPG, PNG, WEBP o GIF · máx. 5 MB</p>
                  </div>
                </div>
              </div>

              <div className="col-span-2">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <HiOutlineMapPin className="h-4 w-4 text-cyan-600" />
                    Ubicación en el mapa
                  </label>
                  <span className="text-xs text-slate-400">
                    Lat {form.lat.toFixed(5)} · Lng {form.lng.toFixed(5)}
                  </span>
                </div>
                <p className="mb-2 text-xs text-slate-500">
                  Buscá una dirección, barrio o ciudad, o hacé clic / arrastrá el marcador.
                </p>
                <div className="h-80 overflow-hidden rounded-lg border border-slate-200">
                  <LocationPickerMap
                    lat={form.lat}
                    lng={form.lng}
                    active={showForm}
                    onChange={({ lat, lng }) => setForm((prev) => ({ ...prev, lat, lng }))}
                  />
                </div>
              </div>
            </div>

            {formError && (
              <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {formError}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                disabled={saving || uploadingImage}
                className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving || uploadingImage}
                className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-600 disabled:opacity-50"
              >
                {saving ? 'Guardando...' : editingId ? 'Guardar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
