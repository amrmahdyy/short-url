const dns = require("dns");
const validateUrl = (url) => {
  return new Promise((resolve, reject) => {
    dns.lookup(url, (err, address, family) => {
      if (err)
        reject({
          error: "Invalid Hostname",
        });
      resolve(address);
    });
  });
};

module.exports = validateUrl;
