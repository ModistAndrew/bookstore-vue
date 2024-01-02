const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            outputDir: 'app-for-windows',
            builderOptions: {
                extraFiles: [
                    {from: 'dist_backend', to: 'dist_backend'},
                ]
            }
        }
    }
})