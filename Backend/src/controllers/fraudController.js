import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase.js";
import { addReportValidation } from "../validators/fraudReportValidation.js";
import analyzeEvidence from "../models/analyzeEvidence.js";
import { v6 as repID } from "uuid";
export default {
    getAllFraudReports: async (req, res) => {
        try {
            const docRef = doc(db, "fraudReport", 'dbdOrrSEWuvbZBAJwRov');
            const allReports = await getDoc(docRef);
            res.status(200).send(allReports.data())
        } catch (error) {
            res.status(401).send(error.message)
        }
    },
    getFraudReportById: async (req, res) => {
        const { reportID } = req.body;
        if (!reportID) return res.status(400).send('Report ID is required');

        try {
            const docRef = doc(db, "fraudReport", 'dbdOrrSEWuvbZBAJwRov');
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                return res.status(404).send('No report found');
            }

            const reports = docSnap.data().reports;
            const report = reports.find(report => report.repID === reportID);
            if (!report) return res.status(404).send('No report found');

            res.status(200).send(report);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    addFraudReport: async (req, res) => {
        const { name, email, CNIC, phone, address, city, title, evidence, date, url } = req.body;
        // const { error } = addReportValidation(req.body);
        // if (error) return res.status(403).send(error.details[0].message);
        const reportID = repID();
        const newReport = {
            name: name,
            email: email,
            CNIC: CNIC,
            phone: phone,
            title: title,
            address: address,
            city: city,
            evidence: evidence,
            date: new Date(date).toISOString(),
            url: url,
            repID: reportID
        };
        try {
            const fraudRef = doc(db, "fraudReport", 'dbdOrrSEWuvbZBAJwRov')
            await updateDoc(fraudRef, {
                reports: arrayUnion(newReport)
            });
            res.status(200).send(fraudRef)
            // analyzeEvidence(evidence).catch(error => console.log(error.message))

        } catch (error) {
            res.status(403).send(error.message)
        }
    },
}


