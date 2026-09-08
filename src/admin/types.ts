export type PeriodKey = 'today' | '7d' | '30d' | '3m' | '6m' | '1y'

export type PropertyStatus =
  | 'disponible'
  | 'reservada'
  | 'alquilada'
  | 'vendida'
  | 'inactiva'
  | 'suspendida'

export type OperationType = 'venta' | 'alquiler'

export type ClientType =
  | 'comprador'
  | 'vendedor'
  | 'inquilino'
  | 'propietario'
  | 'inversor'

export type ClientStatus =
  | 'nuevo'
  | 'contactado'
  | 'visitando'
  | 'interesado'
  | 'negociando'
  | 'cerrado'
  | 'perdido'

export type VisitStatus =
  | 'programada'
  | 'confirmada'
  | 'realizada'
  | 'cancelada'
  | 'reprogramada'

export type SaleStage =
  | 'consulta'
  | 'visita'
  | 'oferta'
  | 'negociacion'
  | 'reserva'
  | 'venta'

export type SaleStatus =
  | 'en_negociacion'
  | 'reserva'
  | 'documentacion'
  | 'cerrada'
  | 'cancelada'

export type RentalStatus = 'activo' | 'proximo_vencer' | 'vencido' | 'finalizado'

export type ContractType =
  | 'alquiler'
  | 'reserva'
  | 'compraventa'
  | 'administracion'
  | 'otros'

export type ContractStatus =
  | 'borrador'
  | 'pendiente_firma'
  | 'activo'
  | 'vencido'
  | 'cancelado'

export type PaymentStatus = 'pagado' | 'pendiente' | 'vencido' | 'parcial'

export type InquiryStatus =
  | 'nueva'
  | 'en_conversacion'
  | 'pendiente'
  | 'respondida'
  | 'cerrada'

export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'agente'
  | 'contador'
  | 'recepcion'

export type PublicationChannel =
  | 'web'
  | 'whatsapp'
  | 'instagram'
  | 'facebook'
  | 'portales'

export type PublicationStatus = 'publicada' | 'pausada' | 'borrador'

export type DocumentCategory =
  | 'contratos'
  | 'escrituras'
  | 'planos'
  | 'clientes'
  | 'propiedades'
  | 'comprobantes'

export interface AdminClient {
  id: string
  firstName: string
  lastName: string
  dni: string
  phone: string
  email: string
  address: string
  birthDate: string
  type: ClientType
  seeking: string[]
  operation: 'comprar' | 'alquilar' | 'ambos'
  budgetMin: number
  budgetMax: number
  locations: string[]
  firstContact: string
  lastContact: string
  nextContact: string
  agentId: string
  status: ClientStatus
  notes: string
  createdAt: string
}

export interface AdminVisit {
  id: string
  propertyId: string
  propertyTitle: string
  propertyLocation: string
  clientId: string
  clientName: string
  agentId: string
  agentName: string
  datetime: string
  status: VisitStatus
  notes: string
  confirmed: boolean
}

export interface AdminSale {
  id: string
  propertyId: string
  propertyTitle: string
  buyerId: string
  buyerName: string
  sellerName: string
  agentId: string
  agentName: string
  price: number
  commission: number
  deposit: number
  balance: number
  paymentMethod: string
  date: string
  stage: SaleStage
  status: SaleStatus
}

export interface AdminRental {
  id: string
  propertyId: string
  propertyTitle: string
  tenantId: string
  tenantName: string
  ownerName: string
  monthlyPrice: number
  deposit: number
  startDate: string
  endDate: string
  adjustment: string
  adjustmentIndex: string
  status: RentalStatus
}

export interface AdminContract {
  id: string
  number: string
  type: ContractType
  propertyId: string
  propertyTitle: string
  clientId: string
  clientName: string
  startDate: string
  endDate: string
  status: ContractStatus
  amount: number
}

export interface AdminPayment {
  id: string
  clientId: string
  clientName: string
  propertyId: string
  propertyTitle: string
  concept: string
  amount: number
  date: string
  method: string
  status: PaymentStatus
}

export interface AdminInquiry {
  id: string
  clientId: string | null
  clientName: string
  propertyId: string
  propertyTitle: string
  message: string
  agentId: string
  agentName: string
  status: InquiryStatus
  createdAt: string
  unread: boolean
}

export interface AdminPublication {
  id: string
  propertyId: string
  propertyTitle: string
  channel: PublicationChannel
  status: PublicationStatus
  views: number
  favorites: number
  inquiries: number
  url: string
  updatedAt: string
}

export interface AdminDocument {
  id: string
  name: string
  category: DocumentCategory
  relatedType: 'property' | 'client' | 'contract' | 'general'
  relatedId: string
  relatedLabel: string
  type: string
  size: string
  uploadedAt: string
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: UserRole
  status: 'active' | 'inactive'
  permissions: string[]
  joined: string
}

export interface AdminNotification {
  id: string
  title: string
  body: string
  createdAt: string
  read: boolean
  type: 'consulta' | 'visita' | 'contrato' | 'pago' | 'propiedad' | 'cliente' | 'reserva'
}

export interface AuditEvent {
  id: string
  actor: string
  action: string
  target: string
  createdAt: string
}

export interface ActivityItem {
  id: string
  text: string
  createdAt: string
  type: string
}

export interface PropertyMeta {
  propertyId: string
  code: string
  status: PropertyStatus
  operation: OperationType
  city: string
  neighborhood: string
  ownerName: string
  agentName: string
  publishedAt: string
  updatedAt: string
  expenses: string
  taxes: string
  commission: string
  profitability: string
  yearBuilt: number
  history: { date: string; text: string }[]
  docs: { name: string; type: string }[]
}

export interface CompanySettings {
  name: string
  phone: string
  email: string
  address: string
  currency: string
  dateFormat: string
  timezone: string
  language: string
}

export const PERIOD_OPTIONS: { key: PeriodKey; label: string }[] = [
  { key: 'today', label: 'Hoy' },
  { key: '7d', label: '7 días' },
  { key: '30d', label: '30 días' },
  { key: '3m', label: '3 meses' },
  { key: '6m', label: '6 meses' },
  { key: '1y', label: '1 año' },
]

export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
  disponible: 'Disponible',
  reservada: 'Reservada',
  alquilada: 'Alquilada',
  vendida: 'Vendida',
  inactiva: 'Inactiva',
  suspendida: 'Suspendida',
}

export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  nuevo: 'Nuevo',
  contactado: 'Contactado',
  visitando: 'Visitando',
  interesado: 'Interesado',
  negociando: 'Negociando',
  cerrado: 'Cerrado',
  perdido: 'Perdido',
}

export const SALE_STAGE_LABELS: Record<SaleStage, string> = {
  consulta: 'Consulta',
  visita: 'Visita',
  oferta: 'Oferta',
  negociacion: 'Negociación',
  reserva: 'Reserva',
  venta: 'Venta',
}

export const PERMISSIONS = [
  'ver_propiedades',
  'crear_propiedades',
  'editar_propiedades',
  'eliminar_propiedades',
  'ver_clientes',
  'ver_pagos',
  'crear_contratos',
  'ver_reportes',
] as const
