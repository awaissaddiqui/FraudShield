import fraudReportRouter from './fraudReportRouter.js';
import dataAnalysisRouter from './dataAnalysisRouter.js'
import user from './userRouter.js';

export default (app) => {
    app.use('/api/auth', user);
    app.use('/api/report', fraudReportRouter);
    app.use('/api/analysis', dataAnalysisRouter);
}
