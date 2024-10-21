const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   // transpileDependencies: true
//   publicPath: process.env.NODE_ENV === 'production'
//     ? '/production-sub-path/'
//     : '/'
// })
module.exports = {
  // devServer: {
  //   proxy: 'http://localhost:81'
  // }
  devServer: {
    // host:'localhost',
    port:8080,
    // port:8081,
    /*proxy: {
      '/api': {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
        pathRewrite: {
          '/api': ''
        }
      }
    },*/
    // productionSourceMap: true,
    // chainWebpack: (config) => {
    //   config.plugins.delete('prefetch');
    // }
  },
}