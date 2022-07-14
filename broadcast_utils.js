var port_assigned  = process.argv[2];
var STATE = process.argv[3];
var schedule_id = process.argv[4];

var dgram = require('dgram');
var device_utils = require('./device_utils');

function state_broadcast(device_id, STATE, SWARM_PORTS){
    var message = new device_utils.device_info(device_id, STATE);
    
    // Create a udp socket client object.
    var client = dgram.createSocket("udp4");
    message = JSON.stringify(message)

    for(port of SWARM_PORTS){
        client.send(message, 0, message.length, port, "localhost");
    }
    console.log('UDP broadcast done successfully to all devices')
}


function grouping_broadcast(port_assigned, schedule_id, ALL_PORTS){
    var message =  new device_utils.content_request(port_assigned, schedule_id);

    // Create a udp socket client object.
    var client = dgram.createSocket("udp4");
    message = JSON.stringify(message)

    for(port of ALL_PORTS){
        client.send(message, 0, message.length, port, "localhost");
    }
    console.log('UDP broadcast done successfully to all devices')
    
    
}

module.exports = {
    state_broadcast,
    grouping_broadcast,
};

grouping_broadcast(port_assigned, schedule_id);
