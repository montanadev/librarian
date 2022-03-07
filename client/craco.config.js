module.exports = {
    style: {
        postcss: {
            plugins: [
                require('tailwindcss'),
                require('autoprefixer'),
            ],
        },
    },

    devServer: {
        proxy: {
            '/api': {
                target: 'http://0.0.0.0:8000',
                secure: false,
                logLevel: 'debug',
                compress: false,
            }
        }
    }
}