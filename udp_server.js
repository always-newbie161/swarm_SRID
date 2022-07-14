var dgram = require('dgram');
const { ALL } = require('dns');
var http = require('http');


var port_assigned = process.argv[2];
var schedule_needed = process.argv[3];

var ALL_PORTS = ([3000,3001,3002])
var SWARM_PORTS = ([]);


var request_count = 0;
var devices_tb = {}

// ALL_PORTS.forEach((port)=>{
//     devices_tb[`device_${port}`]='None';
// });

function set_udpserver(port_assigned, schedule_needed){
    // Create udp server socket object.
    var server = dgram.createSocket("udp4");


    // Make udp server listen on the port assigned.
    server.bind(port_assigned);

    server.on("message", function (message) {

        var obj = JSON.parse(message)
        if ('state' in obj){  // for state info broadcast
            var device_info = obj
            devices_tb[device_info.id] = device_info.state;
        }
        else if ('schedule_id' in obj){  // for content info broadcast during grouping
            request_count++;
            var content_request = obj;
            if (schedule_needed==content_request.schedule_id){
                SWARM_PORTS.push(content_request.device_id);
                console.log(`device_${SWARM_PORTS.at(-1)} requests the same schedule as this device`)
            }
        }

        if(request_count==ALL_PORTS.length){ //trigger to next state 'leader_selection'
            console.log('Grouping is done!');
            console.log(SWARM_PORTS);
        }

        process.stdout.write('msg recieved: '+message);
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
    .listen(port_assigned); // http server listening on the port assigned
}