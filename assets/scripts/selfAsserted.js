import { identifyStep, setOnStepChangeCallback } from './emailVerificationStepIndicator.js';
import { setSpinnerStyleDisplay, setupSpinnerTriggerButtons } from './spinner.js';

setSpinnerStyleDisplay('none');
setupSpinnerTriggerButtons('div.buttons', 'button#continue, button#readOnlyEmail_ver_but_send');

//let $body = document.querySelector('body');
let $api = document.querySelector('div#api');

setOnStepChangeCallback(() => {
    let step = $api.getAttribute('data-step');

    if (!step) return;

    switch (step) {
        case 'send-code':
            break;
        case 'verify-code':
            setSpinnerStyleDisplay('none');
            break;
        case 'email-verified':
            break;
    }
});

$(document).ajaxSend(function (e, jqXhr, settings) {
    if (settings.contentType.startsWith('application/x-www-form-urlencoded')) {
        identifyStep(settings, jqXhr);
    }
});