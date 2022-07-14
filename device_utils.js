function device_info(id, state){
    this.id = id;
    this.state = state;
};

var port_assigned;
var schedule_needed;
var SWARM_PORTS;

function content_request(device_id, schedule_id){
    this.device_id = device_id;
    this.schedule_id = schedule_id;
}

function update_swarm(port){
    SWARM_PORTS.push(port);
}

module.exports = {
    device_info,
    content_request,
    port_assigned,
    schedule_needed,
    SWARM_PORTS,
    update_swarm,
};
  