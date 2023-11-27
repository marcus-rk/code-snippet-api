const faveSnippetButton = document.querySelector('#fave-snippet-btn');
const faveSnippetSectionElement = document.querySelector('.fave-snippet');
const faveSnippetUlElement = document.querySelector('.fave-snippet ul');

faveSnippetButton.addEventListener('click', showFaveCodeSnippets);

function showFaveCodeSnippets() {
    fetch('/code-snippet-faves')
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