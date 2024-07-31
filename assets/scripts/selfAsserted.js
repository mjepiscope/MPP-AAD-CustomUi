import { identifyStep, setOnStepChangeCallback } from './emailVerificationStepIndicator.js';
import { setSpinnerStyleDisplay, setupSpinnerTriggerButtons } from './spinner.js';

setSpinnerStyleDisplay('none');
setupSpinnerTriggerButtons('div.buttons', 'button#continue');

let $body = $('body');

setOnStepChangeCallback(() => {
    let step = $body.attr('data-step');

    if (!step) return;

    alert(step);
});

$(document).ajaxSend(function (e, jqXhr, settings) {
    if (settings.contentType.startsWith('application/x-www-form-urlencoded')) {
        identifyStep(settings, jqXhr);
    }
});