let isManageCarsSectionActive = false;
export function createOwnerDashboard() {

    const dashboardContainer = document.createElement('div');
    dashboardContainer.className = 'flex flex-col min-h-screen bg-white md:flex-row';
    dashboardContainer.id = 'dashboardContainer';

    // Header for small screens
    const header = document.createElement('header');
    header.className = 'flex justify-between items-center bg-gray-100 text-black p-4 md:hidden';

    // Menu icon button
    const menuButton = document.createElement('button');
    menuButton.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>';
    menuButton.className = 'focus:outline-none';

    // Title for the header
    const headerTitle = document.createElement('h1');
    headerTitle.textContent = 'Dashboard';
    headerTitle.className = 'text-xl font-bold';

    // Logout button in the header

    header.appendChild(headerTitle);
    header.appendChild(menuButton);
    // header.appendChild(logoutButton);

    // Sidebar container
    const sidebar = document.createElement('div');
    sidebar.className = 'w-64 bg-white text-black border-r h-screen space-y-4 flex flex-col p-4 pt-10 hidden md:block';
    sidebar.id = 'sidebar';
    // Sidebar title
    const sidebarTitle = document.createElement('h2');
    sidebarTitle.className = 'text-xl font-bold mb-4';
    sidebarTitle.textContent = 'Dashboard Menu';
    sidebar.appendChild(sidebarTitle);
    const dropdownMenu = document.createElement('div');
    dropdownMenu.className = 'fixed top-16 text-black rounded-b-lg left-0 w-full bg-gray-100 z-30 flex flex-col space-y-2 p-4 transition-all duration-300 ease-in-out opacity-0 transform scale-y-0 origin-top';
    dropdownMenu.id = 'dropdownMenu';
    const sidebarButtons = [
        {
            text: 'Dashboard',
            action: () => {
                createOwnerDashboard();
            }
        },
        {
            text: 'Add Cars',
            action: () => {
                showAddCarForm();
            }
        },
        {
            text: 'Manage Cars',
            action: () => {
                showManageCars();
            }
        },
        {
            text: 'Manage Booking List',
            action: () => {
                createManageBookingsSection()
            }
        }
    ];

    sidebarButtons.forEach(buttonData => {
        const button = document.createElement('button');
        button.className = 'w-full text-left px-4 py-2 font-semibold hover:bg-blue-50 hover:text-blue-700 rounded-lg transition';
        button.textContent = buttonData.text;
        button.onclick = buttonData.action;
        sidebar.appendChild(button);
    });


    // Menu items for the sidebar
    const dropdownItems = [
        { text: 'Dashboard', action: createOwnerDashboard },
        { text: 'Add Cars', action: showAddCarForm },
        { text: 'Manage Cars', action: showManageCars },
        { text: 'Manage Booking List', action: createManageBookingsSection }
    ];

    dropdownItems.forEach(item => {
        const button = document.createElement('button');
        button.className = 'hover:bg-blue-100 hover:text-blue-700 text-black font-bold py-2 px-4 rounded mb-2 transition';
        button.textContent = item.text;
        button.onclick = item.action;
        dropdownMenu.appendChild(button);
        // sidebar.appendChild(button)
    });
    // Add logout button at the end of the sidebar
    const sidebarLogoutButton = document.createElement('button');
    sidebarLogoutButton.className = 'text-sm px-4 py-2 bg-red-600 md:w-48 md:absolute md:bottom-5 md:left-7 text-white rounded-lg transition';
    sidebarLogoutButton.textContent = 'Logout';
    sidebarLogoutButton.addEventListener('click', () => {
        localStorage.removeItem('loggedInUser');
        document.body.innerHTML = ''; // Clear dashboard content
        location.reload(); // Refresh the page
    });
    sidebar.appendChild(sidebarLogoutButton);


    let isDropdownVisible = false;
    menuButton.addEventListener('click', () => {
        isDropdownVisible = !isDropdownVisible;
        if (isDropdownVisible) {
            dropdownMenu.classList.remove('opacity-0', 'scale-y-0');
            dropdownMenu.classList.add('opacity-100', 'scale-y-100');
            dropdownMenu.style.display = 'flex';
        } else {
            dropdownMenu.classList.remove('opacity-100', 'scale-y-100');
            dropdownMenu.classList.add('opacity-0', 'scale-y-0');
            dropdownMenu.style.display = 'none';
        }
    });

    dashboardContainer.appendChild(dropdownMenu)
    // Main content area
    const contentContainer = document.createElement('div');
    contentContainer.className = 'flex-1';

    // Main content
    // Create the mainContent div
    const mainContent = document.createElement('div');
    mainContent.classList.add('flex-1', 'p-6', 'overflow-y-auto');
    const dashboardHeader = document.createElement('div');
    dashboardHeader.className = 'flex justify-between items-center mb-6';

    const title = document.createElement('h1');
    title.className = 'text-3xl font-bold text-gray-800';
    title.textContent = 'Dashboard';
    dashboardHeader.appendChild(title);


    mainContent.appendChild(dashboardHeader);
    const statsContainer = document.createElement('div');
    statsContainer.className = 'grid grid-cols-1 md:grid-cols-3 gap-6 mb-6';
    statsContainer.id = 'stats-container';
    mainContent.appendChild(statsContainer);

    // Function to fetch stats for the logged-in owner
    function fetchStoreStatsForOwner(loggedInOwnerEmail, callback) {
        const request = indexedDB.open('CarRentalSystem', 1);
    
        request.onsuccess = function (event) {
            const db = event.target.result;
    
            // Helper function to count data based on a condition
            function fetchCount(storeName, conditionCallback) {
                return new Promise((resolve, reject) => {
                    const transaction = db.transaction(storeName, 'readonly');
                    const store = transaction.objectStore(storeName);
                    const getAllRequest = store.getAll();
    
                    getAllRequest.onsuccess = function () {
                        const items = getAllRequest.result;
    
                        const count = items.filter(conditionCallback).length;
    
                        resolve(count);
                    };
    
                    getAllRequest.onerror = function () {
                        console.error(`Error fetching data from ${storeName}`);
                        reject(`Error fetching data from ${storeName}`);
                    };
                });
            }
    
            // Fetch total returned cars
            const returnedCarsPromise = fetchCount('bookings', booking => {
                return booking.status === 'Returned' && JSON.parse(booking.ownerUsername).email === loggedInOwnerEmail;
            });
    
            // Fetch total pending approvals
            const pendingApprovalsPromise = fetchCount('bookings', booking => {
                return booking.status === 'Pending' && JSON.parse(booking.ownerUsername).email === loggedInOwnerEmail;
            });
    
            // Fetch total approved bookings
            const approvedBookingsPromise = fetchCount('bookings', booking => {
                return booking.status === 'Booked' && JSON.parse(booking.ownerUsername).email === loggedInOwnerEmail;
            });
    
            // Wait for all promises to resolve
            Promise.all([returnedCarsPromise, pendingApprovalsPromise, approvedBookingsPromise])
                .then(([returnedCars, pendingApprovals, approvedBookings]) => {
    
                    const stats = {
                        returnedCars,
                        pendingApprovals,
                        approvedBookings,
                    };
    
                    callback(stats);
                })
                .catch(error => {
                    console.error('Error fetching stats:', error);
                    callback(null);
                });
        };
    
        request.onerror = function () {
            console.error('Error opening IndexedDB');
            callback(null);
        };
    }
    
    // Function to render the stats as cards
    function renderStats(loggedInOwnerEmail) {
        fetchStoreStatsForOwner(loggedInOwnerEmail, function (stats) {
            if (!stats) {
                console.error('Failed to fetch stats.');
                return;
            }

            const { returnedCars, pendingApprovals, approvedBookings } = stats;
            const statsData = [
                {
                    title: 'Total Returned Cars',
                    value: returnedCars,
                    description: 'The total number of cars returned by customers.',
                    icon: '🔄',
                },
                {
                    title: 'Pending Approvals',
                    value: pendingApprovals,
                    description: 'The total number of bookings waiting for your approval.',
                    icon: '⏳',
                },
                {
                    title: 'Approved Bookings',
                    value: approvedBookings,
                    description: 'The total number of bookings you have approved.',
                    icon: '✅',
                },
            ];

            // Render the cards
            const container = document.getElementById('stats-container');
            container.innerHTML = statsData
                .map(
                    (stat) => `
                        <div class="card border flex gap-3 justify-between items-center shadow-lg p-4 rounded-md text-center bg-white">
                            <div class="text-3xl">${stat.icon}</div>
                            <div class="text-start"> 
                            <h3 class="text-lg font-bold mt-2">${stat.title}</h3>
                            <p class="text-sm text-gray-500 mt-2">${stat.description}</p>
                            </div>
                            <p class="text-2xl font-semibold mt-1">${stat.value}</p>
                        </div>
                    `
                )
                .join('');
        });
    }

    const loggedInUser = localStorage.getItem('loggedInUser'); // Replace 'loggedInUser' with the actual key

    if (loggedInUser) {
        // Parse the JSON string to get the object
        const user = JSON.parse(loggedInUser);

        // Access the email property and call renderStats
        if (user.email) {
            renderStats(user.email);
        } else {
            console.error('Email not found in the logged-in user data.');
        }
    } else {
        console.error('No logged-in user data found in localStorage.');
    }




    // Charts Section
    const chartsContainer = document.createElement('div');
    chartsContainer.className = 'grid grid-cols-1 md:grid-cols-2 gap-10';

    const barChartContainer = document.createElement('div');
    barChartContainer.className = 'p-6 bg-white md:w-[47%] shadow-xl rounded-lg relative';

    const barChartTitle = document.createElement('h2');
    barChartTitle.className = 'text-xl font-semibold text-gray-800 mb-4';
    barChartTitle.textContent = 'Overview';
    barChartContainer.appendChild(barChartTitle);

    // Placeholder for bar chart
    const barChartCanvas = document.createElement('canvas');
    barChartCanvas.id = 'availabilityChart';
    barChartCanvas.className = 'w-[200px] h-[200px]'
    barChartContainer.appendChild(barChartCanvas);
    // Description Section
    const descriptionArea = document.createElement('div');
    descriptionArea.className = 'bg-white  shadow-xl rounded-lg h-fit';

    // Add Video Element
    const video = document.createElement('video');
    video.src = './assets/88481-606110665.mp4'; // Reference to the uploaded video
    video.className = 'w-full rounded-lg shadow-xl';
    video.autoplay = true;
    video.loop = true;
    video.muted = true; // Ensures it plays without sound
    video.playsInline = true; // Optimizes for mobile playback

    // Append the video to the description area
    descriptionArea.appendChild(video);
    // Append to the charts container
    chartsContainer.appendChild(descriptionArea);
    chartsContainer.appendChild(barChartContainer);

    // mainContent.appendChild(chartsContainer);

    mainContent.appendChild(chartsContainer);
    // Append main content to the dashboard container
    contentContainer.appendChild(mainContent);

    // Render charts after DOM is ready
    setTimeout(() => {
        // renderBarChart();
        renderAvailabilityChart()
        // renderPieChart();
    }, 100);

    // Form and cards container
    const formMainDiv = document.createElement('div');
    formMainDiv.className = 'hidden bg-[#f9fafb] p-4 md:p-0 pt-20 md:pt-4 flex min-h-screen flex-wrap gap-6 justify-center md:justify-start w-full flex-row';

    const cardContainer = document.createElement('div');
    cardContainer.className = 'bg-[#f9fafb] flex flex-wrap gap-4 justify-center rounded-lg h-fit w-full max-w-4xl';

    const formContainer = document.createElement('div');
    formContainer.className = 'bg-white p-8 shadow-lg rounded-lg w-full h-fit border-r md:w-fit max-w-md';
    formContainer.id = 'carFormContainer';

    const formTitle = document.createElement('h2');
    formTitle.className = 'text-2xl font-semibold mb-4';
    formTitle.textContent = 'Add a New Car';
    formContainer.appendChild(formTitle);

    const form = document.createElement('form');
    form.className = 'flex flex-col space-y-4';

    const fields = [
        { label: 'Car Name', type: 'text', id: 'carName' },
        { label: 'Car Image', type: 'file', id: 'carImage' },
        { label: 'Rent per Hour', type: 'number', id: 'carRent' }
    ];

    fields.forEach(field => {
        const fieldContainer = document.createElement('div');
        const label = document.createElement('label');
        label.className = 'block text-gray-700';
        label.textContent = field.label;

        const input = document.createElement('input');
        input.type = field.type;
        input.id = field.id;
        input.className = 'w-full p-2 border rounded';

        fieldContainer.appendChild(label);
        fieldContainer.appendChild(input);
        form.appendChild(fieldContainer);
    });

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = 'px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600';
    submitButton.textContent = 'Submit';
    form.appendChild(submitButton);

    // Back button
    const backButton = document.createElement('button');
    backButton.type = 'button';
    backButton.className = 'px-4 py-2 bg-red-500 absolute right-4 top-3 text-white rounded hover:bg-gray-600 mt-2';
    backButton.textContent = 'Back';
    backButton.addEventListener('click', () => {
        // Hide the form and display main content
        formMainDiv.style.display = 'none';
        mainContent.style.display = 'block';
        contentContainer.style.display = 'block';

        // Check screen size
        if (window.matchMedia('(min-width: 768px)').matches) {
            // If screen size is medium or larger, show sidebar and hide header
            header.style.display = 'none';
            sidebar.style.display = 'flex';
        } else {
            // If screen size is smaller than medium, show header and hide sidebar
            header.style.display = 'flex';
            sidebar.style.display = 'none';
        }

        // Reset dropdown menu visibility
        dropdownMenu.style.display = 'none';
        highlightButton(null);
    });


    formContainer.appendChild(backButton);
    formContainer.appendChild(form);
    formMainDiv.appendChild(formContainer);
    formMainDiv.appendChild(cardContainer);

    // Load existing cars from IndexedDB on page load
    function loadExistingCars(db) {
        // Clear previous cards to avoid duplication
        cardContainer.innerHTML = '';
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        const loggedInEmail = loggedInUser.email; // Extract only the email
        const transaction = db.transaction('cars', 'readonly');
        const carStore = transaction.objectStore('cars');
        const request = carStore.openCursor();

        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                const carData = cursor.value;
                // Compare the owner email with the logged-in user's email
                if (JSON.parse(carData.owner).email === loggedInEmail) {
                    createCarCard(carData.name, carData.image, carData.rent, carData.id);
                }
                cursor.continue();
            }
        };
        request.onerror = () => {
            console.error('Error reading from the database:', request.error);
        };
    }
    function createCarCard(carName, carImageURL, carRent, carId) {
        const newCarCard = document.createElement('div');
        newCarCard.className = 'car-card bg-white shadow-md rounded-lg overflow-hidden max-w-sm w-full font-sans text-left mb-6 border border-gray-200';

        newCarCard.id = `car-card-${carId}`;
        newCarCard.innerHTML = `
            <!-- Card Header -->
            <!-- Car Image -->
            <img src="${carImageURL}" alt="${carName}" class="w-full h-48 object-cover">
            
            <div class="p-4 flex items-center justify-between">
                <div class="flex items-center gap-1">
                    <span class="text-yellow-500 text-lg">⭐</span>
                    <span class="text-gray-500 text-sm">(109)</span>
                </div>
                <div class="bg-green-100 text-green-600 text-sm px-2 py-1 rounded-md">Added</div>
            </div>
            
            <!-- Card Content -->
            <div class="p-4">
                <h3 class="text-lg font-bold text-gray-900">${carName}</h3>
                <p class="text-sm text-gray-600">1.5 EcoBlue MT Titanium X</p>
                <p class="text-xl font-semibold text-gray-900 mt-2">$${carRent} <span class="text-sm font-light text-gray-500">/ hour</span></p>
            </div>
            
            <!-- Car Details -->
            <div class="px-4 pb-4 flex items-center justify-between text-sm text-gray-500 border-t border-gray-200 pt-2">
                <div class="flex items-center gap-1">
                    <i class="fas fa-car-side text-blue-500"></i>
                    Hatchback
                </div>
                <div class="flex items-center gap-1">
                    <i class="fas fa-cogs text-blue-500"></i>
                    Manual
                </div>
                <div class="flex items-center gap-1">
                    <i class="fas fa-gas-pump text-blue-500"></i>
                    Diesel
                </div>
                <div class="flex items-center gap-1">
                    <i class="fas fa-user-friends text-blue-500"></i>
                    5
                </div>
            </div>
        `;

        const buttonDiv = document.createElement('div');
        buttonDiv.className = 'flex gap-4 justify-center pb-4';

        if (isManageCarsSectionActive) {
            // Delete Button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'px-5 py-2 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 transition';
            deleteButton.onclick = () => {
                deleteCarFromDB(carId, newCarCard);
            };
            buttonDiv.appendChild(deleteButton);

            // Edit Button
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.className = 'px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition';
            editButton.onclick = () => {
                showEditForm(carId, carName, carImageURL, carRent);
            };
            buttonDiv.appendChild(editButton);
        }
        newCarCard.appendChild(buttonDiv);
        cardContainer.appendChild(newCarCard);

        // Append card to container
    }

    function deleteCarFromDB(carId, carCardElement) {
        const dbRequest = indexedDB.open('CarRentalSystem', 1);
    
        dbRequest.onsuccess = () => {
            const db = dbRequest.result;
            const transaction = db.transaction('cars', 'readwrite');
            const carStore = transaction.objectStore('cars');
    
            // Fetch the car to check its status
            const getRequest = carStore.get(carId);
    
            getRequest.onsuccess = () => {
                const car = getRequest.result;
    
                if (car && (car.status === 'Pending' || car.status === 'Booked')) {
                    // Show a popup message if the car is in use
                    showPopup('Car cannot be deleted because it is currently in use (Pending or Booked).');
                } else {
                    // Proceed with deletion if the car is not in use
                    const deleteRequest = carStore.delete(carId);
    
                    deleteRequest.onsuccess = () => {
                        carCardElement.remove(); // Remove the car card from the DOM
                        showPopup('Car successfully deleted.');
                    };
    
                    deleteRequest.onerror = () => {
                        console.error('Error deleting car:', deleteRequest.error);
                        showPopup('Failed to delete the car. Please try again.');
                    };
                }
            };
    
            getRequest.onerror = () => {
                console.error('Error fetching car details:', getRequest.error);
                showPopup('Failed to check car status. Please try again.');
            };
        };
    
        dbRequest.onerror = () => {
            console.error('Error opening database:', dbRequest.error);
            showPopup('Failed to access the database. Please try again.');
        };
    }
    
    // Popup functions for messages
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
    
    function createPopup() {
        const popupOverlay = document.createElement('div');
        popupOverlay.id = 'customPopup';
        popupOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center z-50';
    
        const popupContainer = document.createElement('div');
        popupContainer.className = 'bg-white rounded-lg shadow-lg p-6 max-w-xs w-full';
        const popupMessage = document.createElement('p');
        popupMessage.id = 'popupMessage';
        popupMessage.className = 'text-gray-800 text-lg mb-4';
    
        const closeButton = document.createElement('button');
        closeButton.id = 'popupClose';
        closeButton.className = 'bg-black hover:bg-gray-800 text-white px-4 py-2 rounded';
        closeButton.textContent = 'Close';
    
        popupContainer.appendChild(popupMessage);
        popupContainer.appendChild(closeButton);
    
        popupOverlay.appendChild(popupContainer);
    
        document.body.appendChild(popupOverlay);
    
        closeButton.addEventListener('click', hidePopup);
    }
    
    function hidePopup() {
        const popup = document.getElementById('customPopup');
        if (popup) {
            popup.classList.add('hidden'); // Hide the popup
        }
    }
    

    // IndexedDB setup
    const request = indexedDB.open('CarRentalSystem', 1);

    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('cars')) {
            db.createObjectStore('cars', { keyPath: 'id', autoIncrement: true });
        }
    };

    request.onsuccess = () => {
        const db = event.target.result;
        loadExistingCars(db);
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const carName = document.getElementById('carName').value;
            const carImageInput = document.getElementById('carImage').files[0];
            const carRent = document.getElementById('carRent').value;
            const ownerName = localStorage.getItem('loggedInUser');

            if (carName && carImageInput && carRent && ownerName) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    const carImageURL = event.target.result;
                    const transaction = db.transaction('cars', 'readwrite');
                    const carStore = transaction.objectStore('cars');
                    const carData = { owner: ownerName, name: carName, image: carImageURL, rent: carRent };

                    const addRequest = carStore.add(carData);
                    addRequest.onsuccess = (event) => {
                        createCarCard(carName, carImageURL, carRent, event.target.result);
                        form.reset();
                        contentContainer.style.display = 'block';
                        localStorage.setItem('currentSection', 'dashboard');
                        highlightButton(null);
                    };

                    addRequest.onerror = () => {
                        console.error('Error adding car to the database:', addRequest.error);
                    };
                };
                reader.readAsDataURL(carImageInput);
            } else {
                // alert('Please fill out all fields');
                showPopup('Please fill out all fields');
            }
        });
    };

    request.onerror = () => {
        console.error('Error opening IndexedDB:', request.error);
    };

    function highlightButton(activeButton) {
        const buttons = sidebar.querySelectorAll('button');
        buttons.forEach(button => {
            if (button === activeButton) {
                button.classList.add('bg-gray-700'); // Highlight the active button
                button.classList.remove('transparent');
            } else {
                button.classList.remove('bg-gray-700'); // Remove highlight from other buttons
                button.classList.add('transparent');
            }
        });
    }
    // Function to fetch and display pending bookings for the car owner
    function createManageBookingsSection() {
        formMainDiv.innerHTML = '';
        const loggedInOwner = JSON.parse(localStorage.getItem('loggedInUser'));
        const ownerUsername = loggedInOwner ? loggedInOwner.email : null;

        const request = indexedDB.open('CarRentalSystem', 1);

        request.onsuccess = function (event) {
            const db = event.target.result;
            const transaction = db.transaction(['bookings'], 'readonly');
            const bookingsStore = transaction.objectStore('bookings');

            const ownerBookings = [];

            // Open a cursor to iterate through all bookings
            bookingsStore.openCursor().onsuccess = function (event) {
                const cursor = event.target.result;
                if (cursor) {
                    const booking = cursor.value;

                    try {
                        // Parse the ownerUsername JSON string stored in IndexedDB
                        const bookingOwnerInfo = JSON.parse(booking.ownerUsername);
                        // Compare the parsed email with the provided ownerUsername
                        if (bookingOwnerInfo.email === ownerUsername) {
                            ownerBookings.push(booking);
                        }
                    } catch (error) {
                        console.error("Error parsing ownerUsername JSON:", error);
                    }

                    // Move to the next entry
                    cursor.continue();
                } else {
                    // No more entries; display bookings
                    displayBookingsForApproval(ownerBookings);
                }
            };
        };

        request.onerror = function () {
            console.error("Failed to open IndexedDB.");
        };
    }

    function displayBookingsForApproval(bookings) {
        // Clear previous content to avoid duplications
        formMainDiv.innerHTML = '';
        mainContent.style.display = 'none';
        formMainDiv.style.display = 'block';
        dropdownMenu.style.display = 'none';
        formContainer.style.display = 'none';
        cardContainer.style.display = 'none';
        sidebar.style.display = 'none';
        header.style.display = 'none';
        const bookingsContainer = document.createElement('div');
        bookingsContainer.id = 'bookingsContainer';
        bookingsContainer.className = 'flex flex-wrap gap-4';

        if (bookings.length === 0) {
            const noBookingsMessage = document.createElement('p');
            noBookingsMessage.className = 'text-gray-100 text-xl font-semibold mt-10';
            noBookingsMessage.textContent = 'You have no bookings yet.';
            bookingsContainer.appendChild(noBookingsMessage);
        } else {
            bookings.forEach((booking) => {
                fetchCarDetails(booking.carId)
                    .then(car => {
                        const bookingCard = document.createElement('div');
                        bookingCard.className = 'w-full max-w-sm bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 flex flex-col';

                        // Car Image Container
                        const carImageContainer = document.createElement('div');
                        carImageContainer.className = 'relative';
                        const carImage = document.createElement('img');
                        carImage.src = car ? car.image : 'default-image-url.jpg';
                        carImage.alt = `${car ? car.name : 'Car'} image`;
                        carImage.className = 'w-full h-40 object-cover';

                        // Badge for Status
                        const statusBadge = document.createElement('span');
                        statusBadge.className = `absolute top-2 left-2 bg-${booking.status === 'Awaiting Approval' ? 'yellow' :
                                booking.status === 'Booked' ? 'green' :
                                    booking.status === 'Rejected' ? 'red' : 'blue'
                            }-500 text-white text-xs px-2 py-1 rounded shadow`;
                        statusBadge.textContent = booking.status;

                        carImageContainer.appendChild(carImage);
                        carImageContainer.appendChild(statusBadge);

                        // Booking Info
                        const bookingInfo = document.createElement('div');
                        bookingInfo.className = 'p-4 space-y-2';

                        // Car Name
                        const carName = document.createElement('h2');
                        carName.className = 'text-lg font-semibold text-gray-800';
                        carName.textContent = car ? car.name : 'Car Name Unavailable';

                        // Rating and Distance
                        const carStats = document.createElement('div');
                        carStats.className = 'flex items-center text-gray-500 space-x-4 text-sm';
                        carStats.innerHTML = `
                            <span class="flex items-center space-x-1">
                                ⭐ <strong>${car ? car.rating || '4.5' : 'N/A'}</strong>
                            </span>
                            
                            <span>⏱ ${car ? '120m (4 min)' : 'N/A'}</span>
                        `;

                        // Booking Details with Icons
                        const bookingDetails = document.createElement('div');
                        bookingDetails.className = 'text-sm text-gray-600 flex justify-between';
                        bookingDetails.innerHTML = `
                            <strong>Customer:</strong> ${booking.customerUsername} <br>
                            <strong>Duration:</strong> ${booking.duration.duration} ${booking.duration.type} <br>
                            <strong>Price:</strong> $${car ? car.pricePerHour || '0' : 'N/A'}/hour
                        `;

                        // Icons for Features
                        const features = document.createElement('div');
                        features.className = 'mt-2 flex justify-between items-center text-gray-500 text-sm';
                        features.innerHTML = `
                            <span class="flex items-center space-x-1">
                                🚗 ${car ? car.type || 'Hatchback' : 'N/A'}
                            </span>
                            <span class="flex items-center space-x-1">
                                ⚙️ ${car ? car.transmission || 'Manual' : 'N/A'}
                            </span>
                            <span class="flex items-center space-x-1">
                                ⛽ ${car ? car.fuel || 'Diesel' : 'N/A'}
                            </span>
                            <span class="flex items-center space-x-1">
                                👥 ${car ? car.seats || 5 : 'N/A'}
                            </span>
                        `;

                        // Status Display
                        const statusContainer = document.createElement('div');
                        statusContainer.className = 'mt-2';

                        // Buttons or Status Display
                        if (booking.status === 'Booked') {
                            const approvedButton = document.createElement('button');
                            approvedButton.className = 'bg-green-700 text-white px-4 py-2 rounded';
                            approvedButton.textContent = 'Approved';
                            approvedButton.disabled = true;
                            statusContainer.appendChild(approvedButton);
                        } else if (booking.status === 'Rejected') {
                            const rejectedButton = document.createElement('button');
                            rejectedButton.className = 'bg-red-700 text-white px-4 py-2 rounded';
                            rejectedButton.textContent = 'Rejected';
                            rejectedButton.disabled = true;
                            statusContainer.appendChild(rejectedButton);
                        } else if (booking.status === 'Returned') {
                            const rejectedButton = document.createElement('button');
                            rejectedButton.className = 'bg-blue-700 text-white px-4 py-2 rounded';
                            rejectedButton.textContent = 'Returned';
                            rejectedButton.disabled = true;
                            statusContainer.appendChild(rejectedButton);
                        } else if (booking.status === 'Awaiting Approval') {
                            const returnButton = document.createElement('button');
                            returnButton.className = 'bg-purple-700 text-white px-4 py-2 rounded';
                            returnButton.textContent = 'Car Returned by Customer';

                            returnButton.onclick = () => {
                                // Disable the button to avoid multiple clicks
                                returnButton.disabled = true;

                                // Update the booking status to 'Returned' in IndexedDB
                                updateBookingStatusInIndexedDB(booking.id, 'Returned', () => {
                                    // Update the button text and styling
                                    returnButton.textContent = 'Returned';
                                    returnButton.className = 'bg-blue-700 text-white px-4 py-2 rounded';
                                    returnButton.disabled = true;

                                    // Add the car back to the available cars list
                                    fetchCarDetails(booking.carId).then(car => {
                                        addCarToAvailableCarsSection(car);
                                    }).catch(error => {
                                        console.error('Error fetching car details:', error);
                                    });
                                });
                            };

                            statusContainer.appendChild(returnButton);
                        } else {
                            const approveButton = document.createElement('button');
                            approveButton.className = 'bg-yellow-500 text-white px-4 py-2 rounded mr-2';
                            approveButton.textContent = 'Approve';
                            approveButton.onclick = () => approveBooking(booking, approveButton, rejectButton);

                            const rejectButton = document.createElement('button');
                            rejectButton.className = 'bg-red-600 text-white px-4 py-2 rounded';
                            rejectButton.textContent = 'Reject';
                            rejectButton.onclick = () => rejectBooking(booking, approveButton, rejectButton);

                            statusContainer.appendChild(approveButton);
                            statusContainer.appendChild(rejectButton);
                        }

                        // Append elements to the booking card
                        bookingInfo.appendChild(carName);
                        bookingInfo.appendChild(carStats);
                        bookingInfo.appendChild(bookingDetails);
                        bookingInfo.appendChild(features);
                        bookingInfo.appendChild(statusContainer);
                        bookingCard.appendChild(carImage);
                        bookingCard.appendChild(bookingInfo);

                        bookingsContainer.appendChild(bookingCard);
                    })
                    .catch(error => {
                        console.error('Error fetching car details:', error);
                    });
            });
        }
        formMainDiv.appendChild(backButton)
        formMainDiv.appendChild(bookingsContainer);
    }
    function updateBookingStatusInIndexedDB(bookingId, newStatus, callback) {
        const request = indexedDB.open('CarRentalSystem', 1);

        request.onsuccess = (event) => {
            const db = event.target.result;

            // Start a transaction for both the 'bookings' and 'cars' stores
            const transaction = db.transaction(['bookings', 'cars'], 'readwrite');
            const bookingsStore = transaction.objectStore('bookings');
            const carsStore = transaction.objectStore('cars');

            // Update the booking status
            const getBookingRequest = bookingsStore.get(bookingId);

            getBookingRequest.onsuccess = () => {
                const booking = getBookingRequest.result;
                if (booking) {
                    booking.status = newStatus;

                    const updateBookingRequest = bookingsStore.put(booking);

                    updateBookingRequest.onsuccess = () => {
                        console.log('Booking status updated to:', newStatus);

                        // Update the car status in the 'cars' store
                        const getCarRequest = carsStore.get(booking.carId);

                        getCarRequest.onsuccess = () => {
                            const car = getCarRequest.result;
                            if (car) {
                                car.status = 'available';
                                car.booked = false;

                                const updateCarRequest = carsStore.put(car);

                                updateCarRequest.onsuccess = () => {
                                    console.log('Car status updated to available and booked set to false');
                                    if (callback) callback();
                                };

                                updateCarRequest.onerror = () => {
                                    console.error('Failed to update car status');
                                };
                            } else {
                                console.error('Car not found in the store');
                            }
                        };

                        getCarRequest.onerror = () => {
                            console.error('Error fetching car details');
                        };
                    };

                    updateBookingRequest.onerror = () => {
                        console.error('Failed to update booking status');
                    };
                } else {
                    console.error('Booking not found');
                }
            };

            getBookingRequest.onerror = () => {
                console.error('Error fetching booking');
            };
        };

        request.onerror = () => {
            console.error('Failed to open the database');
        };
    }

    // Helper function to fetch car details based on carId from the 'cars' store
    function fetchCarDetails(carId) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('CarRentalSystem', 1);

            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction('cars', 'readonly');
                const store = transaction.objectStore('cars');
                const carRequest = store.get(carId);

                carRequest.onsuccess = () => {
                    resolve(carRequest.result);
                };

                carRequest.onerror = () => {
                    reject('Error retrieving car details');
                };
            };

            request.onerror = () => {
                reject('Failed to open the database');
            };
        });
    }


    function approveBooking(booking, approveButton, rejectButton) {
        const request = indexedDB.open('CarRentalSystem', 1);

        request.onsuccess = function (event) {
            const db = event.target.result;

            // Update booking status to 'Booked' in 'bookings' store
            const bookingTransaction = db.transaction(['bookings'], 'readwrite');
            const bookingsStore = bookingTransaction.objectStore('bookings');

            booking.status = 'Booked';
            bookingsStore.put(booking);

            // Update car status to 'Booked' in 'cars' store
            const carTransaction = db.transaction(['cars'], 'readwrite');
            const carsStore = carTransaction.objectStore('cars');

            const carRequest = carsStore.get(booking.carId);
            carRequest.onsuccess = function () {
                const car = carRequest.result;
                car.status = 'Booked';
                carsStore.put(car);
                showPopup('Booking approved and car status updated.');
                // alert('Booking approved and car status updated.');

                // Hide the Approve and Reject buttons
                approveButton.style.display = 'none';
                rejectButton.style.display = 'none';

                // Create and display an 'Approved' button (non-clickable)
                const approvedButton = document.createElement('button');
                approvedButton.className = 'bg-green-700 text-white px-4 py-2 rounded';
                approvedButton.textContent = 'Approved';
                approvedButton.disabled = true; // Make it non-clickable

                // Insert the 'Approved' button after the original buttons
                approveButton.parentNode.appendChild(approvedButton);
            };
        };
    }
    function rejectBooking(booking, approveButton, rejectButton) {
        const request = indexedDB.open('CarRentalSystem', 1);

        request.onsuccess = function (event) {
            const db = event.target.result;

            // Remove booking from 'bookings' store or update status to 'Rejected'
            const bookingTransaction = db.transaction(['bookings'], 'readwrite');
            const bookingsStore = bookingTransaction.objectStore('bookings');
            // Optionally, update the booking status to 'Rejected' instead of deleting
            booking.status = 'Rejected';
            bookingsStore.put(booking);
            // Update car status to 'Booked' in 'cars' store
            const carTransaction = db.transaction(['cars'], 'readwrite');
            const carsStore = carTransaction.objectStore('cars');

            const carRequest = carsStore.get(booking.carId);
            carRequest.onsuccess = function () {
                const car = carRequest.result;
                car.status = 'Rejected';
                carsStore.put(car);

                // alert('Booking rejected.');
                showPopup('Booking rejected.');

                // Hide the Approve and Reject buttons
                approveButton.style.display = 'none';
                rejectButton.style.display = 'none';

                // Create and display a 'Rejected' button (non-clickable)
                const rejectedButton = document.createElement('button');
                rejectedButton.className = 'bg-red-700 text-white px-4 py-2 rounded';
                rejectedButton.textContent = 'Rejected';
                rejectedButton.disabled = true; // Make it non-clickable

                // Insert the 'Rejected' button after the original buttons
                rejectButton.parentNode.appendChild(rejectedButton);
            };
        }
    }
    function showAddCarForm() {
        mainContent.style.display = 'none';
        header.style.display = 'none'
        dropdownMenu.style.display = 'none'
        formMainDiv.style.display = 'flex'; // Show form container
        formContainer.style.display = 'block'; // Show form container
        cardContainer.style.display = 'flex'; // Hide card container
        sidebar.style.display = 'none'; // Hide the sidebar
        isManageCarsSectionActive = false; // Not in "Manage Cars" section
        highlightButton(sidebar.querySelector('button:nth-child(1)')); // Highlight the "Add Cars" button

    }

    function showManageCars() {
        mainContent.style.display = 'none';
        formMainDiv.style.display = 'block';
        dropdownMenu.style.display = 'none';
        formContainer.style.display = 'none';
        cardContainer.style.display = 'flex';
        sidebar.style.display = 'none';
        header.style.display = 'none';
        isManageCarsSectionActive = true;
        highlightButton(sidebar.querySelector('button:nth-child(2)'));
        // let backButton3 = document.getElementById('manageCarsBackButton');
        formMainDiv.appendChild(backButton);

        const dbRequest = indexedDB.open('CarRentalSystem', 1);
        dbRequest.onsuccess = () => {
            const db = dbRequest.result;
            loadExistingCars(db);
        };
    }
    function showEditForm(carId, carName, carImageURL, carRent) {
        // Show form and hide main content
        formMainDiv.style.display = 'flex';
        formContainer.style.display = 'flex';
        mainContent.style.display = 'none';

        // Pre-fill form with car details
        document.getElementById('carName').value = carName;
        document.getElementById('carRent').value = carRent;

        // Change submit button to "Update" and set update mode
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.textContent = 'Update';
        form.onsubmit = (e) => {
            e.preventDefault();
            updateCarInDB(carId);
        };
    }
    function updateCarInDB(carId) {
        const dbRequest = indexedDB.open('CarRentalSystem', 1);

        dbRequest.onsuccess = () => {
            const db = dbRequest.result;

            // Prepare updated car data
            const updatedCarData = {
                id: carId,
                name: document.getElementById('carName').value,
                rent: document.getElementById('carRent').value,
                owner: localStorage.getItem('loggedInUser')
            };

            // Check if a new image file has been uploaded
            const carImageInput = document.getElementById('carImage').files[0];
            if (carImageInput) {
                const reader = new FileReader();

                // Set up load and error event handlers
                reader.onload = function (event) {
                    updatedCarData.image = event.target.result;
                    // Proceed with the update after loading the image data
                    performUpdate(db, updatedCarData);
                };

                reader.onerror = function (error) {
                    console.error("Error reading the image file:", error);
                    // alert("Failed to read the image file. Please try again.");
                    showPopup('Failed to read the image file. Please try again.');

                };

                // Trigger the file reading process
                reader.readAsDataURL(carImageInput);
            } else {
                // If no new image, proceed with existing image data
                performUpdate(db, updatedCarData);
            }
        };
    }

    function performUpdate(db, carData) {
        const transaction = db.transaction('cars', 'readwrite');
        const carStore = transaction.objectStore('cars');
        carStore.put(carData);

        transaction.oncomplete = () => {
            // alert('Car details updated successfully');
            showPopup('Car details updated successfully');

            resetForm(); // Reset form to default "Add" mode
        };

        transaction.onerror = () => {
            console.error("Failed to update car details.");
        };
    }
    const logoutButton = document.createElement('button');
    logoutButton.className = 'text-sm px-4 py-2 bg-red-600 text-white rounded-lg transition';
    logoutButton.textContent = 'Logout';
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('loggedInUser');
        document.body.innerHTML = ''; // Clear dashboard content
        location.reload(); // Refresh the page
    });
    header.appendChild(logoutButton);
    header.appendChild(dropdownMenu)
    dashboardContainer.appendChild(sidebar);
    dashboardContainer.appendChild(header);

    dashboardContainer.appendChild(contentContainer);
    contentContainer.appendChild(formMainDiv);
    return dashboardContainer;
    function resetForm() {
        form.reset();
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.textContent = 'Add'; // Reset button text to "Add"
        form.onsubmit = addCarToDB; // Set form to default "add" mode
    }

    // Sample function for adding a new car to the database, if required
    function addCarToDB(event) {
        event.preventDefault();
        // Add new car data to IndexedDB
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

}
function renderAvailabilityChart() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const ownerEmail = loggedInUser.email;

    let totalCars = 0;
    let approvedBookings = 0;
    let rejectedBookings = 0;
    let pendingBookings = 0;
    let returnedBookings = 0;
    let totalEarnings = 0;

    const dbRequest = indexedDB.open('CarRentalSystem', 1);

    dbRequest.onsuccess = (event) => {
        const db = event.target.result;

        // Open a transaction that includes both `cars` and `bookings`
        const transaction = db.transaction(['cars', 'bookings'], 'readonly');
        const carStore = transaction.objectStore('cars');
        const bookingStore = transaction.objectStore('bookings');

        // Process cars to count total owned by the logged-in user
        const carRequest = carStore.openCursor();
        carRequest.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                const carData = cursor.value;
                if (JSON.parse(carData.owner).email === ownerEmail) {
                    totalCars++;
                }
                cursor.continue();
            }
        };

        // Process bookings to count statuses and calculate earnings
        const bookingRequest = bookingStore.openCursor();
        bookingRequest.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                const booking = cursor.value;
                if (JSON.parse(booking.ownerUsername).email === ownerEmail) {
                    if (booking.status === 'Booked') {
                        approvedBookings++;
                    } else if (booking.status === 'Rejected') {
                        rejectedBookings++;
                    } else if (booking.status === 'Pending') {
                        pendingBookings++;
                    } else if (booking.status === 'Returned') {
                        returnedBookings++;
                        const duration = booking.duration.duration || 0;
                        const durationType = booking.duration.type || 'days'; // Default to days
                        let multiplier = 1;

                        // Adjust multiplier based on durationType
                        if (durationType === 'hours') {
                            multiplier = 1 / 24; // Convert hours to days
                        }
                        const carTransaction = db.transaction(['cars'], 'readonly');
                        const carStore = carTransaction.objectStore('cars');
                        const carRequest = carStore.get(booking.carId);

                        carRequest.onsuccess = () => {
                            const carData = carRequest.result;
                            if (carData) {
                                const carRent = carData.rent || 0; // Default rent to 0 if not found
                                totalEarnings += carRent * duration * multiplier;
                            }
                        };
                    }
                }
                cursor.continue();
            }
        };

        // When the transaction completes, render the charts
        transaction.oncomplete = () => {
            console.log('Total Earnings:', totalEarnings);

            renderBookingStatusDonutChart(approvedBookings, rejectedBookings, pendingBookings, returnedBookings, totalEarnings);
        };

        transaction.onerror = () => {
            console.error('Transaction error:', transaction.error);
        };
    };

    dbRequest.onerror = () => {
        console.error('Error opening IndexedDB:', dbRequest.error);
    };
}

function renderBookingStatusDonutChart(approved, rejected, pending, returned, earnings) {
    const ctx = document.getElementById('availabilityChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Approved Bookings', 'Rejected Bookings', 'Pending Bookings', 'Returned Bookings', 'Total Earnings'], // Keep these for internal usage
            datasets: [{
                data: [approved, rejected, pending, returned, earnings],
                backgroundColor: ['#2196F3', '#F44336', '#FFC107', '#9C27B0', '#109308'],
                hoverBackgroundColor: ['#42A5F5', '#EF5350', '#FFD54F', '#AB47BC', '#16c60c']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false // Disable the external labels (legend) on top
                }
            }
        }
    });
}
