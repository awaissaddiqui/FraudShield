import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../firebase.js";
import { addReportValidation } from "../validators/fraudReportValidation.js";
import analyzeEvidence from "../models/analyzeEvidence.js";
import { v6 as repID } from "uuid";

export default {

    getAllFraudReports: async (req, res) => {
        try {
            // Use 'collection' instead of 'doc' to reference the collection
            const reportsCollectionRef = collection(db, "fraudReport", "fraudReportsDocuments", "reports");

            // Fetch all documents in the collection
            const allReportsSnapshot = await getDocs(reportsCollectionRef);

            const allReports = [];
            allReportsSnapshot.forEach((doc) => {
                allReports.push(doc.data());
            });

            res.status(200).send(allReports);
        } catch (error) {
            res.status(401).send(error.message);
        }
    },



    getFraudReportById: async (req, res) => {
        const { reportID } = req.query;
        if (!reportID) return res.status(400).send('Report ID is required');
        try {
            const reportRef = doc(db, "fraudReport", 'fraudReportsDocuments', "reports", reportID);
            const reportSnap = await getDoc(reportRef);

            if (!reportSnap.exists()) {
                return res.status(404).send('No report found');
            }

            res.status(200).send(reportSnap.data());
        } catch (error) {
            res.status(500).send(error.message);
        }
    },


    addFraudReport: async (req, res) => {
        const { name, email, CNIC, phone, address, city, title, evidence, date, url } = req.body;
        const { error } = addReportValidation(req.body);
        // console.log(error.details[0].message);
        if (error) return res.status(403).send({ message: error.details[0].message });
        const reportID = repID();
        const newReport = {
            name,
            email,
            CNIC: CNIC || null,
            phone: phone || null,
            address,
            city,
            title,
            evidence,
            date: new Date(date).toISOString(),
            url,
            repID: reportID
        };

        try {
            const reportRef = doc(db, "fraudReport", 'fraudReportsDocuments', "reports", reportID);
            await setDoc(reportRef, newReport);

            res.status(201).send({ message: 'Report added successfully', reportID });

            // Asynchronously analyze evidence without blocking the main flow
            analyzeEvidence(evidence).catch(error => {
                res.status(500).send({ message: 'Failed to analyze evidence', error: error.message });
            });

        } catch (error) {
            res.status(403).send({
                message: error.message
            });
        }
    },
    updateReport: async (req, res) => {
        const { name, email, CNIC, phone, address, city, title, evidence, date, url } = req.body;
        const { reportID } = req.query;

        const { error } = addReportValidation(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const updatedReport = {
            name,
            email,
            CNIC,
            phone,
            address,
            city,
            title,
            evidence,
            date: new Date(date).toISOString(),
            url,
            repID: reportID
        };

        try {
            const reportRef = doc(db, "fraudReport", "fraudReportsDocuments", "reports", reportID);

            await setDoc(reportRef, updatedReport, { merge: true });

            res.status(200).send({ message: 'Report updated successfully', reportID });

        } catch (error) {
            res.status(500).send({ message: 'Failed to update the report', error: error.message });
        }
    },

};
