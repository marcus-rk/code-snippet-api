const userButton = document.querySelector('#user-btn');
const userSectionElement = document.querySelector('.user');
const userUlElement = document.querySelector('.user ul');

userButton.addEventListener('click', showUsers);

function showUsers() {
    fetch('/users')
        .then(response => response.json())
        .then(userArray => createAndDisplayUsers(userArray)
        ).catch(error => {
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