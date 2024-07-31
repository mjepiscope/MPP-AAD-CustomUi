import { handleRequest } from './emailVerificationStepIndicator.js';
import { setSpinnerStyleDisplay, setupSpinnerTriggerButtons } from './spinner.js';

setSpinnerStyleDisplay('none');
setupSpinnerTriggerButtons('div.buttons', 'button#continue, button#readOnlyEmail_ver_but_send, button#readOnlyEmail_ver_but_verify, button#readOnlyEmail_ver_but_resend');

$(document).ajaxSend(function (e, jqXhr, settings) {
    if (settings.contentType.startsWith('application/x-www-form-urlencoded')) {
        handleRequest(settings, jqXhr);
    }
});