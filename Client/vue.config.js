// see http://vuejs-templates.github.io/webpack for documentation.
module.exports = {
  devServer: {
    port: 8080,
    https: false,
    hotOnly: false,
    disableHostCheck: true,
    proxy: {
      '/': {
        target: "http://yapi.in66.com/mock/14",
        secure: false,
        changeOrigin: true
      }
    },
    before: app => {}
  }
}