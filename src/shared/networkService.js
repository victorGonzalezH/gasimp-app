import Zeroconf from 'react-native-zeroconf';
const zeroconf = new Zeroconf();
let services = [];
let scanning = false;
const NetworkService = {
  init(targetHostName, stopCallBack) {
    zeroconf.on('resolved', async service => {
      if (
        service.name.startsWith(targetHostName) === true &&
        service.addresses !== null &&
        service.addresses !== undefined &&
        service.addresses.length > 0
      ) {
        services.push(service);
        zeroconf.stop();
      }
    });

    zeroconf.on('stop', async () => {
      // scanning = false;
      stopCallBack(services.length > 0 ? services[0].addresses[0] : null);
    });

    zeroconf.on('error', async error => {
      // console.log(error);
    });
  },

  scan(type, protocol, domain) {
    services = [];
    zeroconf.scan(type, protocol, domain);
  },

  stop() {
    zeroconf.stop();
  },

  removeAllListeners() {
    zeroconf.removeAllListeners();
  },

  getIp() {
    return services.length > 0 ? services[0].addresses[0] : null;
  },
};

export default NetworkService;
