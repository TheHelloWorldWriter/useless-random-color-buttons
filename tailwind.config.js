const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: {
    files: ['./src/**/*.{html,njk,js}'],
  },
  theme: {
    fontFamily: {
      'sans': ['Itim', ...defaultTheme.fontFamily.sans],
      'serif': [...defaultTheme.fontFamily.serif],
      'mono': [...defaultTheme.fontFamily.mono]
    },
  },
}
