import React from 'react';

const IconLoader = () => (
  <svg id="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <title>Loader Logo</title>
    <g>
      <g transform="translate(11.000000, 5.000000)">
        {/* Replace B path with text V */}
        <text
          x="39"
          y="55"
          textAnchor="middle"
          fontSize="40"
          fontFamily="var(--font-mono)"
          fill="currentColor">
          V
        </text>
      </g>
      {/* Outer polygon shape */}
      <path
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M 50, 5
           L 11, 27
           L 11, 72
           L 50, 95
           L 89, 73
           L 89, 28 z"
      />
    </g>
  </svg>
);

export default IconLoader;
