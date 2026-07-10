import { useState, type FormEvent } from 'react'
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi2'
import { useProperties } from '../../contexts/PropertiesContext'
import { withPropertyDefaults, type Property, type PropertyBadge } from '../../data/properties'

const emptyForm = {
  title: '',
  price: '',
  badge: 'EN VENTA' as PropertyBadge,
  bedrooms: 2,
  bathrooms: 1,
  area: 80,
  lat: -34.5889,
  lng: -58.42,
  image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&h=300&fit=crop',
}

export function AdminPropertiesPage() {
  const { properties, addProperty, updateProperty, deleteProperty } = useProperties()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const openEdit = (property: Property) => {
    setEditingId(property.id)
    setForm({
      title: property.title,
      price: property.price,
      badge: property.badge,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      lat: property.lat,
      lng: property.lng,
      image: property.image,
    })
    setShowForm(true)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (editingId) {
      updateProperty(editingId, form)
    } else {
      addProperty(withPropertyDefaults(form))
    }
    setShowForm(false)
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestión de Propiedades</h1>
          <p className="text-slate-500">{properties.length} propiedades en el catálogo</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="btn-animated flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-600"
        >
          <HiOutlinePlus className="h-5 w-5" />
          Nueva propiedad
        </button>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
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
                      onClick={() => deleteProperty(property.id)}
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
      </div>

      {showForm && (
        <div className="modal-overlay animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={handleSubmit}
            className="animate-scale-in w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl"
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
              <div className="col-span-2">
                <label className="mb-1 block text-sm text-slate-600">URL imagen</label>
                <input
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-600"
              >
                {editingId ? 'Guardar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
