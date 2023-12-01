
// load users on page load
showUsers();

function renderLiToUl(ulElement, liElement) {
    ulElement.appendChild(liElement);
}

function clearUl(ulElement) {
    ulElement.innerHTML = '';
}

function hideSections() {
    // Hide the user section if it is not already hidden
    if (!userSectionElement.classList.contains('hidden')) {
        userSectionElement.classList.add('hidden');
    }

    // Hide the code snippet section if it is not already hidden
    if (!codeSnippetSectionElement.classList.contains('hidden')) {
        codeSnippetSectionElement.classList.add('hidden');
    }

    // Hide the favorite snippet section if it is not already hidden
    if (!faveSnippetSectionElement.classList.contains('hidden')) {
        faveSnippetSectionElement.classList.add('hidden');
    }
}