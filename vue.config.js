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
    port:80,
    // port:8081,
    proxy: {
      '/api': {
        // target: 'http://127.0.0.1:81/',
        target: 'http://192.168.3.206:81/',
        changeOrigin: true,
        pathRewrite: {
          '/api': ''
        }
      }
    },
    // productionSourceMap: true,
    // chainWebpack: (config) => {
    //   config.plugins.delete('prefetch');
    // }
  },
}