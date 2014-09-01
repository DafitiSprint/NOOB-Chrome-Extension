function save_options() {
    localStorage.setItem('websocket_server', document.getElementById('websocket_server').value);
    localStorage.setItem('interval_connection',document.getElementById('interval_connection').value * 60000);

    chrome.runtime.sendMessage({from: "config", message: "connect"});

    alert('salvo');
}

function restore_options() {
    var websocket_server = localStorage.getItem('websocket_server');
	var interval_connection = localStorage.getItem('interval_connection');

    if (!websocket_server) {
        websocket_server = 'localhost:80';
        localStorage.setItem('websocket_server', websocket_server);
    }
    if (!interval_connection) {
        interval_connection = 3600000;
        localStorage.setItem('interval_connection', interval_connection);
    }

    document.getElementById('websocket_server').value = websocket_server;
    document.getElementById('interval_connection').value = interval_connection / 60000;
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);