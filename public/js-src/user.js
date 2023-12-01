const userButton = document.querySelector('#user-btn');
const createNewUserButton = document.querySelector('header #new-user');
const userSectionElement = document.querySelector('.user');
const userSelectElement = document.querySelector('header #logged-in');
const userUlElement = document.querySelector('.user ul');
const userCountElement = document.querySelector('.user span');

const dialog = document.querySelector('#create-user-dialog');
const backdrop = document.querySelector('#backdrop');
const createUserFormButton = document.querySelector('#dialog-create');
const cancelUserFormButton = document.querySelector('#dialog-cancel');
const usernameInput = document.querySelector('form #username');
const passwordInput = document.querySelector('form #password');

let hasLoadedUserLogin = false;

userButton.addEventListener('click', showUsers);
createNewUserButton.addEventListener('click', toggleModal);
cancelUserFormButton.addEventListener('click', toggleModal);
createUserFormButton.addEventListener('click', createNewUser);
userSelectElement.addEventListener('change', showUsers);

function showUsers() {
    fetch('/users')
        .then(response => response.json())
        .then(userArray => {
            if (!hasLoadedUserLogin){
                loadUserLogins(userArray);
                hasLoadedUserLogin = true;
            }
            createAndDisplayUsers(userArray)
        }).catch(error => {
        console.error('Something went wrong:', error); // TODO: make better error-handling
    });
}

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

function loadUserLogins(userArray) {
    userArray.forEach(userObject => {
        const username = userObject.username;
        const id = userObject.user_id;

        const option = createUserOption(username,id);

        userSelectElement.appendChild(option);
    });
}

function createUserOption(username,id) {
    const option = document.createElement('option');
    option.innerText = username;
    option.setAttribute('value', id);

    return option
}

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