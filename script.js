/**
 * Get a template DOM object from the DOM and return a usable DOM object
 * from the main node within it. Assumes that there is only one main parent
 * node in the template.
 * @param {string} id the id of the template element
 * @returns {Object} a deep clone of the templated element
 */
function getElementFromTemplate(id) {
    let domNode = document.importNode(document.getElementById(id).content, true).firstElementChild;
    return domNode;
}

document.addEventListener('DOMContentLoaded', () => {

    // Listen for a click on Submit button
    document.querySelector('input#submit-button').addEventListener('click', (event) => {
        event.preventDefault();
        getInputString(event.currentTarget);   
    });
});

/**
 * This function assesses if the input string is 2 letters and then searches the API for a country code.
 * @param {HTMLElement} button The Submit button
 */
function getInputString(button) {
    // Get the input string
    const inputText =  button.previousElementSibling.previousElementSibling.value;
    if (inputText.length === 2) {
        //cleanLanguageInfo();
        //cleanHelloInfo();
        getCountryInfo(inputText);
    }
}

/**
 * This function retrieves JSON information regarding the country whose 2-letter country code was inputted.
 * @param {countryCode} countryCode The 2-letter country code
 */
function getCountryInfo(countryCode) {
    const url = `https://restcountries.eu/rest/v2/alpha/${countryCode}`; // back tick for variable pass
    const settings = {
        method: 'GET'
    };

    fetch(url, settings)
        .then(response => response.json())
        .then(json => {
            if (json.status == 404) {
                return;
            }
            cleanLanguageInfo();
            cleanHelloInfo();

            const countryName = document.querySelector('label#country-result');
            countryName.innerText = json.name;
            const countryFlag = document.querySelector('img#country-flag');
            countryFlag.src = json.flag;

            const numberOfOfficialLanguages = json.languages.length;

            for (let i = 0; i < numberOfOfficialLanguages; i++) {
                
                const newLangDiv = getElementFromTemplate('newLanguageTemplate');
                const newGreetingDiv = getElementFromTemplate('newLanguageTemplate');
                const currentLanguage = json.languages[i].name;
                const currentLanguageCode = json.languages[i].iso639_1;
                newLangDiv.querySelector('label').innerText = currentLanguage;
                newGreetingDiv.id = `language-for-${currentLanguageCode}`;
                document.querySelector('div.containerUnit5').insertAdjacentElement('beforeend', newLangDiv);
                document.querySelector('div.containerUnit6').insertAdjacentElement('beforeend', newGreetingDiv);

                sayHiInOtherLanguage(currentLanguageCode);
            }
        })
}


/**
 * This function calls an API that returns how to say Hi in another language
 * @param {String} languageCode Language Code for language to say Hi in
 */
function sayHiInOtherLanguage(languageCode) {
    const url = `https://fourtonfish.com/hellosalut/?lang=${languageCode}`; // back tick for variable pass
    const settings = {
        method: 'GET'
    };

    fetch(url, settings)
        .then(response => response.json())
        .then(json => {
            //const newLangDiv = getElementFromTemplate('newLanguageTemplate');
            const hellolabel = document.querySelector(`#language-for-${languageCode} label`);
            const languageHello = json.hello;
            hellolabel.innerText = languageHello;
            //document.querySelector('div.containerUnit6').insertAdjacentElement('beforeend', newLangDiv);
        })
}

function cleanHelloInfo() {
    let divsToClear = document.querySelectorAll('div.containerUnit6 div');
    divsToClear.forEach(div => {
        div.remove();
    });
}

function cleanLanguageInfo() {
    let divsToClear2 = document.querySelectorAll('div.containerUnit5 div');
    divsToClear2.forEach(div => {
        div.remove();
    });
}