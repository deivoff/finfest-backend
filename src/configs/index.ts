import path from "path";

process.env.NODE_ENV === 'development' && require('dotenv').config({ path: path.join(`${__dirname}./../.env`) });

const {
  'NODE_ENV': env,
  'DB_NAME': dbName,
  'DB_URL': dbUrl,
  'DB_PASS': dbPass,
  'DB_USER': dbUser,
  'ORIGIN_URL': originUrl,
  'WS_ORIGIN_URL': wsOriginUrl,
  'SECRET_KEY': secretKey,
  'VK_CLIENT_ID': vkClientID,
  'VK_CLIENT_SECRET': vkClientSecret,
} = process.env;

export default {
  env,
  dbName,
  dbUrl,
  dbUser,
  dbPass,
  urls: {
    ws: wsOriginUrl,
    http: originUrl,
  },
  secretKey,
  isProd: env === 'production',
  vkConfig: {
    clientId: vkClientID,
    clientSecret: vkClientSecret,
    redirectUrl: originUrl + 'oauth/vk',
  }
};
