export function createDashboard() {
    // Main container for the dashboard
    const dashboardContainer = document.createElement('div');
    dashboardContainer.className = "flex flex-col md:flex-row h-screen";

    // Header (used as a sidebar in large screens)
    const header = document.createElement('div');
    header.className = "bg-white relative  text-gray-800 border-r w-full md:w-64 p-4 flex flex-row md:flex-col md:justify-start justify-between items-center md:items-start";

    // Sidebar content container
    const navContainer = document.createElement('div');
    navContainer.className = "hidden md:flex flex-col w-full";

    // Dropdown menu for smaller screens
    const dropdown = document.createElement('div');
    dropdown.className = "md:hidden relative";
    const dropdownButton = document.createElement('button');
    dropdownButton.className = "bg-gray-100 text-black px-4 py-2 rounded-md";
    dropdownButton.innerHTML = '<i class="fas fa-bars"></i>';
    dropdownButton.onclick = function () {
        // Toggle the 'show' class on the dropdown menu
        dropdownMenu.classList.toggle('show');
    };

    const dropdownMenu = document.createElement('div');
    dropdownMenu.className = "absolute right-0 mt-4 w-48 dropdown-menu bg-gray-100 text-black hover:text-blue-300 rounded-md shadow-lg";
    dropdownMenu.style.zIndex = 50;

    const cont = document.createElement('div');
    cont.className = "flex items-center space-x-2 md:pl-3";
    const logo = document.createElement('h2');
    logo.textContent = "ADMIN";
    logo.className = "text-md md:text-2xl font-bold mb-0 md:mb-8";
    cont.appendChild(logo);
    header.appendChild(cont);

    // Navigation items
    const navItems = ["carOwner", "customer", "bookings"];
    navItems.forEach(item => {
        const navItem = document.createElement('div');
        navItem.className = "flex items-center space-x-3 text-lg py-3 mb-3 font-semibold px-4 rounded-lg cursor-pointer text-gray-700 hover:bg-blue-50 hover:text-blue-600 md:w-full";
        navItem.textContent = item;

        // Append to both main sidebar and dropdown
        navContainer.appendChild(navItem);
        const dropdownItem = navItem.cloneNode(true);
        dropdownMenu.appendChild(dropdownItem);

        // Event listener for item click
        navItem.addEventListener('click', () => {
            document.querySelectorAll('.active-nav').forEach(el => {
                el.classList.remove('active-nav', 'bg-blue-50','text-blue-700');
            });
            navItem.classList.add('active-nav', 'bg-blue-50','text-blue-700');
            handleContentUpdate(item);
        });

        dropdownItem.addEventListener('click', () => {
            dropdownMenu.classList.toggle('show');
            navItem.click(); // Trigger the same behavior as sidebar click
        });
    });

    // Logout button for header
    const logoutButton = document.createElement('button');
    logoutButton.className = " bg-red-600 text-white py-2 px-2 md:w-[90%] md:px-14 md:absolute md:bottom-5 md:left-3 font-semibold rounded-lg hover:bg-red-700";
    logoutButton.textContent = "Logout";
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('loggedInUser');
        document.body.innerHTML = ''; // Clear dashboard content
        location.reload();
    });

    header.appendChild(navContainer);
    dropdown.appendChild(dropdownButton);
    dropdown.appendChild(dropdownMenu);
    header.appendChild(logoutButton);
    header.appendChild(dropdown);
    dashboardContainer.appendChild(header);
    // Main Content
    const mainContent = document.createElement('div');
    mainContent.className = "flex-1 p-8 bg-white";

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
    fetchStoreStats(function (stats) {
        // Destructure with corrected key names
        const { carOwners, customers, bookings } = stats;
    
        const statsData = [
            {
                title: 'Total Owners',
                value: carOwners, // Corrected to use `carOwners`
                description: 'The total number of Owners available in the system.',
                icon: '👦🏻', // Icon for total owners
            },
            {
                title: 'Total Customers',
                value: customers, // Corrected to use `customers`
                description: 'The total number of Customers available in the system.',
                icon: '👦🏻', // Icon for total customers
            },
            {
                title: 'Total Bookings',
                value: bookings, // Correct
                description: 'Total bookings from Owners.',
                icon: '🧾', // Icon for total bookings
            },
        ];
    
        const statsContainer = document.querySelector('#stats-container'); // Ensure this container exists in your HTML
        statsContainer.innerHTML = ''; // Clear previous stats, if any
    
        statsData.forEach((stat) => {
            const statCard = document.createElement('div');
            statCard.className =
                'p-4 bg-white shadow-lg rounded-lg flex flex-col items-center text-center transform transition duration-300 hover:scale-105 hover:shadow-xl';
    
            const icon = document.createElement('div');
            icon.className =
                'text-4xl bg-blue-100 text-blue-500 w-16 h-16 rounded-full flex items-center justify-center mb-4';
            icon.textContent = stat.icon;
    
            // Title
            const title = document.createElement('h2');
            title.className = 'text-lg font-semibold text-gray-800 mb-2';
            title.textContent = stat.title;
    
            // Value
            const value = document.createElement('p');
            value.className = 'text-3xl font-bold text-gray-800 mb-2';
            value.textContent = stat.value !== undefined ? stat.value : 'N/A';
    
            // Description
            const description = document.createElement('p');
            description.className = 'text-sm text-gray-500';
            description.textContent = stat.description;
    
            // Append elements to the card
            statCard.appendChild(icon);
            statCard.appendChild(title);
            statCard.appendChild(value);
            statCard.appendChild(description);
    
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
    dashboardContainer.appendChild(mainContent);

    // Render charts after DOM is ready
    setTimeout(() => {
        // renderBarChart();
        renderAvailabilityChart()
        // renderPieChart();
    }, 100);

    return dashboardContainer;
    function handleContentUpdate(item) {
        const backButton = document.createElement('button');
        backButton.textContent = 'Back';
        backButton.className = 'mb-4 bg-blue-500 text-white py-2 px-4 rounded cursor-pointer hover:bg-blue-600';

        // Add event listener to navigate back to the main content
        backButton.addEventListener('click', () => {
            mainContent.innerHTML = `<div class="p-6 bg-white shadow-md rounded-lg">
                <h1 class="text-3xl font-semibold mb-4">${item}</h1>
                <div class="mt-4 text-gray-800" id="dataContainer">Loading...</div>
            </div>`;
        });

        mainContent.innerHTML = `
            <div class="p-6 bg-white shadow-md rounded-lg">
                <h1 class="text-3xl font-semibold mb-4">${item}</h1>
                <div class="mt-4 text-gray-800" id="dataContainer">Loading...</div>
            </div>
        `;

        const dataContainer = document.getElementById('dataContainer');
        if (item === 'bookings') {
            // Call the fetchBookingsData function to get booking data
            fetchBookingsData()
                .then(data => {
                    dataContainer.innerHTML = data;
                })
                .catch(error => {
                    dataContainer.innerHTML = `<p class="text-red-500">${error}</p>`;
                });
        } else {
            // Handle other sections, if necessary
            displayData(item)
                .then(data => {
                    dataContainer.innerHTML = data;
                })
                .catch(error => {
                    dataContainer.innerHTML = `<p class="text-red-500">${error}</p>`;
                });
        }
    }
}
function renderAvailabilityChart() {
    // Open the IndexedDB database
    const request = indexedDB.open('CarRentalSystem', 1);

    request.onsuccess = function (event) {
        const db = event.target.result;

        // Helper function to fetch data length from a store
        function fetchDataLength(storeName) {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(storeName, 'readonly');
                const store = transaction.objectStore(storeName);
                const countRequest = store.count();

                countRequest.onsuccess = function () {
                    resolve(countRequest.result);
                };

                countRequest.onerror = function () {
                    console.error(`Error fetching data from ${storeName} store`);
                    reject(`Error fetching data from ${storeName}`);
                };
            });
        }

        // Fetch lengths of all stores and aggregate
        Promise.all([
            fetchDataLength('carOwner'),
            fetchDataLength('customer'),
            fetchDataLength('bookings'),
        ])
            .then(([carOwnerLength, customerLength, bookingsLength]) => {
                // Prepare the data for the donut chart
                const chartData = {
                    labels: ['Owners', 'Customers', 'Bookings'],
                    datasets: [
                        {
                            data: [carOwnerLength, customerLength, bookingsLength],
                            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Colors for the chart
                            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Colors on hover
                        },
                    ],
                };

                // Create the chart
                const ctx = document.getElementById('availabilityChart').getContext('2d');
                new Chart(ctx, {
                    type: 'doughnut', // Chart type
                    data: chartData,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                display: false, // Disable the legend
                            },
                            tooltip: {
                                enabled: true, // Enable tooltips for interactivity
                            },
                        },
                    },
                });
            })
            .catch((error) => {
                console.error('Error fetching data for the chart:', error);
            });
    };

    request.onerror = function () {
        console.error('Error opening IndexedDB');
    };
}

function fetchStoreStats(callback) {
    const request = indexedDB.open('CarRentalSystem', 1);

    request.onupgradeneeded = function (event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('carOwner')) {
            db.createObjectStore('carOwner', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('customer')) {
            db.createObjectStore('customer', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('bookings')) {
            db.createObjectStore('bookings', { keyPath: 'id', autoIncrement: true });
        }
    };

    request.onsuccess = function (event) {
        const db = event.target.result;
        function fetchDataLength(storeName) {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(storeName, 'readonly');
                const store = transaction.objectStore(storeName);
                const countRequest = store.count();

                countRequest.onsuccess = function () {
                    resolve(countRequest.result);
                };

                countRequest.onerror = function () {
                    console.error(`Error fetching data from ${storeName}`);
                    reject(`Error fetching data from ${storeName}`);
                };
            });
        }

        Promise.all([
            fetchDataLength('carOwner'),
            fetchDataLength('customer'),
            fetchDataLength('bookings')
        ])
            .then(([carOwnerLength, customerLength, bookingsLength]) => {
                const totalStats = {
                    carOwners: carOwnerLength,
                    customers: customerLength,
                    bookings: bookingsLength,
                };
                callback(totalStats);
            })
            .catch(error => {
                console.error('Error fetching store stats:', error);
                callback(null);
            });
    };

    request.onerror = function () {
        console.error('Error opening IndexedDB');
        callback(null);
    };
}


function displayData(type) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('CarRentalSystem', 1);
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(type, 'readonly');
            const store = transaction.objectStore(type);
            const data = [];
            const cursorRequest = store.openCursor();

            cursorRequest.onsuccess = (e) => {
                const cursor = e.target.result;
                if (cursor) {
                    data.push(cursor.value);
                    cursor.continue();
                } else {
                    // Generate the list with buttons based on the user status
                    const listItems = data.map(item => {
                        const isBlocked = item.status === 'blocked';
                        return `
                            <li class="p-2 border-b border-gray-300 flex justify-between items-center">
                                <span>${item.email}</span>
                                <button 
                                    class="block-btn ${isBlocked ? 'bg-red-500' : 'bg-green-500'} text-white py-1 px-3 rounded"
                                    data-email="${item.email}"
                                    ${isBlocked ? 'disabled' : ''}
                                >
                                    ${isBlocked ? 'Blocked' : 'Block'}
                                </button>
                            </li>
                        `;
                    }).join('');

                    resolve(`<ul class="space-y-2">${listItems}</ul>`);

                    // Add event listeners to buttons after the list is rendered
                    setTimeout(() => {
                        document.querySelectorAll('.block-btn').forEach(button => {
                            button.addEventListener('click', (e) => handleBlockButtonClick(e, db, type));
                        });
                    }, 0);
                }
            };

            cursorRequest.onerror = () => {
                reject('Error reading data from store');
            };
        };
        request.onerror = () => {
            reject('Failed to open the database');
        };
    });
}
function fetchBookingsData() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('CarRentalSystem', 1);
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction('bookings', 'readonly');
            const store = transaction.objectStore('bookings');
            const data = [];
            const cursorRequest = store.openCursor();

            cursorRequest.onsuccess = (e) => {
                const cursor = e.target.result;
                if (cursor) {
                    data.push(cursor.value);
                    cursor.continue();
                } else {
                    // Generate HTML for displaying bookings
                    const listItems = data.map(item => `
                        <li class="p-2 border-b border-gray-300">
                            <div><strong>Car-ID:</strong> ${item.id}</div>
                            <div><strong>Customer:</strong> ${item.customerUsername}</div>
                            <div><strong>Book-Duration:</strong> ${item.duration.duration} ${item.duration.type}</div>
                            <div><strong>Status:</strong> ${item.status}</div>
                        </li>
                    `).join('');


                    resolve(`<ul class="space-y-2">${listItems}</ul>`);
                }
            };
            cursorRequest.onerror = () => {
                reject('Error reading data from store');
            };
        };
        request.onerror = () => {
            reject('Failed to open the database');
        };
    });
}
function handleBlockButtonClick(event, db, storeName) {
    const button = event.target;
    const email = button.getAttribute('data-email');

    if (confirm(`Are you sure you want to block ${email}?`)) {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const getRequest = store.get(email);
        getRequest.onsuccess = () => {
            const user = getRequest.result;
            if (user) {
                // Update the user's status to 'blocked'
                user.status = 'blocked';
                const updateRequest = store.put(user);

                updateRequest.onsuccess = () => {
                    // Change the button appearance
                    button.textContent = 'Blocked';
                    button.classList.remove('bg-green-500');
                    button.classList.add('bg-red-500');
                    button.disabled = true;
                };
                updateRequest.onerror = () => {
                    alert('Failed to update the user status.');
                };
            } else {
                alert('User not found.');
            }
        };
        getRequest.onerror = () => {
            alert('Failed to retrieve the user.');
        };
    }
}
function renderDonutChart() {
    const ctx = document.getElementById('userPieChart').getContext('2d');

    // Fetch data for customers, owners, and bookings
    Promise.all([
        getTotalCount('customer'),
        getTotalCount('carOwner'),
        getTotalCount('bookings') // Add bookings data
    ]).then(([customers, owners, bookings]) => {
        const data = {
            labels: ['Customers', 'Owners', 'Bookings'], // Updated labels
            datasets: [{
                label: 'Stats',
                data: [customers, owners, bookings], // Include bookings data
                backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
                hoverBackgroundColor: ['#36A2EB80', '#FF638480', '#FFCE5680']
            }]
        };

        new Chart(ctx, {
            type: 'doughnut', // Change to doughnut
            data: data,
            options: {
                plugins: {
                    legend: {
                        position: 'bottom', // Position the legend
                        labels: {
                            color: '#ffffff', // Adjust legend text color
                        }
                    }
                },
                cutout: '50%', // Creates the donut effect (50% hollow center)
                responsive: true, // Makes the chart responsive
                maintainAspectRatio: false // Adjusts the aspect ratio
            }
        });
    }).catch(error => {
        console.error('Error fetching data for the chart:', error);
    });
}

function getTotalCount(storeName) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('CarRentalSystem', 1);
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const countRequest = store.count();

            countRequest.onsuccess = () => resolve(countRequest.result);
            countRequest.onerror = () => reject('Failed to count records in ' + storeName);
        };
        request.onerror = () => reject('Failed to open IndexedDB');
    });
}
