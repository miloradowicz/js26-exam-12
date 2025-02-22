import { join } from 'path';

const config = {
  server: {
    port: 8000,
  },
  mongo: {
    host: 'mongodb://localhost/',
    db: 'miloradowicz-exam-12',
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  saltWorkFactor: 10,
  rootPath: join(__dirname, '..'),
  publicPath: 'public',
};

export default config;
