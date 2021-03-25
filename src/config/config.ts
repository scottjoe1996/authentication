import dotenv from 'dotenv';

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`
});

let SERVER_PORT;

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
if (process.env.SERVER_PORT === 'random') {
  SERVER_PORT = Math.floor(Math.random() * 9001 + 1000);
} else {
  SERVER_PORT = process.env.SERVER_PORT || 2000;
}

const awsRegion = process.env.AWS_REGION!;
const userPoolId = process.env.AWS_USER_POOL_ID!;
const ClientId = process.env.AWS_CLIENT_ID!;

const SERVER = {
  hostname: SERVER_HOSTNAME,
  port: SERVER_PORT
};

const USER_POOL_DATA = {
  ClientId: ClientId,
  UserPoolId: userPoolId
};

const config = {
  server: SERVER,
  awsRegion,
  userPoolData: USER_POOL_DATA
};

export default config;
