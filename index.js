import express from 'express';
import routes from './src/routes/index.js';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookieParser())
routes(app);
//useMiddleware
//connect2DB

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`App is listening is on PORT ${PORT} `);
})
