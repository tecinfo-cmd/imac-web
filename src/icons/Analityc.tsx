
type AnalitycProps = {
  size?: number;
  className?: string;
};
export const Analityc = ({ size = 44, className, ...props }: AnalitycProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect x="1.5" y="1.5" width="45" height="45" rx="4.5" fill="transparent" />
      <rect
        x="1.5"
        y="1.5"
        width="45"
        height="45"
        rx="4.5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M8.25 15.25C8.25 17.1065 8.9875 18.887 10.3003 20.1997C11.613 21.5125 13.3935 22.25 15.25 22.25C17.1065 22.25 18.887 21.5125 20.1997 20.1997C21.5125 18.887 22.25 17.1065 22.25 15.25C22.25 13.3935 21.5125 11.613 20.1997 10.3003C18.887 8.9875 17.1065 8.25 15.25 8.25C13.3935 8.25 11.613 8.9875 10.3003 10.3003C8.9875 11.613 8.25 13.3935 8.25 15.25Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.25 8.25V15.25H22.25"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.75 32.75V39.75"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32.75 27.5V39.75"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M25.75 25.75V39.75"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M39.75 24V39.75"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
