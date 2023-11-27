const userButton = document.querySelector('#user-btn');
const userSectionElement = document.querySelector('.user');
const userUlElement = document.querySelector('.user ul');

const codeSnippetButton = document.querySelector('#code-snippet-btn');
const codeSnippetSectionElement = document.querySelector('.code-snippet');
const codeSnippetUlElement = document.querySelector('.code-snippet ul');

const faveSnippetButton = document.querySelector('#fave-snippet-btn');
const faveSnippetSectionElement = document.querySelector('.fave-snippet');
const faveSnippetUlElement = document.querySelector('.fave-snippet ul');

userButton.addEventListener('click', showUsers);
codeSnippetButton.addEventListener('click', showCodeSnippets);
faveSnippetButton.addEventListener('click', showFaveCodeSnippets);

function showUsers() {
    fetch('/users')
        .then(response => response.json())
        .then(userArray => createAndDisplayUsers(userArray)
        ).catch(error => {
        console.error('Something went wrong:', error); // TODO: make better error-handling
    });
}

function showCodeSnippets() {
    fetch('/code-snippets')
        .then(response => response.json())
        .then(codeSnippetArray => createAndDisplayCodeSnippets(codeSnippetArray)
        ).catch(error => {
        console.error('Something went wrong:', error); // TODO: make better error-handling
    });
}

function showFaveCodeSnippets() {
    fetch('/code-snippet-faves')
        .then(response => response.json())
        .then(faveSnippetArray => createAndDisplayFaveSnippets(faveSnippetArray)
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

    const li = document.createElement('li');
    const span = document.createElement('span');

    span.innerText = `Username: ${username}, id: ${id}`;

    li.appendChild(span);

    return li;
}

function createAndDisplayCodeSnippets(codeSnippetArray) {
    hideSections();
    clearUl(codeSnippetUlElement);

    codeSnippetArray.forEach(codeSnippetObject => {
        const codeSnippetLiElement = getCodeSnippetElement(codeSnippetObject);
        renderLiToUl(codeSnippetUlElement, codeSnippetLiElement);
    });

    codeSnippetSectionElement.classList.remove('hidden');
}

function getCodeSnippetElement(codeSnippetObject) {
    const title = codeSnippetObject.title;
    const code = codeSnippetObject.code_snippet;

    const li = document.createElement('li');
    const spanTitle = document.createElement('span');
    const spanCode = document.createElement('span');

    spanTitle.innerText = `Title: ${title}`;
    spanCode.innerText = `Code: ${code}`;

    li.appendChild(spanTitle);
    li.appendChild(spanCode);

    return li;

}

function createAndDisplayFaveSnippets(faveSnippetArray) {
    hideSections();
    clearUl(faveSnippetUlElement);

    faveSnippetArray.forEach(faveSnippetObject => {
        const faveSnippetLiElement = getFaveSnippetElement(faveSnippetObject);
        renderLiToUl(faveSnippetUlElement, faveSnippetLiElement);
    });

    faveSnippetSectionElement.classList.remove('hidden');
}

function getFaveSnippetElement(faveSnippetObject) {
    const id = faveSnippetObject.fave_id;
    const date = faveSnippetObject.created_at;

    const li = document.createElement('li');
    const spanId = document.createElement('span');
    const spanDate = document.createElement('span');

    spanId.innerText = `ID: ${id}`;
    spanDate.innerText = `Date: ${date}`;

    li.appendChild(spanId);
    li.appendChild(spanDate);

    return li;
}

function renderLiToUl(ulElement, liElement) {
    ulElement.appendChild(liElement);
}

function clearUl(ulElement) {
    ulElement.innerHTML = '';
}

function hideSections() {
    if (!userSectionElement.classList.contains('hidden')){
        userSectionElement.classList.add('hidden');
    }
    if (!codeSnippetSectionElement.classList.contains('hidden')){
        codeSnippetSectionElement.classList.add('hidden');
    }
    if (!faveSnippetSectionElement.classList.contains('hidden')){
        faveSnippetSectionElement.classList.add('hidden');
    }
}