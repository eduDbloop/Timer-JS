jQuery(document).ready(function() {
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

if (!window.indexedDB) {
  window.alert("Your browser doesn't support a stable version of IndexedDB.");
}

var db;
var request = indexedDB.open("newDatabase");

request.onupgradeneeded = function(e) {
  var thisDB = e.target.result;

  if (!thisDB.objectStoreNames.contains("seconds")) {
    var store = thisDB.createObjectStore("seconds", {
      keyPath: "id"
    });
    store.createIndex("IdIndex","id");
  }
}

request.onerror = function(event) {
  console.log("error: ");
};

request.onsuccess = function(event) {
  db = event.target.result;
  console.log("success: " + db);
};

var seconds = 900;
var i;
var t;
  
window.secondPassed = function() {
  var minutes = Math.round((seconds - 30) / 60);
  var remainingSeconds = seconds % 60;
  if (remainingSeconds < 10) {
    remainingSeconds = "0" + remainingSeconds;
  }
  document.getElementById('countdown').innerHTML = minutes + ":" + remainingSeconds;
}

$(window).on("beforeunload", function() {
addSeconds().then( function(response) {
  	console.log(response);
  });
  return "Do you really want to close?";  
});

$(window).unload(function() {
	console.log("Unload PAGE"); 
  
});

window.addSeconds = function() {
	return new Promise(function(resolve, reject){
  
  var transaction = db.transaction("seconds", "readwrite");
  var store = transaction.objectStore("seconds");

  var second = {
    id: 1,
    seconds: seconds
  }

  var request = store.put(second);

  request.onerror = function(e) {
    reject("Error", e.target.error.name);
    //some type of error handler
  }

  request.onsuccess = function(e) {
    resolve("Register added");
  }
  
  });
  
}

window.countdown = function() {
	secondPassed();
  if (seconds != 0) {
  seconds--;
  t = setTimeout("countdown()", 1000);
  }
}

window.setSeconds = function() {
	 var transaction = db.transaction("seconds", "readwrite");
  var objectStore = transaction.objectStore("seconds");
  var request = objectStore.get(1);

  request.onerror = function(event) {
    alert("Unable to retrieve time left.");
  };
  
  request.onsuccess = function(event) {
    // starts countdown
    seconds = request.result.seconds;
    console.log(seconds);
    
  };
}

window.cdpause = function() {
  // pauses countdown
  addSeconds().then( function(response) {
  	console.log(response);
  });
  clearTimeout(t);
};

window.cdreset = function() {
  // resets countdown	
  seconds = 900;
  cdpause();
  secondPassed();
};
});
