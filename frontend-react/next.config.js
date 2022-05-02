/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    CONTRACT_FACTORY_DEPLOY_ADDRESS:
      "0xdC2E1738BCcdebA168C4025340021B9009c77d73",
    INFURA_ENDPOINT_WITH_CONTRACT_ATTACHED:
      "https://rinkeby.infura.io/v3/bdae6f3a69a14752b96941a42bb29aec",
  },
};

module.exports = nextConfig;
