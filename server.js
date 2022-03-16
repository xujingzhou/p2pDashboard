const fs = require('fs');
const path = require('path');
const url = require('url');
var httpServer = require('http');

var express = require('express');
var app = express();
 
const ioServer = require('socket.io');
const RTCServer = require('./Signaling.js');

var PORT = 9558;
var isUseHTTPs = true;

var config = {
    "socketURL": "/",
    "homePage": "/index.html",
};

var options = {
    key: fs.readFileSync('ssl/key.pem'),
    cert: fs.readFileSync('ssl/cert.pem')
};

function serverHandler(request, response) {

	// if (request.url === '/adapter-latest.js') {
	// 	response.writeHead(200, { 'Content-Type': 'application/javascript' });
	// 	response.end(fs.readFileSync('adapter-latest.js'));
	// } else if (request.url === '/RTCPeerConnectionEx.js') {
	// 	response.writeHead(200, { 'Content-Type': 'application/javascript'  });
	// 	response.end(fs.readFileSync('RTCPeerConnectionEx.js'));
	// } else if (request.url === '/socketio.js') {
	// 	response.writeHead(200, { 'Content-Type': 'application/javascript'  });
	// 	response.end(fs.readFileSync('socketio.js'));
	// } else if (request.url === '/FileBufferReader.js') {
	// 	response.writeHead(200, { 'Content-Type': 'application/javascript'  });
	// 	response.end(fs.readFileSync('FileBufferReader.js'));
	// } else if (request.url === '/canvas-designer-widget.js') {
	// 	response.writeHead(200, { 'Content-Type': 'application/javascript'  });
	// 	response.end(fs.readFileSync('canvas-designer-widget.js'));
	// } else if (request.url === '/widget.js') {
	// 	response.writeHead(200, { 'Content-Type': 'application/javascript'  });
	// 	response.end(fs.readFileSync('widget.js'));
	// } else if (request.url === '/jquery.min.js') {
	// 	response.writeHead(200, { 'Content-Type': 'application/javascript'  });
	// 	response.end(fs.readFileSync('./js/jquery.min.js'));
	// } else if (request.url === '/jquery-3.3.1.slim.min.js') {
	// 	response.writeHead(200, { 'Content-Type': 'application/javascript'  });
	// 	response.end(fs.readFileSync('./js/jquery-3.3.1.slim.min.js'));
	// } else if (request.url === '/popper.min.js') {
	// 	response.writeHead(200, { 'Content-Type': 'application/javascript'  });
	// 	response.end(fs.readFileSync('./js/popper.min.js'));
	// } else if (request.url === '/bootstrap.min.js') {
	// 	response.writeHead(200, { 'Content-Type': 'application/javascript'  });
	// 	response.end(fs.readFileSync('./js/bootstrap.min.js'));
	// } else if (request.url === '/emojionearea.min.js') {
	// 	response.writeHead(200, { 'Content-Type': 'application/javascript'  });
	// 	response.end(fs.readFileSync('./js/emojionearea.min.js'));
	// } else if (request.url === '/emojionearea.min.css') {
	// 	response.writeHead(200, { 'Content-Type': 'text/css'  });
	// 	response.end(fs.readFileSync('./css/emojionearea.min.css'));
	// } else if (request.url === '/bootstrap.min.css') {
	// 	response.writeHead(200, { 'Content-Type': 'text/css'  });
	// 	response.end(fs.readFileSync('./css/bootstrap.min.css'));
	// } else if (request.url === '/key-press.gif') {
	// 	response.writeHead(200, { 'Content-Type': 'image/gif'  });
	// 	response.end(fs.readFileSync('/images/key-press.gif'));
	// } else if (request.url === '/checkmark.png') {
	// 	response.writeHead(200, { 'Content-Type': 'image/png'  });
	// 	response.end(fs.readFileSync('./images/checkmark.png'));
	// } else if (request.url === '/attach-file.png') {
	// 	response.writeHead(200, { 'Content-Type': 'image/png'  });
	// 	response.end(fs.readFileSync('./images/attach-file.png'));
	// } else if (request.url === '/share-screen.png') {
	// 	response.writeHead(200, { 'Content-Type': 'image/png'  });
	// 	response.end(fs.readFileSync('./images/share-screen.png'));
	// } else if (request.url === '/password-protected.png') {
	// 	response.writeHead(200, { 'Content-Type': 'image/png'  });
	// 	response.end(fs.readFileSync('./images/password-protected.png'));
	// } else if (request.url === '/widget.html') {
	// 	response.writeHead(200, { 'Content-Type': 'text/html'  });
	// 	response.end(fs.readFileSync('widget.html'));
	// } else if (request.url === '/canvas-designer.html') {
	// 	response.writeHead(200, { 'Content-Type': 'text/html'  });
	// 	response.end(fs.readFileSync('./canvas-designer.html'));
	// } else {	
	// 	response.writeHead(200, {
	// 		'Content-Type': 'text/html'
	// 	});
	   
	// 	response.end(fs.readFileSync('index.html'));
	// }
}

app.use(express.static(path.join(__dirname, 'public')));
var httpApp;
if (isUseHTTPs) {
    httpServer = require('https');
    httpApp = httpServer.createServer(options, app);  // , serverHandler);
} else {
    httpApp = httpServer.createServer(app); // serverHandler);
}

httpApp = httpApp.listen(process.env.PORT || PORT, process.env.IP || "0.0.0.0", function () {
	var addr = httpApp.address();
    console.log("Server listening at", /*addr.address*/ "education.dten.dev" + ":" + addr.port);
});

ioServer(httpApp).on('connection', function(socket) {
    RTCServer(socket, config);
});

// 捕获全局异常
process.on('uncaughtException', (err, origin) => {
  fs.writeSync(
    process.stderr.fd,
    `捕获的异常: ${err}\n` +
    `异常的来源: ${origin}`
  );
});

