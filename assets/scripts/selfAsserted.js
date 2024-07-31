import { handleRequest, setOnStepChangeCallback } from './emailVerificationStepIndicator.js';
import { setSpinnerStyleDisplay, setupSpinnerTriggerButtons } from './spinner.js';

setSpinnerStyleDisplay('none');
setupSpinnerTriggerButtons('div.buttons', 'button#continue, button#readOnlyEmail_ver_but_send, button#readOnlyEmail_ver_but_verify');

//let $api = document.querySelector('div#api');

//setOnStepChangeCallback(() => {
//    let step = $api.getAttribute('data-step');

//    if (!step) return;

//    switch (step) {
//        case 'send-code':
//            setSpinnerStyleDisplay('none');
//            break;
//        case 'verify-code':
//            document.querySelector('input#readOnlyEmail').setAttribute('disabled', 'true');
//            document.querySelector('input#readOnlyEmail_ver_input').focus();
//            setSpinnerStyleDisplay('none');
//            break;
//        case 'email-verified':
//            setSpinnerStyleDisplay('none');
//            break;
//    }
//});

$(document).ajaxSend(function (e, jqXhr, settings) {
    if (settings.contentType.startsWith('application/x-www-form-urlencoded')) {
        handleRequest(settings, jqXhr);
    }
});