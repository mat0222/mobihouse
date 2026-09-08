import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { adminSeed } from './seed'
import type {
  ActivityItem,
  AdminClient,
  AdminContract,
  AdminDocument,
  AdminInquiry,
  AdminNotification,
  AdminPayment,
  AdminPublication,
  AdminRental,
  AdminSale,
  AdminUser,
  AdminVisit,
  AuditEvent,
  CompanySettings,
  PeriodKey,
  PropertyMeta,
} from './types'

const STORAGE_KEY = 'mobihouse-admin-crm-v1'

interface PersistedState {
  clients: AdminClient[]
  visits: AdminVisit[]
  sales: AdminSale[]
  rentals: AdminRental[]
  contracts: AdminContract[]
  payments: AdminPayment[]
  inquiries: AdminInquiry[]
  publications: AdminPublication[]
  documents: AdminDocument[]
  users: AdminUser[]
  notifications: AdminNotification[]
  audit: AuditEvent[]
  activity: ActivityItem[]
  propertyMeta: Record<string, PropertyMeta>
  company: CompanySettings
  period: PeriodKey
}

function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...structuredClone(adminSeed), period: '30d' }
    const parsed = JSON.parse(raw) as Partial<PersistedState>
    return {
      ...structuredClone(adminSeed),
      ...parsed,
      propertyMeta: {
        ...structuredClone(adminSeed.propertyMeta),
        ...(parsed.propertyMeta ?? {}),
      },
      period: parsed.period ?? '30d',
    }
  } catch {
    return { ...structuredClone(adminSeed), period: '30d' }
  }
}

function periodStart(period: PeriodKey): Date {
  const now = new Date()
  const start = new Date(now)
  switch (period) {
    case 'today':
      start.setHours(0, 0, 0, 0)
      break
    case '7d':
      start.setDate(now.getDate() - 7)
      break
    case '30d':
      start.setDate(now.getDate() - 30)
      break
    case '3m':
      start.setMonth(now.getMonth() - 3)
      break
    case '6m':
      start.setMonth(now.getMonth() - 6)
      break
    case '1y':
      start.setFullYear(now.getFullYear() - 1)
      break
  }
  return start
}

interface AdminDataContextValue extends PersistedState {
  setPeriod: (period: PeriodKey) => void
  periodStartDate: Date
  inPeriod: (iso: string) => boolean
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  updateInquiryStatus: (id: string, status: AdminInquiry['status']) => void
  updateVisitStatus: (id: string, status: AdminVisit['status'], confirmed?: boolean) => void
  updateSaleStage: (id: string, stage: AdminSale['stage']) => void
  updatePropertyMetaStatus: (propertyId: string, status: PropertyMeta['status']) => void
  updateCompany: (patch: Partial<CompanySettings>) => void
  appendAudit: (actor: string, action: string, target: string) => void
  appendActivity: (text: string, type: string) => void
  resetDemoData: () => void
  unreadCount: number
}

const AdminDataContext = createContext<AdminDataContextValue | null>(null)

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(loadState)

  const persist = useCallback((next: PersistedState) => {
    setState(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  const setPeriod = useCallback(
    (period: PeriodKey) => persist({ ...state, period }),
    [persist, state],
  )

  const periodStartDate = useMemo(() => periodStart(state.period), [state.period])

  const inPeriod = useCallback(
    (iso: string) => new Date(iso).getTime() >= periodStartDate.getTime(),
    [periodStartDate],
  )

  const markNotificationRead = useCallback(
    (id: string) => {
      persist({
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n,
        ),
      })
    },
    [persist, state],
  )

  const markAllNotificationsRead = useCallback(() => {
    persist({
      ...state,
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })
  }, [persist, state])

  const updateInquiryStatus = useCallback(
    (id: string, status: AdminInquiry['status']) => {
      persist({
        ...state,
        inquiries: state.inquiries.map((i) =>
          i.id === id ? { ...i, status, unread: status === 'nueva' } : i,
        ),
      })
    },
    [persist, state],
  )

  const updateVisitStatus = useCallback(
    (id: string, status: AdminVisit['status'], confirmed?: boolean) => {
      persist({
        ...state,
        visits: state.visits.map((v) =>
          v.id === id
            ? { ...v, status, confirmed: confirmed ?? v.confirmed }
            : v,
        ),
      })
    },
    [persist, state],
  )

  const updateSaleStage = useCallback(
    (id: string, stage: AdminSale['stage']) => {
      const statusMap: Record<AdminSale['stage'], AdminSale['status']> = {
        consulta: 'en_negociacion',
        visita: 'en_negociacion',
        oferta: 'en_negociacion',
        negociacion: 'en_negociacion',
        reserva: 'reserva',
        venta: 'cerrada',
      }
      persist({
        ...state,
        sales: state.sales.map((s) =>
          s.id === id ? { ...s, stage, status: statusMap[stage] } : s,
        ),
      })
    },
    [persist, state],
  )

  const updatePropertyMetaStatus = useCallback(
    (propertyId: string, status: PropertyMeta['status']) => {
      const current = state.propertyMeta[propertyId]
      if (!current) return
      persist({
        ...state,
        propertyMeta: {
          ...state.propertyMeta,
          [propertyId]: {
            ...current,
            status,
            updatedAt: new Date().toISOString(),
            history: [
              {
                date: new Date().toLocaleDateString('es-AR', {
                  day: '2-digit',
                  month: '2-digit',
                }),
                text: `Estado cambiado a ${status}`,
              },
              ...current.history,
            ],
          },
        },
      })
    },
    [persist, state],
  )

  const updateCompany = useCallback(
    (patch: Partial<CompanySettings>) => {
      persist({ ...state, company: { ...state.company, ...patch } })
    },
    [persist, state],
  )

  const appendAudit = useCallback(
    (actor: string, action: string, target: string) => {
      const event: AuditEvent = {
        id: `A-${Date.now()}`,
        actor,
        action,
        target,
        createdAt: new Date().toISOString(),
      }
      persist({ ...state, audit: [event, ...state.audit] })
    },
    [persist, state],
  )

  const appendActivity = useCallback(
    (text: string, type: string) => {
      const item: ActivityItem = {
        id: `ACT-${Date.now()}`,
        text,
        type,
        createdAt: new Date().toISOString(),
      }
      persist({ ...state, activity: [item, ...state.activity] })
    },
    [persist, state],
  )

  const resetDemoData = useCallback(() => {
    const fresh = { ...structuredClone(adminSeed), period: state.period as PeriodKey }
    persist(fresh)
  }, [persist, state.period])

  const unreadCount = state.notifications.filter((n) => !n.read).length

  const value = useMemo(
    () => ({
      ...state,
      setPeriod,
      periodStartDate,
      inPeriod,
      markNotificationRead,
      markAllNotificationsRead,
      updateInquiryStatus,
      updateVisitStatus,
      updateSaleStage,
      updatePropertyMetaStatus,
      updateCompany,
      appendAudit,
      appendActivity,
      resetDemoData,
      unreadCount,
    }),
    [
      state,
      setPeriod,
      periodStartDate,
      inPeriod,
      markNotificationRead,
      markAllNotificationsRead,
      updateInquiryStatus,
      updateVisitStatus,
      updateSaleStage,
      updatePropertyMetaStatus,
      updateCompany,
      appendAudit,
      appendActivity,
      resetDemoData,
      unreadCount,
    ],
  )

  return (
    <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>
  )
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext)
  if (!ctx) throw new Error('useAdminData debe usarse dentro de AdminDataProvider')
  return ctx
}
