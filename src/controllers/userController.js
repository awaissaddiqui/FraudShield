import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase.js";


export default {
    login: (req, res) => {
        const { email, password } = req.body;
        signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
            if (!userCredential.user.emailVerified) return res.status(403).send('Please verify your email first');
            res.status(200).send(auth.currentUser);
        }).catch((error) => {
            res.status(403).send(error.message)
        }
        )
    },
    register: (req, res) => {
        const { email, password } = req.body;
        createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
            sendEmailVerification(auth.currentUser).then(() => {
                res.status(200).send("Verification link is send to your email  " + auth.currentUser.email);
            }).catch((error) => {
                console.log(error);
            })
        }).catch((error) => {
            if (error.code === 'auth/email-already-in-use') return res.status(403).send(email + ' already registered')
        })
    },
    forgetPassword: (req, res) => {
        const { email } = req.body;
        sendPasswordResetEmail(auth, email);
        res.status(200).send('Password reset link is send to your email ' + email);
    },
    signOut: (req, res) => {
        signOut(auth).then(() => {
            res.status(200).send(auth.currentUser)
        }).catch((error) => {
            console.log(error);
        })
    }
}