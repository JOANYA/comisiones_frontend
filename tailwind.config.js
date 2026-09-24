/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        kk: {
          purple:  '#3D2449',
          purple2: '#6C4675',
          pink:    '#FFB3C6',
          pink2:   '#FFA0B7',
          bg:      '#F8F6F9',
          card:    '#FFFFFF',
          tint:    '#F0E8F3',
          text:    '#1F1823',
          muted:   '#5E5463',
          border:  '#E5DBE8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        kk: '0 4px 15px rgba(61,36,73,.05)',
        kkHover: '0 6px 20px rgba(61,36,73,.08)'
      },
      borderRadius: {
        kk: '12px'
      }
    }
  },
  plugins: []
};
