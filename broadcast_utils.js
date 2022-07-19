var dgram = require('dgram');
var device_utils = require('./device_utils');


function broadcast(device){
    // Create a udp socket client object.
    var client = dgram.createSocket("udp4");
    message = JSON.stringify(device)

    for(port of device.ALL_PORTS){
        client.send(message, 0, message.length, port, "localhost");
    }
    console.log(device.ALL_PORTS, 'UDP broadcast done successfully to all devices')
    
}

module.exports = {
    broadcast,
};

