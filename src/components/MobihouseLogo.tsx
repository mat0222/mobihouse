interface MobihouseLogoProps {
  className?: string
}

export function MobihouseLogo({ className = 'h-6 w-6' }: MobihouseLogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 10.5L12 4l9 6.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V10.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="16" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M18.5 18.5L21 21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
