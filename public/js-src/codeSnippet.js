const codeSnippetButton = document.querySelector('#code-snippet-btn');
const codeSnippetSectionElement = document.querySelector('.code-snippet');
const codeSnippetUlElement = document.querySelector('.code-snippet ul');
const codeSnippetCountElement = document.querySelector('.code-snippet span');

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
        createCodeBody.value += '\t';
    }
});

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

    return li;
}

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

function renderProgrammingLanguages() {
    fetch('/programming_languages')
        .then(response => response.json())
        .then(languagesArray => {
            loadProgrammingLanguages(languagesArray);
        }).catch(error => {
        console.error('Something went wrong:', error);
    });
}

function loadProgrammingLanguages(languagesArray) {
    languagesArray.forEach(languageObject => {
        const id = languageObject.language_id;
        const name = languageObject.language_name;

        const option = createLanguageOption(name,id);

        createCodeLanguage.appendChild(option);
    });
}

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