import * as React from "react";
const SVGComponent = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g clipPath="url(#clip0_3240_17362)">
      <path
        d="M12.75 11.25H24V0.75C24 0.336 23.664 0 23.25 0H12.75V11.25Z"
        fill="#4CAF50"
      />
      <path
        d="M11.25 11.25V0H0.75C0.336 0 0 0.336 0 0.75V11.25H11.25Z"
        fill="#F44336"
      />
      <path
        d="M11.25 12.75H0V23.25C0 23.664 0.336 24 0.75 24H11.25V12.75Z"
        fill="#2196F3"
      />
      <path
        d="M12.75 12.75V24H23.25C23.664 24 24 23.664 24 23.25V12.75H12.75Z"
        fill="#FFC107"
      />
    </g>
    <defs>
      <clipPath id="clip0_3240_17362">
        <rect width={24} height={24} fill="white" />
      </clipPath>
    </defs>
  </svg>
);
export default SVGComponent;
