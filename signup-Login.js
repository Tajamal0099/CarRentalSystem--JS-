import { createDashboard } from './admin-dashboard.js';
import { createOwnerDashboard } from './owner-dashboard.js';
import { createCustomerDashboard } from './customer-dashboard.js';
import { hideWelcomePage } from './main.js';

function initCarRentalDatabase() {
    const request = indexedDB.open('CarRentalSystem', 1);

    request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create 'admin' store and add default admin data
        const adminStore = db.createObjectStore('admin', { keyPath: 'email' });
        adminStore.transaction.oncomplete = () => {
            const adminTransaction = db.transaction('admin', 'readwrite').objectStore('admin');
            adminTransaction.add({ email: 'admin123', password: '123' });
        };

        // Create 'customer' store with keyPath 'email'
        if (!db.objectStoreNames.contains('customer')) {
            db.createObjectStore('customer', { keyPath: 'email' });
        }
        // Create 'carOwner' store with keyPath 'email'
        if (!db.objectStoreNames.contains('carOwner')) {
            db.createObjectStore('carOwner', { keyPath: 'email' });
        }
        if (!db.objectStoreNames.contains('cars')) {
            // db.createObjectStore('cars', { keyPath: 'email' });
            db.createObjectStore('cars', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('bookings')) {
            // db.createObjectStore('cars', { keyPath: 'email' });
            db.createObjectStore('bookings', { keyPath: 'id', autoIncrement: true });
        }
    };

    request.onsuccess = () => {
        console.log('CarRentalSystem database initialized successfully');
    };

    request.onerror = (event) => {
        console.error('Error initializing CarRentalSystem database:', event.target.error);
    };
}


// Initialize the database on page load
initCarRentalDatabase();
async function checkEmailExists(email) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('CarRentalSystem', 1);
        request.onsuccess = (event) => {
            const db = event.target.result;

            // Check both 'customer' and 'carOwner' stores
            const transaction = db.transaction(['customer', 'carOwner'], 'readonly');
            const customerStore = transaction.objectStore('customer');
            const ownerStore = transaction.objectStore('carOwner');

            let emailFound = false;

            const checkStore = (store) => {
                return new Promise((res, rej) => {
                    const cursorRequest = store.openCursor();
                    cursorRequest.onsuccess = (e) => {
                        const cursor = e.target.result;
                        if (cursor) {
                            if (cursor.value.email === email) {
                                emailFound = true;
                                res(true);
                            } else {
                                cursor.continue();
                            }
                        } else {
                            res(false);
                        }
                    };
                    cursorRequest.onerror = () => rej('Error searching for email');
                });
            };
            Promise.all([checkStore(customerStore), checkStore(ownerStore)])
                .then(() => resolve(emailFound))
                .catch(err => reject(err));
        };
        request.onerror = () => reject('Failed to open the database');
    });
}
function createPopup() {
    // Create the overlay
    const popupOverlay = document.createElement('div');
    popupOverlay.id = 'customPopup';
    popupOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center z-50';

    // Create the popup container
    const popupContainer = document.createElement('div');
    popupContainer.className = 'bg-white rounded-lg shadow-lg p-6 max-w-xs w-full';

    // Create the message paragraph
    const popupMessage = document.createElement('p');
    popupMessage.id = 'popupMessage';
    popupMessage.className = 'text-gray-800 text-lg mb-4';

    // Create the close button
    const closeButton = document.createElement('button');
    closeButton.id = 'popupClose';
    closeButton.className = 'bg-black hover:bg-gray-800 text-white px-4 py-2 rounded';
    closeButton.textContent = 'Close';

    // Append the message and button to the container
    popupContainer.appendChild(popupMessage);
    popupContainer.appendChild(closeButton);

    // Append the container to the overlay
    popupOverlay.appendChild(popupContainer);

    // Append the overlay to the body
    document.body.appendChild(popupOverlay);

    // Add the event listener to the close button
    closeButton.addEventListener('click', hidePopup);
}

function showPopup(message) {
    // Ensure the popup exists
    let popup = document.getElementById('customPopup');
    if (!popup) {
        createPopup();
        popup = document.getElementById('customPopup'); // Re-fetch after creation
    }

    const popupMessage = document.getElementById('popupMessage');
    popupMessage.textContent = message; // Set the popup message
    popup.classList.remove('hidden');  // Make the popup visible
}

function hidePopup() {
    const popup = document.getElementById('customPopup');
    if (popup) {
        popup.classList.add('hidden'); // Hide the popup
    }
}
async function storeInIndexedDB(storeName, data) {
    try {
        // Check if the email already exists in any store
        const emailExists = await checkEmailExists(data.email);
        // Example usage
        if (emailExists) {
            showPopup('An account with this email already exists.');
            return false; // Stop the process if the email is found
        }
        const request = indexedDB.open('CarRentalSystem', 1);
        return new Promise((resolve, reject) => {
            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction(storeName, 'readwrite');
                const store = transaction.objectStore(storeName);
                const addRequest = store.add(data);

                addRequest.onsuccess = () => {
                    resolve(true);
                };
                addRequest.onerror = () => {
                    alert('Failed to store data.');
                    resolve(false);
                };
            };
            request.onerror = () => {
                alert('Failed to open the database');
                resolve(false);
            };
        });
    } catch (error) {
        console.error(error);
        return false;
    }
}
export function createAccountPage() {
    const body = document.body;
    const createAccountSection = document.createElement('div');
    createAccountSection.id = "createAccountSection";
    createAccountSection.className = "overflow-hidden hidden flex flex-col lg:flex-row";
    body.appendChild(createAccountSection);
    const leftSection = document.createElement('div');
    leftSection.className = "md:p-8 p-3 lg:p-12 flex flex-col w-full lg:w-[40%]";
    createAccountSection.appendChild(leftSection);
    const logoContainer = document.createElement('div');
    logoContainer.className = "md:mb-6 mb-12";
    leftSection.appendChild(logoContainer);
    const logo = document.createElement('div');
    logo.className = 'cursor-pointer w-24'
    const logoImg = document.createElement('img');
    logoImg.src = "./assets/l1.png"; // Update with correct image path
    logoImg.alt = "Untitled UI Logo";
    logoImg.className = "mb-8 rounded-md w-24";
    logo.appendChild(logoImg);
    logoContainer.appendChild(logo);
    // Add a click event listener to reload the page
    // Add a click event listener to reload the page
    logo.addEventListener('click', () => {
        location.reload(); // Reloads the page
    });

    const title = document.createElement('h1');
    title.className = "text-3xl font-semibold text-gray-900 mb-2";
    title.textContent = "Create an account";
    logoContainer.appendChild(title);

    const subtitle = document.createElement('p');
    subtitle.className = "text-gray-500 md:mb-8 mb-0";
    subtitle.textContent = "Let's get started with your 30 day free trial.";
    logoContainer.appendChild(subtitle);

    const form = document.createElement('form');
    form.className = "space-y-4";
    leftSection.appendChild(form);
    const checkboxDiv = document.createElement('div');
    checkboxDiv.className = 'flex'
    const customerCheckbox = createCheckbox("customer", "Customer");
    const ownerCheckbox = createCheckbox("carOwner", "Car Owner");
    checkboxDiv.appendChild(customerCheckbox);
    checkboxDiv.appendChild(ownerCheckbox);
    form.appendChild(checkboxDiv)
    const emailInput = createInput("text", "Email");
    form.appendChild(emailInput);

    const passwordInput = createInput("password", "Password");
    form.appendChild(passwordInput);

    const createAccountButton = document.createElement('button');
    createAccountButton.type = "submit"; // Ensure the button submits the form
    createAccountButton.className = "w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition";
    createAccountButton.textContent = "Create account";
    form.appendChild(createAccountButton);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const isCustomerChecked = customerCheckbox.querySelector('input').checked;
        const isOwnerChecked = ownerCheckbox.querySelector('input').checked;

        if (!email || !password) {
            // alert('Please fill in all fields.');
            showPopup('Please fill in all fields.');

            return;
        }

        if (!isCustomerChecked && !isOwnerChecked) {
            // alert('Please select at least one checkbox.');
            showPopup('Please select at least one checkbox.');

            return;
        }

        let storedSuccessfully = false;
        if (isCustomerChecked) {
            storedSuccessfully = await storeInIndexedDB('customer', { email, password });
        }
        if (isOwnerChecked) {
            storedSuccessfully = await storeInIndexedDB('carOwner', { email, password });
        }

        if (storedSuccessfully) {
            emailInput.value = '';
            passwordInput.value = '';
            customerCheckbox.querySelector('input').checked = false;
            ownerCheckbox.querySelector('input').checked = false;
            showLoginSection();
        }
    });
    const loginLink = document.createElement('p');
    loginLink.className = "md:mt-7 mt-3 text-md text-center text-gray-500";
    loginLink.innerHTML = `Already have an account? <a href="#" id="toLoginLink" class="text-gray-900 font-semibold">Log in</a>`;
    leftSection.appendChild(loginLink);

    const rightSection = document.createElement('div');
    rightSection.id = 'rightsection'
    rightSection.className = "relative w-full lg:w-full h-screen pr-3 bg-white flex items-center justify-center";
    createAccountSection.appendChild(rightSection);

    // const testimonialImage = document.createElement('img');
    // testimonialImage.id = "image1"
    // testimonialImage.src = "./assets/wallpaperflare.com_wallpaper (6).jpg"; // Update with correct image path
    // testimonialImage.alt = "Testimonial";
    // testimonialImage.className = "w-full h-full object-cover md:rounded-l-[30px]";
    const video2 = document.createElement('video');
    video2.src = './assets/158316-816359649.mp4'; // Reference to the uploaded video
    video2.className = 'w-full rounded-lg shadow-xl';
    video2.autoplay = true;
    video2.loop = false;
    video2.muted = true; // Ensures it plays without sound
    video2.playsInline = true;
    rightSection.appendChild(video2);

    const loginSection = document.createElement('div');
    loginSection.id = "loginSection";
    loginSection.className = "hidden overflow-hidden flex md:flex-col flex-col-reverse lg:flex-row";
    body.appendChild(loginSection);

    const testimonialLeftSection = document.createElement('div');
    testimonialLeftSection.id = 'leftsection'
    testimonialLeftSection.className = "relative z-10 w-full lg:w-full h-screen pl-3 flex items-center justify-center";
    loginSection.appendChild(testimonialLeftSection);

    // const testimonialLeftImage = document.createElement('img');
    // testimonialLeftImage.id = 'image2'
    // testimonialLeftImage.src = "./assets/wallpaperflare.com_wallpaper (6).jpg"; // Update with correct image path
    // testimonialLeftImage.alt = "Testimonial";
    // testimonialLeftImage.className = "w-full h-full object-cover md:rounded-r-[30px]";
    // testimonialLeftSection.appendChild(testimonialLeftImage);
    const video = document.createElement('video');
    video.src = './assets/158316-816359649.mp4'; // Reference to the uploaded video
    video.className = 'w-full rounded-lg shadow-xl';
    video.autoplay = true;
    video.loop = false;
    video.muted = true; // Ensures it plays without sound
    video.playsInline = true; // Optimizes for mobile playback

    // Append the video to the description area
    testimonialLeftSection.appendChild(video);
    const loginFormSection = document.createElement('div');
    loginFormSection.id = 'loginform'
    loginFormSection.className = "md:p-8 p-3 lg:p-12 flex flex-col w-full lg:w-[40%]";
    loginSection.appendChild(loginFormSection);

    const loginLogoContainer = document.createElement('div');
    loginLogoContainer.className = "mb-6";
    loginFormSection.appendChild(loginLogoContainer);
    const logo2 = document.createElement('div');
    logo2.className = 'cursor-pointer w-24'
 
    const loginLogoImg = document.createElement('img');
    loginLogoImg.src = "./assets/l1.png"; // Update with correct image path
    loginLogoImg.alt = "Untitled UI Logo";
    loginLogoImg.className = "mb-8 rounded-md w-24";
    logo2.appendChild(loginLogoImg);
    loginLogoContainer.appendChild(logo2);
    logo2.addEventListener('click', () => {
        location.reload(); // Reloads the page
    });
    const loginTitle = document.createElement('h1');
    loginTitle.className = "text-3xl font-semibold text-gray-900 mb-2";
    loginTitle.textContent = "Log In";
    loginLogoContainer.appendChild(loginTitle);

    const loginSubtitle = document.createElement('p');
    loginSubtitle.className = "text-gray-500 md:mb-8 mb-8";
    loginSubtitle.textContent = "Welcome back! Please enter your details.";
    loginLogoContainer.appendChild(loginSubtitle);

    const loginForm = document.createElement('form');
    loginForm.className = "md:space-y-8 space-y-4 md:mb-0 mb-6";
    loginFormSection.appendChild(loginForm);

    const loginEmailInput = createInput("text", "Email");
    loginEmailInput.id = "loginEmail";
    loginForm.appendChild(loginEmailInput);


    const loginPasswordInput = createInput("password", "Password");
    loginPasswordInput.id = "loginPassword";
    loginForm.appendChild(loginPasswordInput);

    const loginButton = document.createElement('button');
    loginButton.id = "loginButton"
    loginButton.className = "w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition";
    loginButton.textContent = "Log In";
    loginForm.appendChild(loginButton);

    const signUpLink = document.createElement('p');
    signUpLink.className = "md:mt-16 mt-0 text-md text-center text-gray-500";
    signUpLink.innerHTML = `Don't have an account? <a href="#" id="toSignUpLink" class="text-gray-900 font-semibold">Sign Up</a>`;
    loginFormSection.appendChild(signUpLink);

    document.getElementById('toLoginLink').addEventListener('click', (e) => {
        e.preventDefault();
        showLoginSection();
    });

    document.getElementById('toSignUpLink').addEventListener('click', (e) => {
        e.preventDefault();
        showCreateAccountSection();
    });
}

function createInput(type, placeholder) {
    const input = document.createElement('input');
    input.type = type;
    input.placeholder = placeholder;
    input.className = "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-yellow-500";
    return input;
}

function createCheckbox(id, label) {
    const container = document.createElement('div');
    container.className = "flex w-full justify-between relative";

    const checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.id = id;
    checkbox.className = "absolute left-3 top-4";

    // Add an event listener to uncheck other checkboxes when this one is checked
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            // Get all checkboxes on the page
            const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
            allCheckboxes.forEach((cb) => {
                if (cb !== checkbox) {
                    cb.checked = false; // Uncheck other checkboxes
                }
            });
        }
    });
    const labelElement = document.createElement('label');
    labelElement.htmlFor = id;
    labelElement.textContent = label;
    labelElement.className = "text-gray-700 font-semibold pl-10 pt-3 w-[97%] cursor-pointer h-12 rounded border";
    container.appendChild(checkbox);
    container.appendChild(labelElement);
    return container;
}

export function showLoginSection() {
    const createAccountSection = document.getElementById('createAccountSection');
    const loginSection = document.getElementById('loginSection');
    const rightSection = document.getElementById('rightsection');
    const leftSection = createAccountSection.querySelector('.flex.flex-col');
    // Apply sliding animations if elements are valid
    rightSection.classList.add('slide-to-left');
    leftSection.classList.add('slide-to-right');

    // Wait for the animation to complete before toggling visibility
    setTimeout(() => {
        createAccountSection.classList.add('hidden');
        rightSection.classList.remove('slide-to-left');
        leftSection.classList.remove('slide-to-right');

        // Show and apply fade-in effect to the login section
        loginSection.classList.remove('hidden');
    }, 500); // Ensure this matches your CSS animation duration

    // Prevent adding duplicate event listeners
    const loginButton = document.getElementById('loginButton');
    if (loginButton && !loginButton.dataset.listenerAdded) {
        loginButton.dataset.listenerAdded = 'true'; // Mark listener as added
        loginButton.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogin();
        });
    }
}
async function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!email || !password) {
        // alert('Please enter both email and password.');
        showPopup('Please enter both email and password.');

        return;
    }

    const userType = await getUserType(email, password);
    if (userType) {
        localStorage.setItem('loggedInUser', JSON.stringify({ email, userType }));
        document.body.innerHTML = '';
        loadDashboard(userType);
    } else {
        // alert('Invalid login credentials');
        showPopup('Invalid login credentials');

    }
}
function loadDashboard(userType) {
    if (userType === 'admin') {
        document.body.appendChild(createDashboard());
    } else if (userType === 'carOwner') {
        document.body.appendChild(createOwnerDashboard());
    } else if (userType === 'customer') {
        document.body.appendChild(createCustomerDashboard());
    }
}
async function getUserType(email, password) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('CarRentalSystem', 1);

        request.onsuccess = (event) => {
            const db = event.target.result;

            // Check if user is an admin
            const adminStore = db.transaction('admin', 'readonly').objectStore('admin');
            const adminRequest = adminStore.get(email);
            adminRequest.onsuccess = () => {
                if (adminRequest.result && adminRequest.result.password === password) {
                    resolve('admin');
                } else {
                    // Check if user is a car owner
                    const carOwnerStore = db.transaction('carOwner', 'readonly').objectStore('carOwner');
                    const carOwnerRequest = carOwnerStore.get(email);
                    carOwnerRequest.onsuccess = () => {
                        if (carOwnerRequest.result && carOwnerRequest.result.password === password) {
                            if (carOwnerRequest.result.status === 'blocked') {
                                // alert('Your account has been blocked.');
                                showPopup('Your account has been blocked.');

                                resolve(null);
                            } else {
                                resolve('carOwner');
                            }
                        } else {
                            // Check if user is a customer
                            const customerStore = db.transaction('customer', 'readonly').objectStore('customer');
                            const customerRequest = customerStore.get(email);
                            customerRequest.onsuccess = () => {
                                if (customerRequest.result && customerRequest.result.password === password) {
                                    if (customerRequest.result.status === 'blocked') {
                                        // alert('Your account has been blocked.');
                                        showPopup('Your account has been blocked.');

                                        resolve(null);
                                    } else {
                                        resolve('customer');
                                    }
                                } else {
                                    resolve(null);
                                }
                            };
                        }
                    };
                }
            };
        };
    });
}

export function showCreateAccountSection() {
    const createAccountSection = document.getElementById('createAccountSection');
    const loginSection = document.getElementById('loginSection');
    const rightSection = document.getElementById('leftsection');
    const leftSection = document.getElementById('loginform');
    // Apply sliding animations if elements are valid
    leftSection.classList.add('slide2-to-left');
    rightSection.classList.add('slide2-to-right');

    // Wait for the animation to complete before toggling visibility
    setTimeout(() => {
        loginSection.classList.add('fade-in');
        createAccountSection.classList.remove('hidden');
        rightSection.classList.remove('slide2-to-right');
        leftSection.classList.remove('slide2-to-left');

        // Show and apply fade-in effect to the login section
        loginSection.classList.add('hidden');
    }, 500); // Ensure this matches your CSS animation duration

}

window.addEventListener('load', () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        loadDashboard(loggedInUser.userType);
        hideWelcomePage()
    }
});