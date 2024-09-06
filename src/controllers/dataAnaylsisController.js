import { db } from "../../firebase.js"
import { getDocs, collection } from "firebase/firestore";
import identifyPatterns from "../models/identifyPatterns.js";


export default {
    getRecentTrends: async (req, res) => {
        try {
            const trends = await getDocs(collection(db, "trends"));
            const keywordCount = {};

            // Extracting trendingKeywords and counting their occurrences
            trends.forEach(doc => {
                const keywords = doc.data().trendingKeywords || [];
                keywords.forEach(keyword => {
                    keywordCount[keyword] = (keywordCount[keyword] || 0) + 1;
                });
            });

            // Transforming the keywordCount object into an array of objects
            const responseArray = Object.keys(keywordCount).map(keyword => ({
                keyword,
                total: keywordCount[keyword]
            }));

            res.status(200).send(responseArray);

        } catch (error) {
            res.status(400).send(error.message);
        }
    },
    getIdentifiedPattern: async (req, res) => {
        try {
            const trends = await getDocs(collection(db, "trends"));
            const keywordData = [];
            trends.forEach(doc => {
                keywordData.push(...doc.data().trendingKeywords);
            });

            const patterns = identifyPatterns(keywordData);
            res.status(200).json(patterns);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


}
