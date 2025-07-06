// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// Auth state
export function listenAuthState(redirectIfNoUser = true) {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (!user && redirectIfNoUser) {
            window.location.href = "index.html";
        }
    });
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Firebase configs
const firebaseConfig = {
    apiKey: "AIzaSyD7_Y2iDb9REZLaUQa-Iy4hBM5PMf4N-c0",
    authDomain: "kino-library.firebaseapp.com",
    projectId: "kino-library",
    storageBucket: "kino-library.firebasestorage.app",
    messagingSenderId: "886235550470",
    appId: "1:886235550470:web:36133e86f05be36fd80487"
};

document.addEventListener('DOMContentLoaded', () => {
    // Main constants

    const authorization = document.querySelector('.auth-reg>.auth-button')
    const registration = document.querySelector('.auth-reg>.reg-button')

    const regField = document.querySelector('main>.reg');
    const authField = document.querySelector('main>.auth');

    const signUpButton = document.querySelector('main>.reg>form>button');

    // Change field

    const change = (field, noneField, activeButton, passiveButton) => {
        noneField.style.display = 'none';
        if (noneField.classList.contains('activeField')) {
            noneField.classList.remove('activeField');
        }
        passiveButton.style.backgroundColor = 'transparent';
        passiveButton.style.color = 'white';
        field.style.display = 'flex';
        field.classList.add('activeField');
        activeButton.style.backgroundColor = 'white';
        activeButton.style.color = 'black';
    }

    if (authorization.style.display !== 'none') {
        authorization.addEventListener('click', () => change(authField, regField, authorization, registration));
    }
    if (registration.style.display !== 'none') {
        registration.addEventListener('click', () => change(regField, authField, registration, authorization));
    }
    // Error function

    const inputError = (input, errorInputPlaceholder) => {
        if (input.classList.contains('correct')) {
            input.classList.remove('correct');
        }
        input.classList.add('errorPlaceholder');
        input.setAttribute('placeholder', `${errorInputPlaceholder}`);
        if (input.value.length > 0) {
            input.value = '';
        }
    }

    // Correct function

    const inputCorrect = (input) => {
        if (input.classList.contains('errorPlaceholder')) {
            input.classList.remove('errorPlaceholder');
        }
        input.classList.add('correct');
    }

    // Registration

    const userRegistration = () => {
        // Regexes

        let res = /^[a-zA-Z]+$/;
        let re = /\S+@\S+\.\S+/;

        // Input constants

        const name = document.querySelector('.nameInput');
        const surname = document.querySelector('.surnameInput');
        const email = document.querySelector('.mailInput');
        const password = document.querySelector('.passwordInput');
        const confirmPassword = document.querySelector('.confirmPasswordInput');

        //checks

        let nameCheck = false;
        let surnameCheck = false;
        let emailCheck = false;
        let passwordCheck = false;
        let passwordComfirmCheck = false;


        if (name.value.length === 0) {
            inputError(name, 'Write name');
        } else if (!res.test(name.value)) {
            inputError(name, 'Use only letters');
        } else {
            inputCorrect(name);
            nameCheck = true;
            surname.focus();
            name.setAttribute('placeholder', 'Name');
        }

        if (surname.value.length === 0) {
            inputError(surname, 'Write surname');
        } else if (!res.test(surname.value)) {
            inputError(surname, 'Use only letters');
        } else {
            inputCorrect(surname);
            surnameCheck = true;
            email.focus();
            surname.setAttribute('placeholder', 'Surname');
        }

        if (email.value.length === 0) {
            inputError(email, 'Write email');
        } else if (!re.test(email.value)) {
            inputError(email, 'Write correct email');
        } else {
            inputCorrect(email);
            emailCheck = true;
            password.focus();
            email.setAttribute('placeholder', 'Email');
        }

        if (password.value.length === 0) {
            inputError(password, 'Write password');
        } else if (password.value.length < 8) {
            inputError(password, 'Length must be more than 8');
        } else {
            inputCorrect(password);
            passwordCheck = true;
            confirmPassword.focus();
            password.setAttribute('placeholder', 'Password');
        }
        if (confirmPassword.value.length === 0) {
            inputError(confirmPassword, 'Confirm password');
        } else if (confirmPassword.value === password.value) {
            inputCorrect(confirmPassword);
            passwordComfirmCheck = true;
            confirmPassword.setAttribute('placeholder', 'Confirm password');
        } else {
            inputError(confirmPassword, 'Passwords do not match');
        }

        if (nameCheck === true && surnameCheck === true && emailCheck === true && passwordCheck === true && passwordComfirmCheck === true) {
            createUserWithEmailAndPassword(auth, email.value, password.value)
                .then(() => {
                    window.location.href = 'main.html';
                })
                .catch((error) => {
                    if (error.code === 'auth/email-already-in-use') {
                        inputError(email, 'Email already in use');
                    } else if (error.code === 'auth/invalid-email') {
                        inputError(email, 'Invalid email');
                    } else if (error.code === 'auth/weak-password') {
                        inputError(password, 'Weak password');
                    } else {
                        alert(error.message);
                    }
                })

        }
    }

    signUpButton.addEventListener('click', userRegistration);

    // User autharization

    const userAutharization = () => {
        const email = document.querySelector('.loginMail');
        const password = document.querySelector('.loginPassword');

        if (email.value.length === 0 && password.value.length === 0) {
            inputError(email, 'Fill in the field');
            inputError(password, 'Fill in the field');
            return;
        } else {
            inputCorrect(email);
            inputCorrect(password);
        }

        signInWithEmailAndPassword(auth, email.value, password.value)
            .then(() => {
                window.location.href = 'main.html';
            })
            .catch((error) => {
                if (error.code === 'auth/user-not-found') {
                    inputError(email, 'User not found');
                } else {
                    inputError(email, 'Incorrect email or password');
                    inputError(password, 'Incorrect email or password');
                }
            })


    }

    // Login button listener

    const loginButton = document.getElementById('loginButton');

    loginButton.addEventListener('click', userAutharization);


    // Keydown

    window.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            if (regField.style.display !== 'none') {
                userRegistration();
            } else {
                userAutharization();
            }
        }
    })
})