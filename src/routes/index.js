import fraudReportRouter from './fraudReportRouter.js';
import user from './userRouter.js';

export default (app) => {
    app.use('/api/user', user);
    app.use('/api/reportfraud', fraudReportRouter);
}
