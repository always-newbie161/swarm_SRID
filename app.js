import { createMachine } from 'xstate';

const swarmMachine = createMachine({
    id: 'swarm',
    initial: 'idle',
    context: {
        count: 0    // to check for the number of donors
    },
    states: {
        idle: {
            on: {
                SUCCESS: 'grouping'
            }
        },
        grouping: {
            entry: ['leaderselection'],
            on: {
                SUCCESS: { target: 'leader_selection' }
                //actions:

            }
        },
        leader_selection: {
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
            leader_selection: (context, event) => {
                console.log('assign leader/slave');
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

const currentState = 'idle';

const nextState = swarmMachine.transition(currentState, 'SUCCESS').value;




