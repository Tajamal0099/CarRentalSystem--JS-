function createBookCarsSection() {
    const bookCarsContainer = document.createElement('div');
    bookCarsContainer.className = 'min-h-screen bg-[#f9fafb] flex text-white';
    // Create sidebar for larger screens
    const sidebar = document.createElement('div');
    sidebar.className = 'hidden md:block relative w-[27%] bg-white text-gray-800 pt-8 px-5 flex flex-col space-y-7 shadow-md';
    // Create header for smaller screens
    const header = document.createElement('header');
    header.className =
        'md:hidden bg-white shadow-md fixed top-0 left-0 w-full z-10 flex justify-between items-center px-4 py-3';

    // Header title
    const headerTitle = document.createElement('h1');
    headerTitle.className = 'text-xl font-bold text-gray-900';
    headerTitle.textContent = 'Book Cars';
    header.appendChild(headerTitle);

    // Menu button for filter dropdown
    const menuButton = document.createElement('button');
    menuButton.className =
        'text-gray-900 text-2xl focus:outline-none hover:text-blue-500';
    menuButton.innerHTML = '<i class="fas fa-bars"></i>'; // Font Awesome icon
    header.appendChild(menuButton);

    // Dropdown menu for filters
    const dropdownMenu = document.createElement('div');
    dropdownMenu.className =
        'hidden absolute top-full left-0 w-full bg-white shadow-md z-10 flex flex-col space-y-4 px-4 py-4';
    header.appendChild(dropdownMenu);
    menuButton.onclick = () => {
        dropdownMenu.classList.toggle('hidden');
    };
    // Sidebar title
    const sidebarTitle = document.createElement('h2');
    sidebarTitle.className = 'text-2xl font-bold mb-4 text-gray-900';
    sidebarTitle.textContent = 'Filter by:';
    sidebar.appendChild(sidebarTitle);

    // Search bar
    // Search bar with Font Awesome icon
    const searchContainer = document.createElement('div');
    searchContainer.className = 'mb-6 flex items-center bg-[#f8f9fa] border border-gray-100 rounded-lg px-3 py-2 shadow-sm';

    const searchIcon = document.createElement('i');
    searchIcon.className = 'fas fa-search text-gray-400 mr-2'; // Font Awesome search icon
    searchContainer.appendChild(searchIcon);

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search';
    searchInput.className = 'w-full bg-transparent focus:outline-none focus:ring-0 text-gray-800';
    searchContainer.appendChild(searchInput);

    sidebar.appendChild(searchContainer);


    // Rental Type Filter
    const rentalTypeContainer = document.createElement('div');
    rentalTypeContainer.className = 'mb-6';
    const rentalTypeTitle = document.createElement('h3');
    rentalTypeTitle.className = 'text-md font-bold mb-2';
    rentalTypeTitle.textContent = 'Rental Type';
    rentalTypeContainer.appendChild(rentalTypeTitle);

    ['Any', 'Per Day', 'Per Hour'].forEach((type) => {
        const button = document.createElement('button');
        button.className =
            'inline-block px-2 text-sm font-semibold py-2 hover:text-white border border-gray-300 rounded-lg mr-2 mb-2 hover:bg-[#005cc8]';
        button.textContent = type;

        // Add click event listener
        button.onclick = () => {
            // Clear hover styles from other buttons and apply active styles to the clicked button
            Array.from(rentalTypeContainer.querySelectorAll('button')).forEach((btn) => {
                btn.classList.remove('bg-[#005cc8]', 'text-white');
            });
            button.classList.add('bg-[#005cc8]', 'text-white');

            // Filter cars based on the selected rental type
            fetchCarsFromIndexedDB((cars) => {
                let filteredCars;

                if (type === 'Any') {
                    filteredCars = cars.filter((car) => !car.booked); // Show all cars
                } else if (type === 'Per Day') {
                    filteredCars = cars.filter(
                        (car) => !car.booked && car.durationType === 'per-day'
                    ); // Filter cars with durationType 'per-day'
                } else if (type === 'Per Hour') {
                    filteredCars = cars.filter(
                        (car) => !car.booked
                    ); // Filter cars with durationType 'per-hour'
                }
                if (filteredCars.length === 0) {
                    // Show a message if no cars are available
                    carsGrid.innerHTML = `
                        <div class="text-center text-gray-600 mt-10 text-lg">
                            No ${type.toLowerCase()} cars available.
                        </div>
                    `;
                } else {
                    renderCars(filteredCars); // Render filtered cars
                }
            });
        };

        rentalTypeContainer.appendChild(button);
    });

    sidebar.appendChild(rentalTypeContainer);

    // Toggle for Availability
    // Availability toggle
    const availabilityContainer = document.createElement('div');
    availabilityContainer.className = 'mb-6';

    const availabilityLabel = document.createElement('label');
    availabilityLabel.className = 'flex items-center space-x-2 cursor-pointer';

    // Toggle container
    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'relative';

    // Toggle input (hidden)
    const availabilityInput = document.createElement('input');
    availabilityInput.type = 'checkbox';
    availabilityInput.className = 'sr-only peer'; // Hides the checkbox but keeps it functional

    // Toggle slider
    const toggleSlider = document.createElement('div');
    toggleSlider.className = 'toggle-slider'; // Add slider styles

    // Toggle indicator
    const toggleIndicator = document.createElement('div');
    toggleIndicator.className = 'toggle-indicator'; // Add indicator styles

    toggleContainer.appendChild(availabilityInput);
    toggleContainer.appendChild(toggleSlider);
    toggleSlider.appendChild(toggleIndicator);

    // Availability text
    const availabilityText = document.createElement('span');
    availabilityText.textContent = 'Available Now Only';
    availabilityText.className = 'text-sm font-bold text-gray-900';

    availabilityLabel.appendChild(availabilityText);
    availabilityContainer.appendChild(availabilityLabel);
    availabilityLabel.appendChild(toggleContainer);
    sidebar.appendChild(availabilityContainer);



    // Car Brand Filter
    const carBrandContainer = document.createElement('div');
    carBrandContainer.className = 'mb-6';

    const carBrandTitle = document.createElement('h3');
    carBrandTitle.className = 'text-lg font-semibold mb-2';
    carBrandTitle.textContent = 'Car Brand';
    carBrandContainer.appendChild(carBrandTitle);

    // Add sample brands as a dropdown (static for now)
    const carBrandDropdown = document.createElement('select');
    carBrandDropdown.className =
        'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500';
    ['Any', 'civic', 'honda', 'haval', 'ferari'].forEach((brand) => {
        const option = document.createElement('option');
        option.value = brand.toLowerCase(); // Set the value to lowercase for consistency
        option.textContent = brand; // Display name
        carBrandDropdown.appendChild(option);
    });
    carBrandContainer.appendChild(carBrandDropdown);
    sidebar.appendChild(carBrandContainer);

    // Add event listener to the dropdown
    carBrandDropdown.onchange = () => {
        const selectedBrand = carBrandDropdown.value; // Get the selected brand value

        fetchCarsFromIndexedDB((cars) => {
            let filteredCars;

            if (selectedBrand === 'any') {
                // If "Any" is selected, show all cars
                filteredCars = cars.filter((car) => !car.booked);
            } else {
                // Filter cars matching the selected brand
                filteredCars = cars.filter(
                    (car) =>
                        !car.booked &&
                        car.name.toLowerCase().includes(selectedBrand) // Match car name with the selected brand
                );
            }

            if (filteredCars.length === 0) {
                // Show a message if no cars match the selected brand
                carsGrid.innerHTML = `
                <div class="text-center text-gray-600 mt-10 text-lg">
                    No cars available for the selected brand: ${selectedBrand.charAt(0).toUpperCase() + selectedBrand.slice(1)}.
                </div>
            `;
            } else {
                renderCars(filteredCars); // Render filtered cars
            }
        });
    };

    // Append the sidebar to the dashboard container
    bookCarsContainer.appendChild(sidebar);
    bookCarsContainer.appendChild(header);
    const carsGrid = document.createElement('div');
    carsGrid.className =
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:pt-3 pt-16 w-full p-3';
    bookCarsContainer.appendChild(carsGrid);

    const renderCars = (cars) => {
        // Clear previous cards
        carsGrid.innerHTML = '';

        cars.forEach((car) => {
            if (car.booked) return;

            // Card Container
            const carCard = document.createElement('div');
            carCard.className =
                'bg-white shadow-lg h-fit rounded-lg flex flex-col items-center pb-4 transition transform hover:scale-105 text-gray-800 max-w-xs border border-gray-200';

            // Car Image
            const carImage = document.createElement('img');
            carImage.className = 'w-full h-44 rounded-t-lg object-cover';
            carImage.src = car.image || 'default-car-image.jpg';
            carCard.appendChild(carImage);

            // Car Rating and Availability
            const topRow = document.createElement('div');
            topRow.className = 'flex justify-between items-center w-full px-4 py-2';
            const rating = document.createElement('span');
            rating.className =
                'flex items-center text-yellow-500 text-sm font-semibold';
            rating.innerHTML = `<i class="fa-solid fa-star mr-1"></i> ${car.rating || '4.5'
                } (${car.reviews || '100'})`;
            topRow.appendChild(rating);

            const availability = document.createElement('span');
            availability.className =
                'bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-semibold';
            availability.textContent = 'Available now'
            topRow.appendChild(availability);

            carCard.appendChild(topRow);

            // Car Title and Price
            const carInfo = document.createElement('div');
            carInfo.className = 'w-full px-4 text-center';

            const carTitle = document.createElement('h2');
            carTitle.className = 'text-lg font-semibold text-gray-800 mb-1';
            carTitle.textContent = car.name || 'Car Name Unavailable';
            carInfo.appendChild(carTitle);

            const carModel = document.createElement('p');
            carModel.className = 'text-sm text-gray-500 mb-2';
            carModel.textContent = car.model || 'Model Information';
            carInfo.appendChild(carModel);

            const carPrice = document.createElement('p');
            carPrice.className = 'text-lg font-bold text-gray-800 mb-4';
            carPrice.innerHTML = `$${car.rent || '0.00'}<span class="text-sm"> / hour</span>`;
            carInfo.appendChild(carPrice);

            carCard.appendChild(carInfo);

            // Car Details Row
            const detailsRow = document.createElement('div');
            detailsRow.className =
                'flex justify-around items-center w-full px-4 py-2 text-sm text-gray-500';

            const carType = document.createElement('span');
            carType.innerHTML = `<i class="fa-solid fa-car-side mr-1"></i> ${car.type || 'Hatchback'
                }`;
            detailsRow.appendChild(carType);

            const carTransmission = document.createElement('span');
            carTransmission.innerHTML = `<i class="fa-solid fa-cogs mr-1"></i> ${car.transmission || 'Manual'
                }`;
            detailsRow.appendChild(carTransmission);

            const carFuel = document.createElement('span');
            carFuel.innerHTML = `<i class="fa-solid fa-gas-pump mr-1"></i> ${car.fuel || 'Diesel'
                }`;
            detailsRow.appendChild(carFuel);


            carCard.appendChild(detailsRow);

            // Book Button
            const bookButton = document.createElement('button');
            bookButton.className =
                'w-3/4 px-4 py-2 mt-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition';
            bookButton.textContent = 'Book Now';
            bookButton.onclick = () => showBookingPopup(car, bookButton);
            carCard.appendChild(bookButton);

            // Append the card to the container
            carsGrid.appendChild(carCard);
        });
    };
    const fetchAndFilterCars = () => {
        fetchCarsFromIndexedDB((cars) => {
            const query = searchInput.value.toLowerCase(); // Get the search input in lowercase
            const filteredCars = cars.filter(
                (car) =>
                    car.name.toLowerCase().includes(query) && !car.booked // Filter cars by name and status
            );
            renderCars(filteredCars);
        });
    };

    // Attach search event listener
    searchInput.addEventListener('input', fetchAndFilterCars);

    // Initial rendering of all cars
    fetchCarsFromIndexedDB(renderCars);

    const backButton = document.createElement('button');
    backButton.className = 'mb-6 w-full px-4 py-2 bg-red-600  text-white rounded-lg hover:bg-blue-600 transition';
    backButton.textContent = 'Back to Dashboard';
    backButton.onclick = () => {
        document.body.innerHTML = '';
        document.body.appendChild(createCustomerDashboard());
    };
    sidebar.appendChild(backButton);
    dropdownMenu.append(searchContainer.cloneNode(true), backButton.cloneNode(true));
    return bookCarsContainer;
}
function showBookingPopup(car, bookButton) {
    const popup = document.createElement('div');
    popup.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50';

    const form = document.createElement('div');
    form.className = 'bg-white rounded-lg p-8 max-w-md w-full';
    form.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Book ${car.name}</h2>
        <label class="block mb-2">Select Duration:</label>
        <select id="durationType" class="w-full p-2 border mb-4 rounded">
            <option value="hours">Hours</option>
            <option value="days">Days</option>
        </select>
        <label class="block mb-2">Duration:</label>
        <input type="number" id="duration" class="w-full p-2 border mb-4 rounded" min="1" placeholder="Enter duration" />
       <p id="error" class="text-red-500 text-sm mb-2 hidden">Please enter a valid duration greater than 0.</p>
        <p id="totalRent" class="text-lg font-semibold mb-4"></p>
        <button id="submitBooking" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Submit</button>
        <button id="close" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Close</button>
    `;
    popup.appendChild(form);
    document.body.appendChild(popup);
    const durationType = form.querySelector('#durationType');
    const durationInput = form.querySelector('#duration');
    const totalRentDisplay = form.querySelector('#totalRent');
    const errorDisplay = form.querySelector('#error');
    const submitButton = form.querySelector('#submitBooking');
    const close = form.querySelector('#close');

    durationInput.oninput = () => updateTotalRent(car.rent, durationType.value, durationInput.value, totalRentDisplay);
    durationType.onchange = () => updateTotalRent(car.rent, durationType.value, durationInput.value, totalRentDisplay);
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const customerUsername = loggedInUser ? loggedInUser.email : null;
    console.log(customerUsername);

    close.onclick = () => {
        document.body.removeChild(popup);
    };
    submitButton.onclick = () => {
        const durationValue = parseInt(durationInput.value, 10);
        if (isNaN(durationValue) || durationValue <= 0) {
            errorDisplay.classList.remove('hidden'); // Show error message
            return; // Prevent form submission
        }
        errorDisplay.classList.add('hidden'); // Hide error if input is valid

        bookButton.textContent = 'Pending';
        bookButton.className = 'px-4 py-2 bg-yellow-500 text-white rounded-lg font-semibold cursor-not-allowed';
        bookButton.disabled = true;
        saveBookingDetailsInIndexedDB(car, durationType.value, durationInput.value, customerUsername);
        document.body.removeChild(popup);
    };
}

// Update total rent based on duration and rate
function updateTotalRent(rent, type, duration, display) {
    const durationValue = parseInt(duration, 10);
    if (isNaN(durationValue) || durationValue <= 0) {
        display.textContent = 'Total Rent: $0';
        return;
    }
    const total = rent * (type === 'hours' ? durationValue : durationValue * 24);
    display.textContent = `Total Rent: $${total}`;
}

// Save booking details and update car status in IndexedDB
// Save booking details and update car status in IndexedDB
// Save booking details and update car status in IndexedDB
function saveBookingDetailsInIndexedDB(car, type, duration, customerUsername) {
    const request = indexedDB.open('CarRentalSystem', 1);

    request.onsuccess = function (event) {
        const db = event.target.result;

        // Save booking request in the 'bookings' store
        const bookingTransaction = db.transaction(['bookings'], 'readwrite');
        const bookingsStore = bookingTransaction.objectStore('bookings');

        // Create a booking request object with customer and owner usernames
        const bookingRequest = {
            carId: car.id,
            customerUsername: customerUsername,
            duration: { type, duration },
            status: 'Pending',
            bookingDate: new Date().toISOString(),
            ownerUsername: car.owner // Ensure car has an ownerUsername field set
        };

        bookingsStore.add(bookingRequest).onsuccess = function () {
            console.log('Booking request saved successfully.');
        };

        const carTransaction = db.transaction(['cars'], 'readwrite');
        const carsStore = carTransaction.objectStore('cars');

        car.booked = true;
        car.status = 'Pending';

        carsStore.put(car).onsuccess = function () {
            console.log('Car status updated successfully in cars store.');
        };
        showPopup(`You have successfully booked the car for ${duration} ${type}.`)
    };

    request.onerror = function () {
        showPopup(`Failed to open the database.`)
    };
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

// Ensure cars with the 'booked' status are excluded when fetching cars
function fetchCarsFromIndexedDB(callback) {
    const request = indexedDB.open('CarRentalSystem', 1);

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction(['cars', 'carOwner'], 'readonly');
        const carsStore = transaction.objectStore('cars');
        const ownersStore = transaction.objectStore('carOwner');
        const cars = [];
        carsStore.openCursor().onsuccess = function (event) {
            const cursor = event.target.result;
            if (cursor) {
                const car = cursor.value;
                const ownerEmail = JSON.parse(car.owner).email; // Assuming owner's email is used as an identifier
                const ownerRequest = ownersStore.get(ownerEmail);
                ownerRequest.onsuccess = function (ownerEvent) {
                    const owner = ownerEvent.target.result;
                    if (owner.status !== "blocked" && !car.booked) {
                        cars.push(car);
                    }
                };
                cursor.continue();
            } else {
                transaction.oncomplete = function () {
                    callback(cars); // Return filtered cars
                };
            }
        };
    };
}
// Main function to create the booked cars section
function createBookedCarsSection() {
    const bookedCarsContainer = document.createElement('div');
    bookedCarsContainer.className = 'min-h-screen bg-gray-50 p-8 flex flex-col items-center';

    const bookedCarsTitle = document.createElement('h1');
    bookedCarsTitle.className = 'text-3xl font-bold text-gray-900 mb-20 md:mb-8';
    bookedCarsTitle.textContent = 'Your Booked Cars';
    bookedCarsContainer.appendChild(bookedCarsTitle);

    const bookedCarsGrid = document.createElement('div');
    bookedCarsGrid.id = 'bookedCarsGrid'
    bookedCarsGrid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl';
    bookedCarsContainer.appendChild(bookedCarsGrid);

    const backButton = document.createElement('button');
    backButton.className = 'mb-6 px-4 py-2 bg-red-600 absolute top-20 md:top-5 right-5 text-white rounded hover:bg-blue-600 transition';
    backButton.textContent = 'Back to Dashboard';
    backButton.onclick = () => {
        document.body.innerHTML = '';
        document.body.appendChild(createCustomerDashboard());
    };
    bookedCarsContainer.appendChild(backButton);

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    fetchBookedCarsFromIndexedDB(loggedInUser.email, (bookedCars) => {
        if (bookedCars.length === 0) {
            const noBookingsMsg = document.createElement('p');
            noBookingsMsg.className = 'text-gray-700 text-xl font-semibold mt-10 md:mt-0';
            noBookingsMsg.textContent = 'You have no booked cars.';
            bookedCarsContainer.appendChild(noBookingsMsg);
            return;
        }


        bookedCars.forEach((car) => {

            const carCard = document.createElement('div');
            carCard.className = 'bg-white text-black shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 border border-gray-300';

            // Car Image
            const carImage = document.createElement('img');
            carImage.className = 'w-full h-44 object-cover';
            carImage.src = car.image;
            carImage.alt = car.name || 'Car Image';
            carCard.appendChild(carImage);

            // Car Information Container
            const carInfoContainer = document.createElement('div');
            carInfoContainer.className = 'p-4 space-y-3';

            const carTitleContainer = document.createElement('div');
            carTitleContainer.className = 'flex items-center justify-between';

            const carTitle = document.createElement('h2');
            carTitle.className = 'text-lg font-bold text-black';
            carTitle.textContent = car.name || 'Unknown Car';
            carTitleContainer.appendChild(carTitle);

            // Rating
            const carRating = document.createElement('span');
            carRating.className = 'flex items-center text-yellow-500 text-sm font-medium';
            carRating.innerHTML = `⭐ ${car.rating || '4.0'} (${car.reviews || 4.0})`;
            carTitleContainer.appendChild(carRating);

            carInfoContainer.appendChild(carTitleContainer);


            // Price
            const carPrice = document.createElement('p');
            carPrice.className = 'text-lg font-semibold text-black mt-2';
            carPrice.textContent = `$${car.rent || 'N/A'}/hour`;
            carInfoContainer.appendChild(carPrice);

            // Append all details to car card
            carCard.appendChild(carInfoContainer);


            // Booking Date
            const carBookingDate = document.createElement('p');
            carBookingDate.className = 'text-gray-800 text-md font-semibold';
            carBookingDate.innerHTML = `📅 Booking Date: ${new Date(car.bookingDate).toLocaleDateString()}`;
            carInfoContainer.appendChild(carBookingDate);

            // Car Status
            const carStatus = document.createElement('span');
            carStatus.className = 'text-lg font-semibold py-1 px-3 rounded-full';
            carStatus.style.display = 'inline-block';
            carStatus.textContent = `Status: ${car.status}`;

            if (car.status === 'Booked') {
                carStatus.className += ' bg-green-600';
                carInfoContainer.appendChild(carStatus);

                // Timer for Approved Booking
                const timer = document.createElement('p');
                timer.className = 'text-lg font-semibold text-yellow-300 mt-2';
                carInfoContainer.appendChild(timer);

                // Calculate the end time based on bookingDate, type, and duration
                const bookingDate = new Date(car.bookingDate);
                let endTime;
                if (car.duration.type === 'hours') {
                    endTime = new Date(bookingDate.getTime() + car.duration.duration * 60 * 60 * 1000); // Convert hours to milliseconds
                } else if (car.duration.type === 'days') {
                    endTime = new Date(bookingDate.getTime() + car.duration.duration * 24 * 60 * 60 * 1000); // Convert days to milliseconds
                }

                // Function to update the timer display every second
                const updateTimer = () => {
                    const now = new Date();
                    const remainingTime = endTime - now;

                    if (remainingTime > 0) {
                        const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
                        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
                        timer.textContent = `Time Remaining: ${hours}h ${minutes}m ${seconds}s`;
                    } else {
                        timer.textContent = 'Time’s Up! Awaiting owner approval.';
                        carStatus.textContent = 'Status: Time Up';
                        carStatus.className = 'bg-gray-600 text-lg font-semibold py-1 px-3 rounded-full';

                        // Notify the owner for approval
                        notifyOwnerForReturnApproval(car);

                        clearInterval(timerInterval); // Stop the timer
                    }
                };

                // Start the countdown timer, update every second
                const timerInterval = setInterval(updateTimer, 1000);
                updateTimer(); // Initial call to display the timer immediately
            } else if (car.status === 'Rejected') {
                carStatus.className += ' bg-red-600';
            } else {
                carStatus.className += ' bg-yellow-600';
            }

            // Append the status and timer to the card
            carInfoContainer.appendChild(carStatus);
            carCard.appendChild(carInfoContainer);
            bookedCarsGrid.appendChild(carCard);
        });

    });
    function notifyOwnerForReturnApproval(car) {
        // Add logic to notify the owner of the car
        // Example: Update booking status in IndexedDB
        const request = indexedDB.open('CarRentalSystem', 1);

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['bookings'], 'readwrite');
            const store = transaction.objectStore('bookings');

            const updatedBooking = { ...car, status: 'Awaiting Approval' };
            store.put(updatedBooking);

            transaction.oncomplete = () => {
                console.log('Owner notified for return approval.');
            };

            transaction.onerror = () => {
                console.error('Error updating booking status.');
            };
        };
    }

    return bookedCarsContainer;
}

function fetchBookedCarsFromIndexedDB(customerEmail, callback) {
    const request = indexedDB.open('CarRentalSystem', 1);

    request.onsuccess = function (event) {
        const db = event.target.result;

        // Open transaction on the necessary stores
        const transaction = db.transaction(['bookings', 'cars'], 'readonly');
        const bookingsStore = transaction.objectStore('bookings');
        const carsStore = transaction.objectStore('cars');

        const bookedCars = [];

        bookingsStore.openCursor().onsuccess = function (event) {
            const cursor = event.target.result;
            if (cursor) {
                const booking = cursor.value;

                // Check if booking belongs to the logged-in customer
                if (booking.customerUsername === customerEmail) {
                    // Fetch car details from the 'cars' store using the car ID
                    const carRequest = carsStore.get(booking.carId);
                    carRequest.onsuccess = function () {
                        const car = carRequest.result;

                        // Combine booking and car details
                        bookedCars.push({
                            ...booking,
                            name: car ? car.name : 'Unknown',
                            image: car ? car.image : './path/to/default-image.jpg', // Default image path
                            rent: car ? car.rent : 'N/A',
                            owner: car ? car.owner : 'Unknown',
                            bookingDate: booking.bookingDate
                        });
                    };
                    carRequest.onerror = function () {
                        console.error("Error retrieving car details.");
                    };
                }
                cursor.continue();
            } else {
                // No more entries; invoke callback with the compiled list
                callback(bookedCars);
            }
        };
    };

    request.onerror = function () {
        console.error("Failed to open IndexedDB.");
        callback([]);
    };
}

export function createCustomerDashboard() {
    // Create main dashboard container
    const dashboardContainer = document.createElement('div');
    dashboardContainer.className = 'min-h-screen bg-gray-100 flex flex-col md:flex-row';

    // Create header for small screens
    const header = document.createElement('div');
    header.className = 'md:hidden w-full bg-[#111827] text-white flex justify-between items-center p-4';

    // Menu icon for small screens
    const menuIcon = document.createElement('button');
    menuIcon.className = 'text-white focus:outline-none';
    menuIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>';
    header.appendChild(menuIcon);

    // Title for the header
    const headerTitle = document.createElement('h1');
    headerTitle.className = 'text-xl font-bold';
    headerTitle.textContent = 'Dashboard';
    header.appendChild(headerTitle);

    // Dropdown menu for small screens
    const dropdownMenu = document.createElement('div');
    dropdownMenu.className = 'fixed top-16 text-white rounded-b-lg left-0 w-full bg-[#111827] z-10 flex flex-col space-y-2 p-4 transition-all duration-300 ease-in-out opacity-0 transform scale-y-0 origin-top';

    // Populate the dropdown menu with sidebar buttons
    const sidebarButtons = [
        {
            text: 'View & Book Cars',
            action: () => {
                document.body.innerHTML = ''; // Clear current content
                document.body.appendChild(createBookCarsSection()); // Display cars section
            }
        },
        {
            text: 'See Booking List',
            action: () => {
                document.body.innerHTML = '';
                document.body.appendChild(createBookedCarsSection()); // Display booked cars section
            }
        }
    ];

    sidebarButtons.forEach(buttonData => {
        const button = document.createElement('button');
        button.className = 'w-full text-left px-4 py-2 bg-[#1f2937] font-semibold hover:bg-[#374151] rounded-lg transition';
        button.textContent = buttonData.text;
        button.onclick = buttonData.action;
        dropdownMenu.appendChild(button);
    });

    // Toggle dropdown visibility with smooth transition
    let isDropdownVisible = false;
    menuIcon.addEventListener('click', () => {
        isDropdownVisible = !isDropdownVisible;
        if (isDropdownVisible) {
            dropdownMenu.classList.remove('opacity-0', 'scale-y-0');
            dropdownMenu.classList.add('opacity-100', 'scale-y-100');
        } else {
            dropdownMenu.classList.remove('opacity-100', 'scale-y-100');
            dropdownMenu.classList.add('opacity-0', 'scale-y-0');
        }
    });

    // Append header and dropdown menu to the dashboard container
    dashboardContainer.appendChild(header);
    dashboardContainer.appendChild(dropdownMenu);

    // Sidebar for larger screens
    const sidebar = document.createElement("div");
    sidebar.className =
        "hidden md:block w-1/5 bg-white text-gray-800 pt-8 p-4 flex flex-col space-y-6 border-r relative";

    const logoContainer = document.createElement("div");
    logoContainer.className = "flex items-center space-x-3 px-4 mb-6";

    // Create the logo icon
    const logoIcon = document.createElement("div");
    logoIcon.innerHTML = `
       <i class="fa-solid fa-car-side text-blue-500 text-3xl"></i>
     `;
    logoContainer.appendChild(logoIcon);

    // Create the logo title
    const logoTitle = document.createElement("h2");
    logoTitle.className = "text-2xl font-bold text-gray-900";
    logoTitle.innerHTML = `<span class="text-blue-500">Drive</span>Now`; // "Drive" in blue, "Now" in black for contrast
    logoContainer.appendChild(logoTitle);

    // Append the logo container to the sidebar
    sidebar.appendChild(logoContainer);

    // Sidebar Menu Buttons
    const menuItems = [
        {
            name: "Dashboard",
            icon: "fa-solid fa-house",
            action: () => {
                document.body.innerHTML = ''; // Clear current content
                document.body.appendChild(createCustomerDashboard()); // Placeholder for your dashboard section
            }
        },
        {
            name: "View & Book Cars",
            icon: "fa-solid fa-car",
            action: () => {
                document.body.innerHTML = ''; // Clear current content
                document.body.appendChild(createBookCarsSection()); // Display cars section
            }
        },
        {
            name: "Booking List",
            icon: "fa-solid fa-list",
            action: () => {
                document.body.innerHTML = ''; // Clear current content
                document.body.appendChild(createBookedCarsSection()); // Display booking list section
            }
        }
    ];

    menuItems.forEach((item) => {
        const button = document.createElement("div");
        button.className =
            "flex items-center justify-between px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition cursor-pointer";

        const buttonContent = document.createElement("div");
        buttonContent.className = "flex items-center space-x-3";

        // Icon
        const icon = document.createElement("span");
        icon.className = `${item.icon} text-blue-500 text-lg`; // Add Font Awesome classes
        buttonContent.appendChild(icon);
        // Text
        const text = document.createElement("span");
        text.className = "text-sm font-medium";
        text.textContent = item.name;
        buttonContent.appendChild(text);
        button.addEventListener("click", item.action);
        button.appendChild(buttonContent);

        // Notification Badge
        if (item.notification) {
            const badge = document.createElement("span");
            badge.className =
                "bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full";
            badge.textContent = item.notification;
            button.appendChild(badge);
        }

        sidebar.appendChild(button);
    });

    // Logout Button
    const logoutButton = document.createElement("button");
    logoutButton.className =
        "w-[90%] bg-red-500 text-white absolute bottom-6 left-3 py-2 px-3 w-full font-semibold rounded-lg hover:bg-red-600 transition";
    logoutButton.textContent = "Log out";
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("loggedInUser");
        document.body.innerHTML = ""; // Clear dashboard content
        location.reload();
    });
    sidebar.appendChild(logoutButton);

    sidebar.appendChild(logoutButton);
    const headerLogoutButton = document.createElement('button');
    headerLogoutButton.className = "bg-red-600 text-white py-1 px-2 font-semibold rounded-lg hover:bg-red-700 transition";
    headerLogoutButton.textContent = "Logout";
    headerLogoutButton.addEventListener('click', () => {
        localStorage.removeItem('loggedInUser');
        document.body.innerHTML = ''; // Clear dashboard content
        location.reload();
    });
    header.appendChild(headerLogoutButton);
    // Main content container
    const mainContent = document.createElement('div');
    mainContent.className = 'w-full md:w-4/5 p-8 bg-gray-50';

    // Dashboard Title
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
    mainContent.appendChild(statsContainer)
    // Stats Cards Container
    fetchCarStats(function (stats) {
        if (!stats) {
            console.error('Failed to fetch stats.');
            return;
        }

        const { totalCars, bookedCars, pendingCars } = stats;

        const statsData = [
            {
                title: 'Total Cars',
                value: totalCars,
                description: 'The total number of cars available in the system.',
                icon: '🚗', // Icon for total cars
            },
            {
                title: 'Booked Cars',
                value: bookedCars,
                description: 'Cars that have already been booked by customers.',
                icon: '📅', // Icon for booked cars
            },
            {
                title: 'Pending Cars',
                value: pendingCars,
                description: 'Cars awaiting confirmation or booking from Owner.',
                icon: '⌛', // Icon for pending cars
            },
        ];

        const statsContainer = document.querySelector('#stats-container'); // Ensure the container exists in your HTML
        statsContainer.innerHTML = ''; // Clear previous stats, if any

        statsData.forEach(stat => {
            const statCard = document.createElement('div');
            statCard.className =
                'p-4 bg-white shadow-lg rounded-lg flex items-center text-center transform transition duration-300 hover:scale-105 hover:shadow-xl';
            const flex = document.createElement('div');
            flex.className = 'flex flex-col justify-between items-start w-[65\%] ml-4'

            const icon = document.createElement('div');
            icon.className =
                'text-4xl bg-blue-100 text-blue-500 w-16 h-16 rounded-full flex items-center justify-center mb-3';
            icon.textContent = stat.icon;

            // Title
            const title = document.createElement('h2');
            title.className = 'text-lg font-semibold text-gray-800 mb-2';
            title.textContent = stat.title;

            // Value
            const value = document.createElement('p');
            value.className = 'text-3xl font-bold text-gray-800 mb-2';
            value.textContent = stat.value;

            // Description
            const description = document.createElement('p');
            description.className = 'text-sm text-start text-gray-500';
            description.textContent = stat.description;

            // Append elements to the card
            statCard.appendChild(icon);
            statCard.appendChild(flex);
            statCard.appendChild(value);
            flex.appendChild(title);
            flex.appendChild(description);

            // Append the card to the container
            statsContainer.appendChild(statCard);
        });

    });



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
    dashboardContainer.appendChild(sidebar);
    dashboardContainer.appendChild(mainContent);

    // Render charts after DOM is ready
    setTimeout(() => {
        // renderBarChart();
        renderAvailabilityChart()
        // renderPieChart();
    }, 100);

    return dashboardContainer;
}
function fetchCarStats(callback) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const customerEmail = loggedInUser.email;
    // Open the IndexedDB database
    const request = indexedDB.open('CarRentalSystem', 1);

    // Handle database setup and version upgrades
    request.onupgradeneeded = function (event) {
        const db = event.target.result;

        // Create 'cars' object store if it doesn't exist
        if (!db.objectStoreNames.contains('cars')) {
            db.createObjectStore('cars', { keyPath: 'id', autoIncrement: true });
        }
    };

    request.onsuccess = function (event) {
        const db = event.target.result;

        // Start a read-only transaction on the 'cars' store
        const transaction = db.transaction('cars', 'readonly');
        const carsStore = transaction.objectStore('cars');

        // Fetch all cars from the store
        const getAllRequest = carsStore.getAll();

        getAllRequest.onsuccess =async function (event) {
            const allCars = event.target.result;
            const totalCars = allCars.filter(car => !car.status || car.status === 'available').length // Status is "Available" or undefined
            try {
                // Resolve the Promises from `getCustomerBookingCount`
                const [bookedCars, pendingCars] = await Promise.all([
                    getCustomerBookingCount(customerEmail, 'Booked'),
                    getCustomerBookingCount(customerEmail, 'Pending'),
                ]);

                // Pass the stats to the callback
                callback({ totalCars, bookedCars, pendingCars });
            } catch (error) {
                console.error('Error resolving booking counts:', error);
                callback(null); // Indicate failure with `null`
            }
        };

        getAllRequest.onerror = function () {
            console.error('Error fetching cars data from IndexedDB');
            callback(null); // Indicate failure with `null`
        };
    };

    request.onerror = function () {
        console.error('Error opening IndexedDB');
        callback(null); // Indicate failure with `null`
    };
}
function renderAvailabilityChart() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const customerEmail = loggedInUser.email;

    const ctx = document.getElementById('availabilityChart').getContext('2d');

    // Fetch data for available cars and bookings
    Promise.all([
        getAvailableCarsCount(customerEmail),
        getCustomerBookingCount(customerEmail, 'Pending'),
        getCustomerBookingCount(customerEmail, 'Booked'),
        getCustomerBookingCount(customerEmail, 'Rejected'),
        getCustomerBookingCount(customerEmail, 'Returned')
    ]).then(([availableCars, pendingBookings, bookedCars, rejectedBookings, returnedCars]) => {
        const totalCars = availableCars + pendingBookings + bookedCars + rejectedBookings + returnedCars;

        const data = {
            labels: ['Available Cars', 'Pending Bookings', 'Booked Cars', 'Rejected Bookings', 'Returned Cars'],
            datasets: [{
                data: [availableCars, pendingBookings, bookedCars, rejectedBookings, returnedCars],
                backgroundColor: ['#1E90FF', '#FFCE56', '#FF6384', '#F44336', '#FF6384'], // Bright colors
                hoverBackgroundColor: ['#1C7CCC', '#FFD966', '#FF7394', '#F45446', '#FF7394'] // Slightly darker hover
            }]
        };

        new Chart(ctx, {
            type: 'doughnut', // Donut chart
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false, // Disable legend to hide labels below the chart
                    },
                    tooltip: {
                        callbacks: {
                            label: (tooltipItem) => {
                                const label = data.labels[tooltipItem.dataIndex];
                                const value = data.datasets[0].data[tooltipItem.dataIndex];
                                return `${label}: ${value}`;
                            }
                        }
                    },
                },
                cutout: '50%', // Adjust inner radius for donut effect
            }
        });

        // Add a center label for the total count
        const centerLabel = document.querySelector('.chart-center-label');
        centerLabel.innerHTML = `
            <div class="text-center">
                <p class="text-xl font-bold text-gray-800">${totalCars}</p>
                <p class="text-sm text-gray-500">Total Cars</p>
            </div>
        `;
    }).catch(error => {
        // console.error('Error fetching data for the chart:', error);
    });
}

// Function to get the count of available cars for the customer
async function getAvailableCarsCount(customerEmail) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('CarRentalSystem', 1);

        request.onsuccess = function () {
            const db = request.result;
            const transaction = db.transaction('cars', 'readonly');
            const store = transaction.objectStore('cars');

            const cursorRequest = store.openCursor();
            let count = 0;

            cursorRequest.onsuccess = function (event) {
                const cursor = event.target.result;
                if (cursor) {
                    const car = cursor.value;

                    // Check if the car is "available" or has no status
                    if (
                        (!car.status || car.status === 'available') && // Status is "Available" or undefined
                        car.status !== 'Booked' &&                    // Exclude cars that are Booked
                        car.status !== 'Returned' &&                  // Exclude cars that are Returned
                        car.status !== 'Pending'                      // Exclude cars that are Pending
                    ) {
                        count++;
                    }

                    cursor.continue();
                } else {
                    resolve(count); // Resolve the count after iterating through all cars
                }
            };

            cursorRequest.onerror = function () {
                reject('Error fetching available cars.');
            };
        };

        request.onerror = function () {
            reject('Error opening IndexedDB.');
        };
    });
}

// Function to get the count of bookings for the customer by status
async function getCustomerBookingCount(customerEmail, status) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('CarRentalSystem', 1);
        request.onsuccess = function () {
            const db = request.result;
            const transaction = db.transaction('bookings', 'readonly');
            const store = transaction.objectStore('bookings');

            const cursorRequest = store.openCursor();
            let count = 0;

            cursorRequest.onsuccess = function (event) {
                const cursor = event.target.result;
                if (cursor) {
                    const booking = cursor.value;
                    // Check if the fields match
                    if (booking.customerUsername === customerEmail &&
                        booking.status === status) {
                        count++;
                    }
                    cursor.continue();
                } else {
                    resolve(count); // Resolves the count after iteration
                }
            };

            cursorRequest.onerror = function () {
                reject(`Error fetching records with status "${status}" for the customer.`);
            };
        };

        request.onerror = function () {
            reject('Error opening IndexedDB.');
        };
    });
}