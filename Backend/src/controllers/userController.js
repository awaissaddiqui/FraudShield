import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification, sendPasswordResetEmail, updateProfile, updateCurrentUser, onAuthStateChanged, signInWithPopup, updateEmail, updatePassword } from "firebase/auth";
import { auth } from "../../firebase.js";
import { signUpValidation, loginValidation, forgetPasswordValidation } from "../validators/authValidation.js";


export default {
    login: (req, res) => {
        const { email, password } = req.body;
        const { error } = loginValidation(req.body);
        if (error) return res.status(403).send(error.details[0].message);
        signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
            if (!userCredential.user.emailVerified) return res.status(403).send('Please verify your email first');
            res.status(200).send(auth.currentUser);
        }).catch((error) => {
            res.status(403).send(error.message)
        }
        )
    },
    register: (req, res) => {
        const { username, email, password } = req.body;
        const { error } = signUpValidation(req.body);
        if (error) return res.status(403).send(error.details[0].message);
        // signInWithPopup(auth, provider).then((result) => {
        //     const credential = GoogleAuthProvider.credentialFromResult(result);
        //     const token = credential.accessToken;
        //     const user = result.user;
        //     res.status(200).send(user);
        // }).catch((error) => {
        //     const errorCode = error.code;
        //     const errorMessage = error.message;
        //     const email = error.email;
        //     const credential = GoogleAuthProvider.credentialFromError(error);
        //     res.status(403).send(errorMessage);
        // });
        createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
            const user = userCredential.user;
            updateProfile(user, {
                displayName: username,
                photoURL: "https://example.com/jane-q-user/profile.jpg",
            })
            sendEmailVerification(auth.currentUser).then(() => {
                res.status(200).send(username + " is register successfully, verification link is send to your email account ");
            }).catch((error) => {
                console.log(error);
            })
        }).catch((error) => {
            if (error.code === 'auth/email-already-in-use') return res.status(403).send(email + ' already registered')
        })
    },
    forgetPassword: (req, res) => {
        const { email } = req.body;
        const { error } = forgetPasswordValidation(req.body);
        if (error) return res.status(403).send(error.details[0].message);
        sendPasswordResetEmail(auth, email);
        res.status(200).send('Password reset link is send to your email ' + email);
    },
    signOut: (req, res) => {
        signOut(auth).then(() => {
            res.status(200).send(auth.currentUser)
        }).catch((error) => {
            console.log(error);
        })
    },
    authenticatedUser: (req, res) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                res.status(200).send(user)
            } else {
                res.status(403).send('No user is signed in')
            }
        })
    },
    updateProfile: async (req, res) => {
        const { displayName, photoURL, email, password } = req.body;

        try {
            await updatePassword(auth.currentUser, password);

            await updateEmail(auth.currentUser, email);

            await updateProfile(auth.currentUser, {
                displayName: displayName,
                photoURL: photoURL
            });

            res.status(200).send('Profile updated successfully');
        } catch (error) {
            res.status(403).send(error.message);
        }
    },
    deleteUser: (req, res) => {
        auth.currentUser.delete().then(() => {
            res.status(200).send('User deleted successfully')
        }).catch((error) => {
            res.status(403).send(error.message)
        })
    }
}