import { db } from "../../firebase.js";
import { doc, getDoc, updateDoc } from "firebase/firestore";
export default {
    deleteReport: async (req, res) => {
        const { repID } = req.params;
        try {
            const docRef = doc(db, "fraudReport", 'dbdOrrSEWuvbZBAJwRov');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const reports = docSnap.data().reports;
                const updatedReports = reports.filter(report => report.repID !== repID);
                await updateDoc(docRef, {
                    reports: updatedReports
                })
                res.status(200).send('Report deleted successfully');
            }
            else {
                res.status(404).send('No report found');
            }

        } catch (error) {
            res.status(401).send(error.message);
        }
    },
    editReport: async (req, res) => {
        const { repID } = req.params;
        const { name, email, CNIC, phone, address, city, country, evidence, date, url } = req.body;
        try {
            const docRef = doc(db, "fraudReport", 'dbdOrrSEWuvbZBAJwRov');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const reports = docSnap.data().reports;
                const updatedReports = reports.map(report => {
                    if (report.repID === repID) {
                        return {
                            name: name,
                            email: email,
                            CNIC: CNIC,
                            phone: phone,
                            address: address,
                            city: city,
                            country: country,
                            evidence: evidence,
                            date: new Date(date).toISOString(),
                            url: url,
                            repID: repID
                        }
                    }
                    return report;
                });
                await updateDoc(docRef, {
                    reports: updatedReports
                });
                res.status(200).send('Report updated successfully');
            }
            else {
                res.status(404).send('No report found');
            }
        } catch (error) {
            res.status(401).send(error.message);
        }
    }
}