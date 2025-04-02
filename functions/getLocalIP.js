const os = require("os");

exports.getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (const name in interfaces) {
    for (const net of interfaces[name]) {
      if (net.family === "IPv4" && !net.internal) {
        console.log(`Local IP Address: ${net.address}`);
        return net.address;
      }
    }
  }
};