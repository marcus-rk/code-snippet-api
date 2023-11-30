
// load users on page load
showUsers();

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