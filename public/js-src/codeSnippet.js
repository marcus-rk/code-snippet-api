const codeSnippetButton = document.querySelector('#code-snippet-btn');
const codeSnippetSectionElement = document.querySelector('.code-snippet');
const codeSnippetUlElement = document.querySelector('.code-snippet ul');

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

    codeSnippetSectionElement.classList.remove('hidden');
}

function getCodeSnippetElement(codeSnippetObject) {
    const title = codeSnippetObject.title;
    const code = codeSnippetObject.code_snippet;

    const li = document.createElement('li');
    const spanTitle = document.createElement('span');
    const spanCode = document.createElement('span');

    spanTitle.innerText = `Title: ${title}`;
    spanCode.innerText = `Code:\n${code}`;

    li.appendChild(spanTitle);
    li.appendChild(spanCode);

    return li;

}