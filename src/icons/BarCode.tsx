type BarCodeType = {
  size?: number;
};

const Barcode = ({ size = 20 }: BarCodeType) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.5 19.5V4.5H4.5V19.5H1.5ZM6 19.5V4.5H7.5V19.5H6ZM9.75 19.5V4.5H11.25V19.5H9.75ZM12.75 19.5V4.5H16.5V19.5H12.75ZM18 19.5V4.5H19.5V19.5H18ZM21 19.5V4.5H22.5V19.5H21Z"
        fill="black"
      />
    </svg>
  );
};

export default Barcode;
