import fraudReportRouter from './fraudReportRouter.js';
import dataAnalysisRouter from './dataAnalysisRouter.js'
import user from './userRouter.js';
import adminRouter from './adminRouter.js'
export default (app) => {
    app.use('/api/auth', user);
    app.use('/api/report', fraudReportRouter);
    app.use('/api/analysis', dataAnalysisRouter);
    app.use('/api/admin', adminRouter)
}
