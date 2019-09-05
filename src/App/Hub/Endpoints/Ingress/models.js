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

const apiToUrlModel = url => ({
  id: url.id,
  state: url.state,
  url: url.value.url,
});

const urlToApiModel = url => ({
  value: {
    url: url.url,
  },
});

export { apiToIpModel, apiToUrlModel, ipToApiModel, urlToApiModel };
