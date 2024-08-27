import express from 'express';
import routes from './src/routes/index.js';
import cookieParser from 'cookie-parser';
import { configDotenv } from 'dotenv';

configDotenv({
    path: './env/.env.production'
})
const app = express();
app.use(express.json());
app.use(cookieParser())
routes(app);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`App is listening is on PORT ${PORT} `);
})
