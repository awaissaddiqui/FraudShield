import { doc, getDoc } from "firebase/firestore";
import { db } from '../../firebase.js';

export const validateSecretAndApiKey = async (req, res, next) => {
    const { secret_key, api_key } = req.headers;

    if (!secret_key || !api_key) {
        return res.status(401).send({ message: 'Unauthorized: Missing Secret key or API key.' });
    }

    try {

        const secretKeyRecord = await getDoc(doc(db, 'ApiAuth', secret_key));


        if (!secretKeyRecord.exists()) {
            return res.status(401).send({ message: 'Unauthorized: Invalid Secret key' });
        }

        const userData = secretKeyRecord.data();
        if (userData.apiKey !== api_key) {
            return res.status(400).send({ message: 'Unauthorized: Invalid API key' });
        }

        next();
    } catch (error) {
        return res.status(500).send({ message: `Error: ${error.message}` });
    }
};
