chrome.runtime.sendMessage({from: "popup", message: "list-alerts"}, function(m){
    var el = document.getElementById("messages");
    el.innerHTML = m.message.join("<br>");
});