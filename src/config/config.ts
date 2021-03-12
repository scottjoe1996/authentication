import dotenv from 'dotenv';

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`
});

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
let SERVER_PORT;

if (process.env.SERVER_PORT === 'random') {
  SERVER_PORT = Math.floor(Math.random() * 9001 + 1000);
} else {
  SERVER_PORT = process.env.SERVER_PORT || 2000;
}

const SERVER = {
  hostname: SERVER_HOSTNAME,
  port: SERVER_PORT
};

const config = {
  server: SERVER
};

export default config;
