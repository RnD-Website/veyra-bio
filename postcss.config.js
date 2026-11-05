const path = require('path');

// Point Tailwind at its config explicitly so it works whichever folder the dev server is started from.
module.exports = {
  plugins: {
    tailwindcss: { config: path.join(__dirname, 'tailwind.config.js') },
    autoprefixer: {},
  },
};
