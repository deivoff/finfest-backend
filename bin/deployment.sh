#!/bin/bash

yarn install --production

NODE_ENV=$1
PORT=$2
URI=$3

DB_NAME=$4
DB_PASS=$5
DB_USER=$6
DB_URL=$7

SECRET_KEY=$8
VK_CLIENT_ID=$9
VK_CLIENT_SECRET=${10}

PROJECT_NAME='FinFest'

echo "module.exports = {
  apps: [{
    name: '$PROJECT_NAME',
    port: '$PORT',
    script: '$PWD/build/index.js',
    env: {
      NODE_ENV: '$NODE_ENV',
      PORT: '$PORT',
      ORIGIN_URL: 'https://$URI/',
      WS_ORIGIN_URL: 'wss://$URI/',
      DB_NAME: '$DB_NAME',
      DB_URL: '$DB_URL',
      DB_USER: '$DB_USER',
      DB_PASS: '$DB_PASS',
      SECRET_KEY: '$SECRET_KEY',
      VK_CLIENT_ID: '$VK_CLIENT_ID',
      VK_CLIENT_SECRET: '$VK_CLIENT_SECRET',
    },
  }],
};" >| ecosystem.config.js

pm2 delete $PROJECT_NAME
pm2 start
rm ecosystem.config.js