const faveSnippetButton = document.querySelector('#fave-snippet-btn');
const faveSnippetSectionElement = document.querySelector('.fave-snippet');
const faveSnippetUlElement = document.querySelector('.fave-snippet ul');
const faveSnippetCountElement = document.querySelector('.fave-snippet span');


faveSnippetButton.addEventListener('click', showFaveCodeSnippets);

function showFaveCodeSnippets() {
    const userId = getCurrentUserID();

    fetch(`/${userId}/code-snippet-faves`)
        .then(response => response.json())
        .then(faveSnippetArray => createAndDisplayFaveSnippets(faveSnippetArray)
        ).catch(error => {
        console.error('Something went wrong:', error);
    });
}

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