import {
    createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
    sendEmailVerification, sendPasswordResetEmail, updateProfile,
    onAuthStateChanged,
    updatePassword
} from "firebase/auth";
import { auth, db } from "../../firebase.js";
import { signUpValidation, loginValidation, forgetPasswordValidation, changePasswordValidation } from "../validators/authValidation.js";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";

export default {
    login: (req, res) => {
        const { email, password } = req.body;
        const { error } = loginValidation(req.body);
        if (error) return res.status(403).send({ message: error.details[0].message });
        signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
            if (!userCredential.user.emailVerified) return res.status(403).send({ message: 'Please verify your email address' });
            res.status(200).send(auth.currentUser);
        }).catch((error) => {
            if (error.code === 'auth/wrong-password') return res.status(401).send({ message: 'username or password is incorrect' });
            if (error.code === 'auth/user-disabled') return res.status(400).send({ message: 'User is disabled' });
            if (error.code === 'auth/user-not-found') return res.status(404).send({ message: 'User not found' });
            if (error.code === 'auth/invalid-email') return res.status(403).send({ message: 'Invalid email or password' });
            if (error.code === 'auth/invalid-credential') return res.status(403).send({ message: 'email or password are incorrect' });
            if (error.code === 'auth/network-request-failed') return res.status(400).send({ message: 'Network request failed' });
            res.status(500).send({ message: error.code });
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
        //     console.log(token);
        //     const user = result.user;
        //     res.status(200).send(user);
        // }).catch((error) => {
        //     const errorCode = error.code;
        //     console.log(errorCode);
        //     const errorMessage = error.message;
        //     const email = error.email;
        //     const credential = GoogleAuthProvider.credentialFromError(error);
        //     console.log(credential);
        //     res.status(403).send(errorMessage);
        // });
        createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
            const user = userCredential.user;
            updateProfile(user, {
                displayName: username,
            })
            sendEmailVerification(auth.currentUser).then(() => {
                res.status(201).send(username + " is register successfully, verification link is send to your email account ");
            }).catch((error) => {
                console.log(error.code);
            })
        }).catch((error) => {
            if (error.code === 'auth/email-already-in-use') return res.status(403).send(' Eamil already registered')
            if (error.code === 'auth/weak-password') return res.status(403).send('Password is too weak')
            if (error.code === 'auth/invalid-email') return res.status(403).send('Invalid email')
            if (error.code === 'too-many-requests') return res.status(403).send('Too many requests, please try again later')
            if (error.code === 'network-request-failed') return res.status(403).send('Network request failed')

        })
    },
    forgetPassword: async (req, res) => {
        const { email } = req.body;
        const { error } = forgetPasswordValidation(req.body);
        if (error) return res.status(403).send({ message: error.details[0].message });
        try {
            await sendPasswordResetEmail(auth, email);
            res.status(200).send({ message: `Password reset link is sent to your ${email} successfully` });
        } catch (error) {
            res.status(500).send({ message: 'Failed to send password reset link', error: error.message });
        }
    },
    signOut: (req, res) => {
        signOut(auth).then(() => {
            res.status(200).send({ message: 'Successfully signed out' });
        }).catch((error) => {
            console.error('Error signing out:', error);
            res.status(500).send({ error: 'Failed to sign out' });
        });
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
        const { photoURL, username, websiteUrl, phone, address } = req.body;
        try {
            const user = auth.currentUser;
            if (!user) return res.status(401).send('No user is loggedIn');
            await updateProfile(user, {
                displayName: username,
                photoURL: photoURL,
            });

            const profileRef = doc(db, "profiles", user.email);

            await setDoc(profileRef, {
                username: username,
                photoURL: photoURL,
                websiteUrl: websiteUrl,
                phone: phone,
                address: address
            });

            return res.status(201).send('Profile updated successfully');
        } catch (error) {
            return res.status(403).send(error.message);
        }
    },
    deleteUser: (req, res) => {
        const { email } = req.body;
        const user = auth.currentUser;
        if (!user) return res.status(401).send('No user is loggedIn');
        if (email !== user.email) return res.status(400).send('Please provide correct email');
        user.delete().then(() => {
            const profileRef = doc(db, "profiles", user.email);
            deleteDoc(profileRef);
            res.status(200).send('User deleted successfully')
        }).catch((error) => {
            res.status(400).send(error.message)
        })
    },
    getUserProfile: async (req, res) => {
        const user = auth.currentUser;
        if (!user) return res.status(401).send('No user is logged in');

        try {
            const profileRef = doc(db, "profiles", user.email);
            const profileSnap = await getDoc(profileRef);

            if (profileSnap.exists()) {
                res.status(200).json(profileSnap.data());
            } else {

                res.status(200).json({
                    username: "",
                    email: user.email,
                    photoURL: "",
                    address: "",
                    phoneNumber: "",
                    websiteUrl: "",
                });
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            res.status(500).send('Internal server error');
        }
    },
    changePassword: async (req, res) => {
        const { oldPassword, newPassword } = req.body;
        const { error } = changePasswordValidation(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const user = auth.currentUser;
        if (!user) return res.status(401).json({ message: 'No user is logged in' });

        try {

            await signInWithEmailAndPassword(auth, user.email, oldPassword);
            await updatePassword(user, newPassword);
            res.status(200).json({ message: 'Password updated successfully' });
        } catch (error) {
            if (error.code === 'auth/invalid-credential') return res.status(400).json({ message: 'The old password is incorrect' });
            if (error.code === 'auth/wrong-password') {
                res.status(403).json({ message: 'The old password is incorrect' });
            } else if (error.code === 'auth/weak-password') {
                res.status(400).json({ message: 'The new password is too weak' });
            } else {
                console.log(error.code);
                res.status(500).json({ message: 'Failed to update password', error: error.message });
            }
        }
    }


}