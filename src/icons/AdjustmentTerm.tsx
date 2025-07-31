type AdjustmentTermProps = {
  size?: number;
};

export const AdjustmentTerm = ({ size = 44 }: AdjustmentTermProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 51 51"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1.5"
        y="1.5"
        width="48"
        height="48"
        rx="4.5"
        fill="transparent"
      />
      <rect
        x="1.5"
        y="1.5"
        width="48"
        height="48"
        rx="4.5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M33.2188 14.3438H17.2812C16.4011 14.3438 15.6875 15.0573 15.6875 15.9375V35.0625C15.6875 35.9427 16.4011 36.6562 17.2812 36.6562H33.2188C34.099 36.6562 34.8125 35.9427 34.8125 35.0625V15.9375C34.8125 15.0573 34.099 14.3438 33.2188 14.3438ZM17.2812 11.1562C14.6406 11.1562 12.5 13.2969 12.5 15.9375V35.0625C12.5 37.7032 14.6406 39.8438 17.2812 39.8438H33.2188C35.8594 39.8438 38 37.7032 38 35.0625V15.9375C38 13.2969 35.8594 11.1562 33.2188 11.1562H17.2812Z"
        fill="currentColor"
      />
      <path
        d="M18.875 17.5312H31.625V19.5312H18.875V17.5312Z"
        fill="currentColor"
      />
      <path
        d="M18.875 23.9062H31.625V25.9062H18.875V23.9062Z"
        fill="currentColor"
      />
      <path
        d="M18.875 30.2812H26.8438V32.2812H18.875V30.2812Z"
        fill="currentColor"
      />
    </svg>
  );
};
