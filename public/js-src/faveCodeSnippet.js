const faveSnippetButton = document.querySelector('#fave-snippet-btn');
const faveSnippetSectionElement = document.querySelector('.fave-snippet');
const faveSnippetUlElement = document.querySelector('.fave-snippet ul');
const faveSnippetCountElement = document.querySelector('.fave-snippet span');

faveSnippetButton.addEventListener('click', showFaveCodeSnippets);

/**
 * Fetches favorite code snippet data from the server and updates the UI with the retrieved information.
 */
function showFaveCodeSnippets() {
    const userId = getCurrentUserID();

    fetch(`/${userId}/code-snippet-faves`)
        .then(response => response.json())
        .then(faveSnippetArray => createAndDisplayFaveSnippets(faveSnippetArray)
        ).catch(error => {
        console.error('Something went wrong:', error);
    });
}

/**
 * Creates and displays favorite code snippet information in the UI.
 *
 * @param {Array} faveSnippetArray - An array of favorite code snippet objects containing information.
 */
function createAndDisplayFaveSnippets(faveSnippetArray) {
    hideSections();
    clearUl(faveSnippetUlElement);

    faveSnippetArray.forEach(faveSnippetObject => {
        const faveSnippetLiElement = getFaveSnippetElement(faveSnippetObject);
        renderLiToUl(faveSnippetUlElement, faveSnippetLiElement);
    });

    faveSnippetCountElement.innerText = `(Found ${faveSnippetArray.length} code-snippets)`;
    faveSnippetSectionElement.classList.remove('hidden');
}

/**
 * Creates a list item element representing a favorite code snippet.
 *
 * @param {Object} faveSnippetObject - The favorite code snippet object containing information.
 * @returns {HTMLLIElement} - The created list item element.
 */
function getFaveSnippetElement(faveSnippetObject) {
    const title = faveSnippetObject.title;
    const author = faveSnippetObject.author;
    const snippet_id = faveSnippetObject.snippet_id;
    const programmingLanguage = faveSnippetObject.programming_language;
    const code = faveSnippetObject.code;
    const codeFormatted = code.replaceAll('\t', '\n') // tab and new line

    const li = document.createElement('li');
    const spanTitle = document.createElement('span');
    const spanAuthor = document.createElement('span');
    const spanProgrammingLanguage = document.createElement('span');
    const pre = document.createElement('pre');
    const codeTag = document.createElement('code');

    spanTitle.innerText = `Title: ${title}`;
    spanAuthor.innerText = `Author: ${author}`;
    spanProgrammingLanguage.innerText = `Programming language: ${programmingLanguage}`;
    codeTag.innerText = `\n${codeFormatted}`;

    pre.appendChild(codeTag);

    li.appendChild(spanTitle);
    li.appendChild(spanAuthor);
    li.appendChild(spanProgrammingLanguage);
    li.appendChild(pre);

    // un-favorite button that matches snippet_id
    const button = document.createElement('button');
    button.innerText = "un-favorite this";
    button.setAttribute('snippet-id', snippet_id);
    button.addEventListener('click', (event) => {
        const snippet_id = event.target.getAttribute('snippet-id');
        removeFaveCodeSnippet(parseInt(snippet_id));
        showFaveCodeSnippets();
    });

    li.appendChild(button);

    return li;
}

/**
 * Creates a new favorite code snippet by sending a POST request to the server.
 *
 * @param {number} snippet_id - The ID of the code snippet to be marked as a favorite.
 */
function createNewFaveCodeSnippet(snippet_id) {
    const user_id = getCurrentUserID();

    fetch("/code-snippet-faves/new", {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            "user_id": user_id,
            "snippet_id": snippet_id
        })
    }).then(response => {
        if (response.ok) {
            console.log('code-snippet favorite successfully');
        } else {
            console.error('Something went wrong:', response.statusText);
            return Promise.reject(response.status); // Reject the promise with the status
        }
    }).catch(error => {
        console.error('Unhandled error:', error);
    });
}

/**
 * Removes a code snippet from favorites by sending a POST request to the server.
 *
 * @param {number} snippet_id - The ID of the code snippet to be removed from favorites.
 */
function removeFaveCodeSnippet(snippet_id) {
    fetch("/code-snippet-faves/remove", {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            "snippet_id": snippet_id
        })
    }).then(response => {
        if (response.ok) {
            console.log('code-snippet un-favorite successfully');
        } else {
            console.error('Something went wrong:', response.statusText);
            return Promise.reject(response.status); // Reject the promise with the status
        }
    }).catch(error => {
        console.error('Unhandled error:', error);
    });
}