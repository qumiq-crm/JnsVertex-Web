// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyC-yByDGOtQdJmcVgovgh9l-0H-xRyjGgQ",
    authDomain: "tic-tac-toe-ee2b1.firebaseapp.com",
    projectId: "tic-tac-toe-ee2b1",
    storageBucket: "tic-tac-toe-ee2b1.appspot.com",
    messagingSenderId: "167887642006",
    appId: "1:167887642006:web:9c685ef79cc33aa53151b7",
    measurementId: "G-4305T2Q9Z9"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Select Elements
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
// const loginBtn = document.getElementById("loginBtn");
// const signupBtn = document.getElementById("signupBtn");
// const logoutBtn = document.getElementById("logoutBtn");
const message = document.getElementById("message");

// Login Function


// // Signup Function
// signupBtn.addEventListener("click", () => {
//     const email = emailInput.value;
//     const password = passwordInput.value;

//     createUserWithEmailAndPassword(auth, email, password)
//         .then((userCredential) => {
//             message.innerText = "User registered successfully!";
//         })
//         .catch((error) => {
//             message.innerText = error.message;
//         });
// });

// // Logout Function
// logoutBtn.addEventListener("click", () => {
//     signOut(auth).then(() => {
//         message.innerText = "Logged out!";
//         logoutBtn.style.display = "none";
//     }).catch((error) => {
//         message.innerText = error.message;
//     });
// });

// Admin credentials (this is just for demonstration - in production these should be stored securely)

export async function adminLogin(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();
        return {
            success: true,
            token: token,
            user: {
                email: userCredential.user.email,
                uid: userCredential.user.uid
            }
        };
    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            error: getErrorMessage(error.code)
        };
    }
}

export async function adminLogout() {
    try {
        await signOut(auth);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

// Helper function to get user-friendly error messages
function getErrorMessage(errorCode) {
    switch (errorCode) {
        case 'auth/invalid-email':
            return 'Invalid email address format.';
        case 'auth/user-disabled':
            return 'This account has been disabled.';
        case 'auth/user-not-found':
            return 'Email or password is incorrect.';
        case 'auth/wrong-password':
            return 'Email or password is incorrect.';
        case 'auth/too-many-requests':
            return 'Too many failed login attempts. Please try again later.';
        default:
            return 'An error occurred during login. Please try again.';
    }
}

// Modified Product Management Functions
export async function addProduct(productData, imageFiles) {
    try {
        if (!auth.currentUser) {
            throw new Error('You must be logged in to add products');
        }

        let imageUrls = [];
        
        if (imageFiles && imageFiles.length > 0) {
            // Upload all images
            for (const file of imageFiles) {
                const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
                await uploadBytes(storageRef, file);
                const imageUrl = await getDownloadURL(storageRef);
                imageUrls.push(imageUrl);
            }
        }

        // Save to Firestore with all image URLs
        const docRef = await addDoc(collection(db, "products"), {
            ...productData,
            imageUrls,
            createdAt: new Date().toISOString(),
            userId: auth.currentUser.uid
        });

        return {
            success: true,
            productId: docRef.id
        };
    } catch (error) {
        console.error("Error adding product:", error);
        return {
            success: false,
            error: error.message
        };
    }
}

export async function getProducts() {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const products = [];
        querySnapshot.forEach((doc) => {
            products.push({
                id: doc.id,
                ...doc.data()
            });
        });
        return {
            success: true,
            products
        };
    } catch (error) {
        console.error("Error getting products:", error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Add this new function for deleting products
export async function deleteProduct(productId) {
    try {
        // Check if user is authenticated
        if (!auth.currentUser) {
            throw new Error('You must be logged in to delete products');
        }

        await deleteDoc(doc(db, "products", productId));
        return {
            success: true
        };
    } catch (error) {
        console.error("Error deleting product:", error);
        return {
            success: false,
            error: error.message
        };
    }
}
