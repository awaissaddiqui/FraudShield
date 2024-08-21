
export default {
    getAllFraudUsers: (req, res) => {
        res.status(200).send('All fraud users');
    },
    getFraudUserById: (req, res) => {
        const { id } = req.params;
        res.status(200).send('Fraud user by id' + id);
    },
    addFraudUser: (req, res) => {
        const { name, CNIC, email, phone, address, city, country, postalCode, fraudDescription } = req.body;
        res.status(200).send({ name, CNIC, email, phone, address, city, country, postalCode, fraudDescription });
    },
    updateFraudUser: (req, res) => {
        res.status(200).send('Fraud user updated', req.params.id);
    },
    deleteFraudUser: (req, res) => {
        res.status(200).send('Fraud user deleted' + req.params.id);
    }
}


