var xstate = require('xstate');
var device_utils = require('./device_utils.js');
var broadcast_utils = require('./broadcast_utils.js')
var udp_server = require('./udp_server.js')

var port_assigned = process.argv[2];
var schedule_id = process.argv[3];

let device = new device_utils.device_info(state='idle',port_assigned=port_assigned, 
                                        schedule_id=schedule_id, grouped=false, SWARM_PORTS=new Set(),
                                        ALL_PORTS =  ([3000,3001,3002]));



const swarmMachine = xstate.createMachine({
    id: 'swarm',
    initial: 'idle',
    context: {
        count: 0    
    },
    states: {
        idle: {
            on: {
                SUCCESS: 'grouping'
            }
        },
        grouping: {
            entry: ['group'],
            on: {
                SUCCESS: { target: 'leader_selection' }
                //actions:

            }
        },
        leader_selection: {
            entry: ['leaderselection'],
            on: {
                IF_LEADER: 'leaderState',
                IF_SLAVE: 'slaveStateWait'
            }
        },
        leaderState: {
            entry: ['downloadfromserver'],
            on: {
                SUCCESS: 'donorState'
            }
        },
        donorState: {
            entry: ['tcpClient'],
            on: {
                ALL_DATA_DONORS: 'shutdown'
            }
        },
        slaveStateWait: {
            entry: ['tcpServer'],
            on: {
                SUCCESS: 'slaveStateDataTransfer'
            }
        },
        slaveStateDataTransfer: {
            entry: ['downloadfromdonor'],
            on: {
                SUCCESS: 'donorState'
            }
        },
        shutdown: {}
    }
},
    {
        actions: {
            group: (context, event)=>{
                udp_server.set_udpserver(device, swarmMachine)
            },
            leaderselection: (context, event) => {
                clearInterval(udp_broadcast)
         
                const [first] = device.ALL_PORTS;
            
                if (device.port_assigned == first) {
                    console.log('assigned leader');
                    event = 'IF_LEADER';
                }
                else {
                    event = 'IF_SLAVE';
                    console.log('assigned slave');
                }
                 
                console.log('assigned leader/slave');
                transit(swarmMachine, event);
              
            },
            downloadfromserver: (context, event) => {
                console.log('leader downloads content from external server');
            },
            tcpClient: (context, event) => {
                console.log('act as tcp client to send content forward');
            },
            tcpServer: (context, event) => {
                console.log('create TCP server and wait for connection');
            },
            downloadfromdonor: (context, event) => {
                console.log('download data from connected client/ donor');
            }


        }

    });

function transit(swarmMachine, event){
    currentState = swarmMachine.transition(currentState, event);
    device.state = currentState.value;
    console.log(device.state)
    const { actions } = currentState;

    actions.forEach((action) => {
    // If the action is executable, execute it
    typeof action.exec === 'function' && action.exec();
    });
}  

let currentState = swarmMachine.initialState;
let prevState = 'none'

var udp_broadcast = setInterval(function() {
    console.log(`device:current_sate:${device.state}`);
    if(device.state != prevState){
        transit(swarmMachine, 'SUCCESS');
    }
    broadcast_utils.broadcast(device)
    console.log(device.SWARM_PORTS)

    prevState = device.state;
  }, 3000);


module.exports = {
    transit,
}



