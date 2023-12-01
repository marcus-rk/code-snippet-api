// User section
const userButton = document.querySelector('#user-btn');
const createNewUserButton = document.querySelector('header #new-user');
const userSectionElement = document.querySelector('.user');
const userSelectElement = document.querySelector('header #logged-in');
const userUlElement = document.querySelector('.user ul');
const userCountElement = document.querySelector('.user span');

// Creating a user modal
const dialog = document.querySelector('#create-user-dialog');
const backdrop = document.querySelector('#backdrop');
const createUserFormButton = document.querySelector('#dialog-create');
const cancelUserFormButton = document.querySelector('#dialog-cancel');
const usernameInput = document.querySelector('form #username');
const passwordInput = document.querySelector('form #password');

userButton.addEventListener('click', showUsers);
createNewUserButton.addEventListener('click', toggleModal);
cancelUserFormButton.addEventListener('click', toggleModal);
createUserFormButton.addEventListener('click', createNewUser);
// When user changes, show user section
userSelectElement.addEventListener('change', showUsers);

let hasLoadedUserLogin = false;

/**
 * Fetches user data from the server and updates the UI with the retrieved user information.
 */
function showUsers() {
    fetch('/users')
        .then(response => response.json())
        .then(userArray => {
            if (!hasLoadedUserLogin){
                renderUserLogins(userArray);
                hasLoadedUserLogin = true;
            }
            createAndDisplayUsers(userArray)
        }).catch(error => {
        console.error('Something went wrong:', error);
    });
}

/**
 * Creates and displays user information in the UI.
 *
 * @param {Array} userArray - An array of user objects containing user information.
 */
function createAndDisplayUsers(userArray) {
    hideSections();
    clearUl(userUlElement);

    userArray.forEach(userObject => {
        const userLiElement = getUserElement(userObject);
        renderLiToUl(userUlElement, userLiElement);
    });

    userCountElement.innerText = `(Found ${userArray.length} users)`;
    userSectionElement.classList.remove('hidden');
}

/**
 * Creates a list item element representing a user.
 *
 * @param {Object} userObject - The user object containing user information.
 * @returns {HTMLLIElement} - The created list item element.
 */
function getUserElement(userObject) {
    const username = userObject.username;
    const id = userObject.user_id;
    const date = userObject.created_at.slice(0,10); // YYYY-MM-DD (not time)

    const li = document.createElement('li');
    const spanUsername = document.createElement('span');
    const spanId = document.createElement('span');
    const spanDate = document.createElement('span');

    spanUsername.innerText = `Username: ${username}`;
    spanId.innerText = `ID: ${id}`;
    spanDate.innerText = `Created: ${date}`;

    li.appendChild(spanUsername);
    li.appendChild(spanId);
    li.appendChild(spanDate);

    return li;
}

/**
 * Render user logins into the select element.
 *
 * @param {Array} userArray - An array of user objects containing user information.
 */
function renderUserLogins(userArray) {
    userArray.forEach(userObject => {
        const username = userObject.username;
        const id = userObject.user_id;

        const option = createUserOption(username,id);

        userSelectElement.appendChild(option);
    });
}

/**
 * Creates an option element for a user in the select element.
 *
 * @param {string} username - The username of the user.
 * @param {number} id - The user ID.
 * @returns {HTMLOptionElement} - The created option element.
 */
function createUserOption(username,id) {
    const option = document.createElement('option');
    option.innerText = username;
    option.setAttribute('value', id);

    return option
}

/**
 * Creates a new user by sending a POST request to the server API.
 */
function createNewUser() {
    const username = usernameInput.value;
    const password = passwordInput.value;

    fetch("/users/new", {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    }).then(response => {
            if (response.ok) {
                console.log('User created successfully');
                updateToCreatedUser(username);
                toggleModal();
                showUsers();
            } else {
                console.error('Something went wrong:', response.statusText);
                return Promise.reject(response.status); // Reject the promise with the status
            }
        }).catch(error => {
            if (error === 403) {
                console.log('User exists');
            } else {
                console.error('Unhandled error:', error);
            }
        });
}

/**
 * Updates the user select element to include and select newly created user.
 *
 * @param {string} username - The username of the newly created user.
 */
function updateToCreatedUser(username) {
    const lastOptionValue = parseInt(userSelectElement.lastChild.value);
    const newUserOption = createUserOption(username, lastOptionValue + 1);
    userSelectElement.appendChild(newUserOption);
    userSelectElement.value = newUserOption.value;
}

function toggleModal() {
    usernameInput.value = '';
    passwordInput.value = '';
    dialog.classList.toggle('hidden');
    backdrop.classList.toggle('hidden');
}

function getCurrentUserID() {
    return parseInt(userSelectElement.value);
}