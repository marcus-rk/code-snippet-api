const codeSnippetButton = document.querySelector('#code-snippet-btn');
const codeSnippetSectionElement = document.querySelector('.code-snippet');
const codeSnippetUlElement = document.querySelector('.code-snippet ul');
const codeSnippetCountElement = document.querySelector('.code-snippet span');

codeSnippetButton.addEventListener('click', showCodeSnippets);

function showCodeSnippets() {
    fetch('/code-snippets')
        .then(response => response.json())
        .then(codeSnippetArray => createAndDisplayCodeSnippets(codeSnippetArray)
        ).catch(error => {
        console.error('Something went wrong:', error); // TODO: make better error-handling
    });
}

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

function getCodeSnippetElement(codeSnippetObject) {
    const title = codeSnippetObject.title;
    const author = codeSnippetObject.author;
    const programmingLanguage = codeSnippetObject.programming_language;
    const date = codeSnippetObject.date.slice(0,10);
    const code = codeSnippetObject.code;

    const li = document.createElement('li');
    const spanTitle = document.createElement('span');
    const spanAuthor = document.createElement('span');
    const spanProgrammingLanguage = document.createElement('span');
    const spanDate = document.createElement('span');
    const spanCode = document.createElement('span');

    spanTitle.innerText = `Title: ${title}`;
    spanAuthor.innerText = `Author: ${author}`;
    spanProgrammingLanguage.innerText = `Programming language: ${programmingLanguage}`;
    spanDate.innerText = `Date: ${date}`;
    spanCode.innerText = `\n ${code}`;

    li.appendChild(spanTitle);
    li.appendChild(spanAuthor);
    li.appendChild(spanProgrammingLanguage);
    li.appendChild(spanDate);
    li.appendChild(spanCode);

    return li;
}