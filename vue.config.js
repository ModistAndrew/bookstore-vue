const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            outputDir: 'app-for-windows',
            extraResources: [
                { from: 'code.exe', to: 'code.exe' },
            ],
        }
    }
})