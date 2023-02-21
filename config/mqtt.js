module.exports.WebSocket_URL = 'ws://35.243.179.205:8083/mqtt';
module.exports.TCP_TLS_URL = 'ws://35.243.179.205:8083/mqtt';
module.exports.OPYIONS = {
    connectTimeout: 4000,
    // Authentication
    clientId: 'api',
    // username: 'emqx',
    // password: 'emqx',
    keepalive: 60,
    clean: true,
};