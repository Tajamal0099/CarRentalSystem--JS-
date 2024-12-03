import { createAccountPage, showLoginSection, showCreateAccountSection } from './signup-Login.js';
createAccountPage();
export function createInnerBody() {
    const body = document.body;

    // Create a welcome page container
    const welcomeContainer = document.createElement('div');
    welcomeContainer.id = 'welcomeContainer';
    body.appendChild(welcomeContainer);

    // Create Header
    const header = document.createElement('header');
    header.className = "flex flex-wrap items-center justify-between px-4 md:px-8 py-4";
    welcomeContainer.appendChild(header);

    const logo = document.createElement('button');
    logo.className = "text-xl font-bold text-gray-800";
    logo.textContent = "EURO ELITE®";
    header.appendChild(logo);

    const nav = document.createElement('div');
    nav.className = "md:flex hidden gap-4 md:gap-6 mt-2 md:mt-0";
    header.appendChild(nav);

    const navLinks = ["car fleet", "club cars", "conditions", "contacts"];
    navLinks.forEach(linkText => {
        const link = document.createElement('a');
        link.href = "#";
        link.className = "hover-border text-sm font-semibold";
        link.textContent = linkText;
        nav.appendChild(link);
    });

    const userActions = document.createElement('div');
    userActions.className = "flex gap-3 mt-2 md:mt-0";
    header.appendChild(userActions);

    const icons = ["car", "user", "phone", "envelope"];
    // userActions.appendChild(createLanguageLink("ENG"));
    icons.forEach(icon => {
        const iconLink = document.createElement('a');
        iconLink.href = "#";
        iconLink.className = "text-gray-800 text-md";
        iconLink.innerHTML = `<i class="fas fa-${icon}"></i>`;
        userActions.appendChild(iconLink);
    });

    // Create Main Content
    const main = document.createElement('main');
    main.className = "flex flex-col md:flex-row mt-4 md:justify-between px-4 md:px-8 md:py-4 overflow-hidden";
    welcomeContainer.appendChild(main);

    const leftColumn = document.createElement('div');
    leftColumn.className = "text-center md:text-left md:flex md:flex-col mt-12 md:gap-7";
    main.appendChild(leftColumn);

    const title1 = document.createElement('div');
    title1.className = "text-[#009464] text-4xl md:text-[88px] font-bold";
    title1.textContent = "RENT A CAR";
    leftColumn.appendChild(title1);

    const title2 = document.createElement('div');
    title2.className = "text-[#009464] text-4xl md:text-[88px] font-bold mt-2";
    title2.textContent = "PREMIUM CLASS";
    leftColumn.appendChild(title2);

    const carImageContainer = document.createElement('div');
    carImageContainer.className = "flex justify-center w-full md:w-auto mt-8 md:mt-0";
    main.appendChild(carImageContainer);

    const carImage = document.createElement('img');
    carImage.src = "./assets/c.png";
    carImage.alt = "Car Image";
    carImage.className = "w-[100%] md:w-[600px] md:absolute md:top-60 md:-left-24 lg:w-[1000px] animate-car";
    carImageContainer.appendChild(carImage);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = "flex flex-col gap-3 mt-12 items-center md:items-start";
    main.appendChild(buttonContainer);

    const signUpButton = document.createElement('button');
    signUpButton.id = "signUpButton"; 
    signUpButton.className = "p-2 px-[45px] bg-[#009464] hover:bg-[#104937] text-white text-lg font-semibold rounded hover-slide text-center";
    signUpButton.textContent = "Sign-Up";
    buttonContainer.appendChild(signUpButton);

    const loginButton = document.createElement('button');
    loginButton.id = "loginButton";
    loginButton.className = "p-2 px-14 bg-[#009464] text-white text-lg hover:bg-[#104937] font-semibold rounded hover-slide text-center";
    loginButton.textContent = "Login";
    buttonContainer.appendChild(loginButton);
    signUpButton.addEventListener('click', function() {
        hideWelcomePage(); 
        showCreateAccountSection(); 
    });
    loginButton.addEventListener('click', function() {
        hideWelcomePage(); 
        showLoginSection(); 
    });

    const footer = document.createElement('footer');
    footer.className = "text-center font-semibold text-2xl py-2 px-4 mt-24 md:hidden";
    welcomeContainer.appendChild(footer);

    const footerContent = document.createElement('div');
    footerContent.className = "font-semibold flex justify-between font-sans";
    footer.appendChild(footerContent);

    const footerLinks = ["9+ years", "72+", "1+ bln."];
    footerLinks.forEach((linkText, index) => {
        const footerLink = document.createElement('a');
        footerLink.href = "#";
        footerLink.textContent = linkText;
        footerContent.appendChild(footerLink);
        if (index < footerLinks.length - 1) {
            footerContent.appendChild(document.createTextNode(' | '));
        }
    });
}
export function hideWelcomePage() {
    const welcomeContainer = document.getElementById('welcomeContainer');
    if (welcomeContainer) {
        welcomeContainer.style.display = 'none';
    }
}
function createLanguageLink(text) {
    const langLink = document.createElement('a');
    langLink.href = "#";
    langLink.className = "font-semibold pr-3 md:pr-8";
    langLink.textContent = text;
    return langLink;
}
createInnerBody();
document.addEventListener('DOMContentLoaded', () => {
    const loaderOverlay = document.createElement('div');
    loaderOverlay.className = 'loader-overlay';
    const wheel = document.createElement('div');
    wheel.className = 'wheel';
    loaderOverlay.appendChild(wheel);
    document.body.appendChild(loaderOverlay);
    window.onload = () => {
        setTimeout(() => {
            loaderOverlay.style.display = 'none'; // Hide loader
        }, 700); // Optional delay for smoother UX
    };
}); 