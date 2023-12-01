// code snippet section
const codeSnippetButton = document.querySelector('#code-snippet-btn');
const codeSnippetSectionElement = document.querySelector('.code-snippet');
const codeSnippetUlElement = document.querySelector('.code-snippet ul');
const codeSnippetCountElement = document.querySelector('.code-snippet span');

// Create code snippet modal
const createCodeShowDialog = document.querySelector('#create-code-snippet-btn');
const createCodeDialog = document.querySelector('#create-code-dialog');
const createCodeTitle = document.querySelector('#create-code-dialog #title');
const createCodeLanguage = document.querySelector('#create-code-dialog #language');
const createCodeBody = document.querySelector('#create-code-dialog #code');
const createCodeButton = document.querySelector('#code-create');
const cancelCodeButton = document.querySelector('#code-cancel');

codeSnippetButton.addEventListener('click', showCodeSnippets);
createCodeShowDialog.addEventListener('click', ()=> {
    toggleCreationModal();
    renderProgrammingLanguages();
});
createCodeButton.addEventListener('click', createNewCodeSnippet);
cancelCodeButton.addEventListener('click', toggleCreationModal);
createCodeBody.addEventListener('keydown', (event)=> {
    if (event.key === 'Tab') {
        event.preventDefault();
        createCodeBody.value += '\t'; // makes it possible to do tab in textarea
    }
});

/**
 * Fetches code snippet data from the server and updates the UI with the retrieved code snippet information.
 * @function
 */
function showCodeSnippets() {
    fetch('/code-snippets/all')
        .then(response => response.json())
        .then(codeSnippetArray => createAndDisplayCodeSnippets(codeSnippetArray)
        ).catch(error => {
        console.error('Something went wrong:', error);
    });
}

/**
 * Creates and displays code snippet information in the UI.
 *
 * @param {Array} codeSnippetArray - An array of code snippet objects containing code snippet information.
 */
function createAndDisplayCodeSnippets(codeSnippetArray) {
    hideSections();
    clearUl(codeSnippetUlElement);

    codeSnippetArray.forEach(codeSnippetObject => {
        const codeSnippetLiElement = getCodeSnippetElement(codeSnippetObject);
        renderLiToUl(codeSnippetUlElement, codeSnippetLiElement);
    });

    codeSnippetCountElement.innerText = `(Found ${codeSnippetArray.length} code-snippets)`;
    codeSnippetSectionElement.classList.remove('hidden');
}

/**
 * Creates a list item element representing a code snippet.
 *
 * @param {Object} codeSnippetObject - The code snippet object containing code snippet information.
 * @returns {HTMLLIElement} - The created list item element.
 */
function getCodeSnippetElement(codeSnippetObject) {
    const title = codeSnippetObject.title;
    const author = codeSnippetObject.author;
    const author_id = codeSnippetObject.author_id;
    const snippet_id = codeSnippetObject.snippet_id;
    const programmingLanguage = codeSnippetObject.programming_language;
    const date = codeSnippetObject.date.slice(0,10);
    const code = codeSnippetObject.code;
    const codeFormatted = code.replaceAll('\t', '\n') // tab and new line

    const li = document.createElement('li');
    const spanTitle = document.createElement('span');
    const spanAuthor = document.createElement('span');
    const spanProgrammingLanguage = document.createElement('span');
    const spanDate = document.createElement('span');
    const pre = document.createElement('pre');
    const codeTag = document.createElement('code');

    spanTitle.innerText = `Title: ${title}`;
    spanAuthor.innerText = `Author: ${author}`;
    spanProgrammingLanguage.innerText = `Programming language: ${programmingLanguage}`;
    spanDate.innerText = `Date: ${date}`;
    codeTag.innerText = `\n${codeFormatted}`;

    pre.appendChild(codeTag);

    li.appendChild(spanTitle);
    li.appendChild(spanAuthor);
    li.appendChild(spanProgrammingLanguage);
    li.appendChild(spanDate);
    li.appendChild(pre);

    // If the logged-in user is NOT the same as code snippet author, create favorite button
    if (author_id !== getCurrentUserID()) {
        const button = createFavoriteButton(snippet_id);
        li.appendChild(button);
    }

    return li;
}

/**
 * Creates a favorite button element representing a code snippet.
 *
 * @param {Object} snippet_id - The snippet_id that matches the code_snippet
 * @returns {HTMLButtonElement} - The created button element.
 */
function createFavoriteButton(snippet_id) {
    const button = document.createElement('button');
    button.innerText = "favorite this";
    button.setAttribute('snippet-id', snippet_id);
    button.addEventListener('click', (event) => {
        const snippet_id = event.target.getAttribute('snippet-id');
        createNewFaveCodeSnippet(parseInt(snippet_id));
        button.classList.add('hidden');
    });

    return button;
}

/**
 * Creates a new code snippet by sending a POST request to the server.
 */
function createNewCodeSnippet() {
    const title = createCodeTitle.value;
    const language_id = createCodeLanguage.value;
    const code_snippet = createCodeBody.value;
    const user_id = getCurrentUserID();

    fetch("/code-snippets/new", {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            "title": title,
            "language_id": language_id,
            "code_snippet": code_snippet,
            "user_id": user_id
        })
    }).then(response => {
        if (response.ok) {
            console.log('Code-snippet created successfully');
            showCodeSnippets();
            toggleCreationModal();
        } else {
            console.error('Something went wrong:', response.statusText);
            return Promise.reject(response.status); // Reject the promise with the status
        }
    }).catch(error => {
        console.error('Unhandled error:', error);
    });
}

/**
 * Renders the programming languages in the create code snippet form select.
 */
function renderProgrammingLanguages() {
    fetch('/programming_languages/all')
        .then(response => response.json())
        .then(languagesArray => {
            loadProgrammingLanguages(languagesArray);
        }).catch(error => {
        console.error('Something went wrong:', error);
    });
}

/**
 * Renders programming languages into the create code snippet form select.
 *
 * @param {Array} languagesArray - An array of language objects containing programming language information.
 */
function loadProgrammingLanguages(languagesArray) {
    languagesArray.forEach(languageObject => {
        const id = languageObject.language_id;
        const name = languageObject.language_name;

        const option = createLanguageOption(name,id);

        createCodeLanguage.appendChild(option);
    });
}

/**
 * Creates an option element for a programming language in the select element.
 *
 * @param {string} name - The name of the programming language.
 * @param {number} id - The ID of the programming language.
 * @returns {HTMLOptionElement} - The created option element.
 */
function createLanguageOption(name,id) {
    const option = document.createElement('option');
    option.innerText = name;
    option.setAttribute('value', id);

    return option;
}

function toggleCreationModal() {
    console.log("dick")
    createCodeTitle.value = '';
    createCodeBody.value = '';
    createCodeDialog.classList.toggle('hidden');
    backdrop.classList.toggle('hidden');
}