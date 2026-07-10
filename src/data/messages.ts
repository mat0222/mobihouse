export interface Message {
  id: number
  senderId: string
  text: string
  timestamp: string
  read: boolean
}

export interface Conversation {
  id: number
  contactName: string
  contactAvatar: string
  propertyTitle?: string
  lastMessage: string
  lastTimestamp: string
  unread: number
  messages: Message[]
}

export const conversations: Conversation[] = [
  {
    id: 1,
    contactName: 'Laura Martínez',
    contactAvatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
    propertyTitle: 'Loft Moderno Palermo',
    lastMessage: '¿Podemos coordinar una visita el jueves?',
    lastTimestamp: 'Hace 10 min',
    unread: 2,
    messages: [
      {
        id: 1,
        senderId: 'contact',
        text: 'Hola Andrés, vi el loft en Palermo y me interesa mucho.',
        timestamp: '10:30',
        read: true,
      },
      {
        id: 2,
        senderId: 'me',
        text: '¡Hola Laura! Claro, está disponible para visitas. ¿Qué día te viene bien?',
        timestamp: '10:35',
        read: true,
      },
      {
        id: 3,
        senderId: 'contact',
        text: '¿Podemos coordinar una visita el jueves?',
        timestamp: '11:02',
        read: false,
      },
    ],
  },
  {
    id: 2,
    contactName: 'Carlos Ruiz',
    contactAvatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
    propertyTitle: 'Casa Barrio Cerrado Belgrano',
    lastMessage: 'Perfecto, te envío la documentación.',
    lastTimestamp: 'Ayer',
    unread: 0,
    messages: [
      {
        id: 1,
        senderId: 'contact',
        text: 'Buenas tardes, ¿la casa en Belgrano sigue en venta?',
        timestamp: '15:20',
        read: true,
      },
      {
        id: 2,
        senderId: 'me',
        text: 'Sí Carlos, sigue disponible. ¿Querés más información?',
        timestamp: '15:45',
        read: true,
      },
      {
        id: 3,
        senderId: 'contact',
        text: 'Perfecto, te envío la documentación.',
        timestamp: '16:10',
        read: true,
      },
    ],
  },
  {
    id: 3,
    contactName: 'Sofía Fernández',
    contactAvatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face',
    propertyTitle: 'Dpto. 2 Amb. Recoleta',
    lastMessage: 'Gracias por la info, lo voy a pensar.',
    lastTimestamp: 'Lun',
    unread: 0,
    messages: [
      {
        id: 1,
        senderId: 'me',
        text: 'Hola Sofía, te comparto los detalles del departamento en Recoleta.',
        timestamp: '09:00',
        read: true,
      },
      {
        id: 2,
        senderId: 'contact',
        text: 'Gracias por la info, lo voy a pensar.',
        timestamp: '09:30',
        read: true,
      },
    ],
  },
]
