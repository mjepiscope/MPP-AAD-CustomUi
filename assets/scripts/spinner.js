export function setupSpinner() {
    var spinner = window.document.querySelector('div.spinner-overlay');

    if (!spinner) return;

    spinner.style.display = 'none';
}

export function setupSpinnerTriggerButtons(parentSelector, buttonSelectors) {
    //setupSpinner();

    /*var divButtons = window.document.querySelector('div.buttons');*/
    var divButtons = window.document.querySelector(parentSelector);

    if (!divButtons) return;

    /*var buttons = Array.prototype.slice.call(divButtons.querySelectorAll('button#next, button#verifyCode, button#cancel'), 0);*/
    var buttons = Array.prototype.slice.call(divButtons.querySelectorAll(buttonSelectors), 0);

    buttons.forEach(function (b) {
        b.addEventListener('click',
            function () {

                if (!hasErrorMessage()) {
                    spinner.style.display = 'block';
                }
            });
    });
}

//function setupSpinner() {
//    var spinner = window.document.querySelector('div.spinner-overlay');

//    if (!spinner) return;

//    spinner.style.display = 'none';

//    // Triggers which show the spinner
//    setupSpinnerTriggers(spinner);

//    // Observers which hide the spinner
//    setupSpinnerObservers(spinner);
//}

//function setupSpinnerTriggers(spinner) {
//    setupSigninEnterKeyTrigger(spinner);
//    setupButtonTriggers(spinner);
//    setupVerificationCodeTrigger(spinner);
//}

//function setupSigninEnterKeyTrigger(spinner) {
//    var txtPassword = window.document.querySelector('input#password');

//    if (!txtPassword) return;

//    txtPassword.addEventListener('keyup', function (event) {
//        if (event.which === 13 && !hasErrorMessage()) {
//            spinner.style.display = 'block';
//        }
//    });
//}

//function setupButtonTriggers(spinner) {
//    var divButtons = window.document.querySelector('div.buttons');

//    if (!divButtons) return;

//    var buttons = Array.prototype.slice.call(divButtons.querySelectorAll('button#next, button#verifyCode, button#cancel'), 0);

//    buttons.forEach(function (b) {
//        b.addEventListener('click',
//            function () {

//                if (!hasErrorMessage()) {
//                    spinner.style.display = 'block';
//                }
//            });
//    });
//}

//function setupVerificationCodeTrigger(spinner) {
//    var textBox = window.document.querySelector('input#verificationCode');
//    var verifyButton = window.document.querySelector('button#verifyCode');

//    if (!textBox) return;

//    textBox.addEventListener('keyup', function (event) { verificationCodeEventHandler(event, verifyButton, textBox, spinner); });
//    textBox.addEventListener('paste', function (event) { verificationCodeEventHandler(event, verifyButton, textBox, spinner); });
//}

//function setupSpinnerObservers(spinner) {
//    setupParagraphObservers(spinner);
//    setupDivObservers(spinner);
//}

//function setupParagraphObservers(spinner) {
//    var pObserver = new window.MutationObserver(function () {
//        spinner.style.display = 'none';
//    }.bind(this));

//    var paragraphs = Array.prototype.slice.call(window.document.querySelectorAll('div.error p'), 0);

//    paragraphs.forEach(function (p) {
//        pObserver.observe(p, { characterData: true });
//    });
//}

//function setupDivObservers(spinner) {
//    var dObserver = new window.MutationObserver(function () {
//        spinner.style.display = 'none';
//    }.bind(this));

//    var divs = Array.prototype.slice.call(window.document.querySelectorAll('div.error.pageLevel, div#codeVerification, div#codeVerification div.error'), 0);

//    divs.forEach(function (d) {
//        dObserver.observe(d, { attributes: true, attributeFilter: ['style'] });
//    });
//}

//setupSpinner();