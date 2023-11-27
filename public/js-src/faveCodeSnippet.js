const faveSnippetButton = document.querySelector('#fave-snippet-btn');
const faveSnippetSectionElement = document.querySelector('.fave-snippet');
const faveSnippetUlElement = document.querySelector('.fave-snippet ul');
const faveSnippetCountElement = document.querySelector('.fave-snippet span');


faveSnippetButton.addEventListener('click', showFaveCodeSnippets);

function showFaveCodeSnippets() {
    const userId = getCurrentUserID();

    fetch(`/code-snippet-faves/${userId}`)
        .then(response => response.json())
        .then(faveSnippetArray => createAndDisplayFaveSnippets(faveSnippetArray)
        ).catch(error => {
        console.error('Something went wrong:', error); // TODO: make better error-handling
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
    const programmingLanguage = faveSnippetObject.programming_language;
    const code = faveSnippetObject.code;

    const li = document.createElement('li');
    const spanTitle = document.createElement('span');
    const spanAuthor = document.createElement('span');
    const spanProgrammingLanguage = document.createElement('span');
    const spanCode = document.createElement('span');

    spanTitle.innerText = `Title: ${title}`;
    spanAuthor.innerText = `Author: ${author}`;
    spanProgrammingLanguage.innerText = `Programming language: ${programmingLanguage}`;
    spanCode.innerText = `\n ${code}`;

    li.appendChild(spanTitle);
    li.appendChild(spanAuthor);
    li.appendChild(spanProgrammingLanguage);
    li.appendChild(spanCode);

    return li;
}