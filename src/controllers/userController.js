import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification, sendPasswordResetEmail, updateProfile, updateCurrentUser, onAuthStateChanged, signInWithPopup, updateEmail, updatePassword } from "firebase/auth";
import { auth, db } from "../../firebase.js";
import { signUpValidation, loginValidation, forgetPasswordValidation } from "../validators/authValidation.js";
import { addDoc, collection, doc } from "firebase/firestore";


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
        const { photoURL, username, email, phone } = req.body;

        try {
            const user = auth.currentUser;

            if (!user) {
                return res.status(403).send('No user is currently authenticated');
            }

            // Update profile fields (displayName, photoURL)
            await updateProfile(user, {
                displayName: username,
                photoURL: photoURL
            });

            // Update email if it's provided and different from the current email
            if (email && email !== user.email) {
                await updateEmail(user, email);
            }

            // Update the phone number (This requires verifying the phone number through Firebase Phone Auth)
            if (phone) {
                // You need to handle phone verification separately
                // This is just a placeholder comment. Firebase Phone Auth flow should go here.
                console.log('Phone number update requires phone verification.');
            }

            return res.status(200).send('Profile updated successfully');
        } catch (error) {
            return res.status(403).send(error.message);
        }
    },
    deleteUser: (req, res) => {
        auth.currentUser.delete().then(() => {
            res.status(200).send('User deleted successfully')
        }).catch((error) => {
            res.status(403).send(error.message)
        })
    },
    getUserProfile: async (req, res) => {
        const profileRef = doc(db, "profiles", "LM88l3OdOOhjEqqrrcrS");
        const profileSnap = await profileRef.get();
        if (profileSnap.exists()) {
            res.status(200).send(profileSnap.data());
        } else {
            res.status(404).send('No profile found');
        }
    }
}