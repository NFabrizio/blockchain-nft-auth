const AuthzKey = artifacts.require("AuthzKey");

module.exports = function (deployer) {
  deployer.deploy(AuthzKey);
};
