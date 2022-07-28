# swarm_SRID

This is a implementation of Samsung's patented swam-based content downloading algorithm.

* `app.js`: contains the code for state diagram and the flow of the algorithm from start to end through all the states.
* `broadcast_utils.js`: contains the UDP broadcast function.
* `device_utils.js`: contains the class function for device information that will be shared mong the devices.
* `udp_server.js`: contains the code for udp server which hears the broadcasted info and updates the devices db in every device. 

## To Run

* Include xstate module into this project using 
  `npm i xstate`
 * run `app.js`  in three terminals (3 devices) using: 
	 * `node app.js 3000 1`
	 * `node app.js 3001 1`
	 * `node app.js 3002 1`
	 * Note: first argument is the `port` used by the udp server and the second argument is the `schedule id` required by the device. 
