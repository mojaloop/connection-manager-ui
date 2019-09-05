const apiToIpModel = ip => ({
  id: ip.id,
  state: ip.state,
  address: ip.value.address,
  ports: ip.value.ports,
});

const ipToApiModel = ip => ({
  value: {
    address: ip.address,
    ports: ip.ports,
  },
});

export { apiToIpModel, ipToApiModel };
