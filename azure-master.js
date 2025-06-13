/* The following script is confirmed working on Page Layout Versions 1.2.0 (Sign in and MFA page)
 * This might not work as expected if the older or newer PLVs are used. - Kael
 */

function changeSigninText() {
    // Added slice to support IE 11
    var elements = Array.prototype.slice.call(window.document.querySelectorAll('div.intro h2, div.buttons button#next'), 0);

    elements.forEach(function (e) {
        e.textContent = 'Log in';
    });
}

function setupSpinner() {
    var spinner = window.document.querySelector('div.spinner-overlay');

    if (!spinner) return;

    spinner.style.display = 'none';

    // Triggers which show the spinner
    setupSpinnerTriggers(spinner);

    // Observers which hide the spinner
    setupSpinnerObservers(spinner);
}

function setupSpinnerTriggers(spinner) {
    setupSigninEnterKeyTrigger(spinner);
    setupButtonTriggers(spinner);
    setupVerificationCodeTrigger(spinner);
}

function setupSigninEnterKeyTrigger(spinner) {
    var txtPassword = window.document.querySelector('input#password');

    if (!txtPassword) return;

    txtPassword.addEventListener('keyup', function (event) {
        if (event.which === 13 && !hasErrorMessage()) {
            spinner.style.display = 'block';
        }
    });
}

function setupButtonTriggers(spinner) {
    var divButtons = window.document.querySelector('div.buttons');

    if (!divButtons) return;

    var buttons = Array.prototype.slice.call(divButtons.querySelectorAll('button#next, button#verifyCode, button#cancel'), 0);

    buttons.forEach(function (b) {
        b.addEventListener('click',
            function () {

                if (!hasErrorMessage()) {
                    spinner.style.display = 'block';
                }
            });
    });
}

function setupVerificationCodeTrigger(spinner) {
    var textBox = window.document.querySelector('input#verificationCode');
    var verifyButton = window.document.querySelector('button#verifyCode');

    if (!textBox) return;

    textBox.addEventListener('keyup', function (event) { verificationCodeEventHandler(event, verifyButton, textBox, spinner); });
    textBox.addEventListener('paste', function (event) { verificationCodeEventHandler(event, verifyButton, textBox, spinner); });
}

function verificationCodeEventHandler(event, verifyButton, textBox, spinner) {
    // Do not show spinner if verify code button is displayed (PLV 1.0.0)
    if (!verifyButton || verifyButton.style.display !== 'none') return;

    // This code template came from the actual Azure Page
    if (event.type === "paste") {
        // Need to delay to allow paste to occur
        window.setTimeout(function () {
            validateVerificationCode(textBox, spinner);
        }, 0);
    } else if (event.which >= 48 && event.which <= 57 || event.which >= 96 && event.which <= 105 || event.which === 229) {
        // Ensure that only numeric keys have been pushed, this prevents the crtl+v keyup
        // event from revalidating. Unfortunately IE9< doesn't support the new input
        // event.
        // Some Android Chrome Browser gives keycode 229 when input method editor is processing key input
        validateVerificationCode(textBox, spinner);
    }

    return;
}

function validateVerificationCode(textBox, spinner) {
    // window.SETTINGS came from accessible Azure object
    if (!textBox.value || textBox.value.length.toString() !== window.SETTINGS.config.pinLength) return;

    var pattern = textBox.getAttribute("pattern");

    if (!pattern) return;

    var isMatch = new RegExp(pattern).exec(textBox.value);

    if (isMatch) {
        spinner.style.display = 'block';
    }
}

function hasErrorMessage() {
    var paragraphs = Array.prototype.slice.call(window.document.querySelectorAll('div.error p'), 0);

    for (var i = 0; i < paragraphs.length; i++) {
        if (!!paragraphs[i].textContent
            && paragraphs[i].parentElement.style.display !== 'none')
            return true;
    }

    return false;
}

function setupSpinnerObservers(spinner) {
    setupParagraphObservers(spinner);
    setupDivObservers(spinner);
}

function setupParagraphObservers(spinner) {
    var pObserver = new window.MutationObserver(function () {
        spinner.style.display = 'none';
    }.bind(this));

    var paragraphs = Array.prototype.slice.call(window.document.querySelectorAll('div.error p'), 0);

    paragraphs.forEach(function (p) {
        pObserver.observe(p, { characterData: true });
    });
}

function setupDivObservers(spinner) {
    var dObserver = new window.MutationObserver(function () {
        spinner.style.display = 'none';
    }.bind(this));

    var divs = Array.prototype.slice.call(window.document.querySelectorAll('div.error.pageLevel, div#codeVerification, div#codeVerification div.error'), 0);

    divs.forEach(function (d) {
        dObserver.observe(d, { attributes: true, attributeFilter: ['style'] });
    });
}

function focusOnPasswordElementIfExists() {
    var element = window.document.querySelector('input#password');

    if (!element) return;

    element.focus();
}

function initializeControls() {
    changeSigninText();
    setupSpinner();
    focusOnPasswordElementIfExists();
}

initializeControls();
