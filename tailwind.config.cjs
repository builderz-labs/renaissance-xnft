module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/tw-elements/dist/js/**/*.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['garet'],
        mono: ['Space Mono', 'monospace'],
      },
      colors: {
        'lily-blue': '#61FEFF',
        'lily-blue-dark': '#91B9FF',
        'lily-green': '#7FFFB9',
        'lily-yellow': '#FFD462',
        'lily-tan': '#E9E1D1',
        'lily-black': '#222222',
        'lily-red': '#FF9596',
        'renaissance-orange': '#FF8A57',
      },
      animation: {
        'spin-slow': 'spin 5s linear infinite',
        'spin-extra-slow': 'spin 10s linear infinite',
      },
      screens: {
        smLaptop: { raw: '(max-height: 900px) and (min-width: 768px)' },
        xsLaptop: { raw: '(max-height: 800px) and (min-width: 768px)' },
        smPhone: { raw: '(max-height: 720px)' },
        'lily-container': '1340px',
      },
      transitionProperty: {
        widthHeight: 'width, height',
      },
    },
  },
  plugins: [require('tw-elements/dist/plugin'), require('daisyui')],
};
