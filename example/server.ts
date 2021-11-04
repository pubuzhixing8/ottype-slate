var http = require('http');
var express = require('express');
var ShareDB = require('sharedb');
const OTTypeSlate = require('../dist');
var WS = require('ws');
var WebSocketJSONStream = require('@teamwork/websocket-json-stream');

ShareDB.types.register(OTTypeSlate.type);
var backend = new ShareDB({ presence: true });
createDoc(startServer);

// Create initial document then fire callback
function createDoc(callback: () => void) {
    var connection = backend.connect();
    var doc = connection.get('rooms', 'ottype-slate');
    doc.fetch(function (err: any) {
        if (err) throw err;
        if (doc.type === null) {
            const children = [{
                type: 'paragraph',
                children: [
                    { text: 'ottype slate' }
                ]
            }, {
                type: 'paragraph',
                children: [
                    { text: 'slate + sharedb are so cool' }
                ]
            }] as any;
            doc.create(children, 'ottype-slate', callback);
            return;
        }
        callback();
    });
}

function startServer() {
    // Create a web server to serve files and listen to WebSocket connections
    var app = express();
    var server = http.createServer(app);

    // Connect any incoming WebSocket connection to ShareDB
    var wss = new WS.Server({ server: server });
    wss.on('connection', function (ws: WebSocket) {
        var stream = new WebSocketJSONStream(ws);
        backend.listen(stream);
    });

    server.listen(8080);
    console.log('Listening on http://localhost:8080');
}