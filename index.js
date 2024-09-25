import express from 'express';
import routes from './src/routes/index.js';
import cookieParser from 'cookie-parser';
import { configDotenv } from 'dotenv';
import cors from 'cors';

configDotenv({
    path: './.env.production'
})
const app = express();
app.use(cors());
const corsOptions = {
    origin: '*',
    credentials: true,
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser())
routes(app);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`App is listening is on PORT ${PORT} `);
})

export default app;
