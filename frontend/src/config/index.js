const env = (key, defaultValue = null) => process.env[key] || defaultValue;

const config = {
    projectName: 'vue3Demo',
    env: env('NODE_ENV'),
    url: env('VUE_APP_URL', 'http://127.0.0.1:8080'),
    publicPath: env('VUE_APP_PUBLIC_PATH', '/'),
    apiUrl: env('VUE_APP_API_URL', 'http://127.0.0.1:3001/api'),
    mediaUrl: env('VUE_APP_MEDIA_URL', 'http://127.0.0.1:3001/public')
};

module.exports = config;
