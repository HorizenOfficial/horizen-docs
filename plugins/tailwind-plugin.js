module.exports = function () {
  return {
    name: 'tailwind-plugin',
    configurePostCss(opts) {
      opts.plugins.push(require('@tailwindcss/postcss'));
      return opts;
    },
  };
};
