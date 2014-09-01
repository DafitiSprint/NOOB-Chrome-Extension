'use strict';

var NOOB = {

  messages: [],
  isConnected: false,
  interval : "",
  
  getWsServerUrl: function() {
    return (localStorage.getItem('websocket_server') == null) ? "localhost:80" : localStorage.getItem('websocket_server')
  },

  getConnInterval: function() {
    return (localStorage.getItem('interval_connection') == null) ? 3600000 : localStorage.getItem('interval_connection')
  },

  getMessages: function() {
    return this.messages;
  },

  addMessage: function(message) {
    this.messages.push(message);
  },

  notification: function(message, color) {
    color = (color) ? color : 'red';
    chrome.notifications.create('', {
      "type": "basic",
      "iconUrl":"noob_dft_icon_" + color + ".png",
      "title": "Dafiti Alert",
      "message": message
    }, this.notified);
  },

  notified: function(e) {

  },

  setIcon: function(color) {
    chrome.browserAction.setIcon({path: 'noob_dft_icon_'+color+'_32.png'});
  },

  getConnection: function() {
    if (!this.isConnected) {
      this.connect();
    }
    return this.websocketServer;
  },

  connect: function() {
    this.websocketServer = new WebSocket('ws://'+this.getWsServerUrl()+'?type=user-browser');
    this.websocketServer.onopen = this.onopen;
    this.websocketServer.onmessage = this.onmessage;
    this.websocketServer.onclose = this.onclose;

    //SetInterval returns typeof number not function. 
    if (typeof(this.interval)=="number"){
      clearInterval(this.interval);  
    }
  },

  disconnect: function() {
    this.websocketServer.close();
  },

  onopen: function() {
    NOOB.isConnected = true;
    NOOB.setIcon.apply(NOOB, ['green']);
    NOOB.notification.apply(NOOB, ["Notification server is up","green"]);
    NOOB.stayAlive = setInterval(function(){
      NOOB.websocketServer.send('stay alive');
    }, 25000);
  },

  onmessage: function(m) {
    var data = JSON.parse(m.data);
    NOOB.addMessage.apply(NOOB, [data.text]);
    NOOB.notification.apply(NOOB, [data.text, data.color]);
  },

  onclose: function() {
    NOOB.notification.apply(NOOB, ['Notification Server is Down\nClick the icon to connect or wait 1 hour', 'yellow']);
    NOOB.isConnected = false;
    NOOB.setIcon.apply(NOOB, ['red']);
    clearInterval(NOOB.stayAlive);
    NOOB.interval = setInterval(function(){
      NOOB.connect.call(NOOB);
    }, NOOB.getConnInterval());
  }

}

chrome.browserAction.onClicked.addListener(function(tab) {
  if (NOOB.isConnected) {
    NOOB.disconnect();
  } else {
    NOOB.getConnection();
  }
  
});
chrome.runtime.onMessage.addListener(function(r,s){
  if (r.from === "config"){
    NOOB[r.message]();
  }
});

NOOB.getConnection();