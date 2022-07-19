function device_info(state=undefined, port_assigned, schedule_id, grouped=false, SWARM_PORTS=new Set(), ALL_PORTS=([])){
    this.id = `device_${port_assigned}`;
    this.state = state;
    this.port_assigned = port_assigned;
    this.schedule_id = schedule_id;
    this.SWARM_PORTS = SWARM_PORTS;
    this.ALL_PORTS = ALL_PORTS;
    this.grouped = grouped;
};


module.exports = {
    device_info,
};
  
