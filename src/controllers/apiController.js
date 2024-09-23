import { collection, getDocs, query, where, limit, orderBy } from "firebase/firestore";
import { db } from "../../firebase.js";
import { apiValidation } from "../validators/apiValidation.js";

export default {
    getFraudReportByEmailNameCNICPhone: async (req, res) => {
        const { email, CNIC, phone } = req.body;
        if (!email && !CNIC && !phone) {
            return res.status(400).send('At least one parameter (email, CNIC, or phone) is required.');
        }
        const { error } = apiValidation(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        try {

            const reportsCollectionRef = collection(db, "fraudReport", "fraudReportsDocuments", "reports");


            const queryConditions = [];

            if (email) queryConditions.push(where('email', '==', email));
            if (CNIC) queryConditions.push(where('CNIC', '==', CNIC));
            if (phone) queryConditions.push(where('phone', '==', phone));


            const reportsQuery = query(reportsCollectionRef, ...queryConditions);


            const querySnapshot = await getDocs(reportsQuery);
            const reports = [];
            querySnapshot.forEach((doc) => {
                reports.push(doc.data());
            });


            if (reports.length === 0) {
                return res.status(200).send('This is not a fraudulent user. No reports found.');
            }

            return res.status(200).send(reports);
        } catch (error) {
            res.status(500).send(error.message);
            console.log(error);
        }
    },

    getRecentFraudReport: async (req, res) => {
        const { email, CNIC, phone } = req.body;
        if (!email && !CNIC && !phone) {
            return res.status(400).send('At least one parameter (email, CNIC, or phone) is required.');
        }
        const { error } = apiValidation(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        try {
            const reportsCollectionRef = collection(db, "fraudReport", "fraudReportsDocuments", "reports");

            let reportsQuery;
            if (email) {
                reportsQuery = query(reportsCollectionRef, where('email', '==', email), orderBy('date', 'desc'), limit(1));
            } else if (phone) {
                reportsQuery = query(reportsCollectionRef, where('phone', '==', phone), orderBy('date', 'desc'), limit(1));
            } else if (CNIC) {
                reportsQuery = query(reportsCollectionRef, where('CNIC', '==', CNIC), orderBy('date', 'desc'), limit(1));
            }

            const querySnapshot = await getDocs(reportsQuery);
            const reports = [];

            querySnapshot.forEach((doc) => {
                reports.push(doc.data());
            });

            if (reports.length === 0) {
                return res.status(200).send('No recent fraud report found for this user.');
            }

            return res.status(200).send(reports[0]);

        } catch (error) {
            console.log(error);
            return res.status(500).send(error.message);
        }
    }

}