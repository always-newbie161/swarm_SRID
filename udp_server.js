var dgram = require('dgram');
const { ALL } = require('dns');
var http = require('http');
var app = require('./app.js');


var grouping_request = {};
var devices_tb = {};


function set_udpserver(device, swarmMachine){

    device.ALL_PORTS.forEach((port)=>{
        grouping_request[port]=false;
    });


    // Create udp server socket object.
    var server = dgram.createSocket("udp4");


    // Make udp server listen on the port assigned.
    server.bind(device.port_assigned);

    server.on("message", function (message) {

        var obj = JSON.parse(message)
        // if (obj.grouped){  // for state info broadcast
        //     var device_info = obj
        //     devices_tb[device_info.id] = device_info.state;
        // }
        if (device.grouped==false){  // for content info broadcast during grouping

            var content_request = obj;
            grouping_request[content_request.port_assigned]=true;
            devices_tb[content_request.port_assigned] = device

            if (device.schedule_id==content_request.schedule_id){
                device.SWARM_PORTS.add(content_request.port_assigned);
                console.log(`device_${content_request.port_assigned} requests the same schedule as this device`)
            }
            console.log(grouping_request)
        }

        if(device.ALL_PORTS.every(p=>grouping_request[p])){ 
            console.log('Grouping is done!, the following are in one swarm');
            console.log(device.SWARM_PORTS);
            // transition to leader selection state.
            
            device.grouped=true;
            devices_tb[device.port_assigned].grouped=true;
            currentState = swarmMachine.transition(device.state, 'SUCCESS');
            device.state = currentState.value;

        }
        //process.stdout.write('msg recieved: '+message+device.state);
    });

    // When udp server started and listening.
    server.on('listening', function () {
        var address = server.address(); 
        console.log('UDP Server started and listening on ' + address.address + ":" + address.port);
    });

    // Create a server
    http.createServer((request, response)=>{
        // update the devices info to the broswer to display
        response.write(JSON.stringify(devices_tb));

        response.end();
    })
    .listen(device.port_assigned); // http server listening on the port assigned
}

module.exports = {
    set_udpserver,
}
