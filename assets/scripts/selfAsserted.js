import { setSpinnerStyleDisplay, setupSpinnerTriggerButtons } from './spinner.js';

/*
    Self-Asserted Email-Verification has different steps
    Currently, there is no built-in indicator to know which step the user is currently in
    A workaround is possible by listening to AJAX calls
    Reference: https://stackoverflow.com/a/68426051
*/
const STATUS_OK = 0,
    STATUS_BAD_EMAIL = 2;

const REQUEST_TYPE_CODE_REQUEST = 'VERIFICATION_REQUEST'
    , REQUEST_TYPE_CODE_VALIDATION = 'VALIDATION_REQUEST';

let $body = $('body');

/**
 * Switches the mode of the form into validating a confirmation code.
 */
function switchToVerifyCodeMode() {
    $body.attr('data-mode', 'verify-code');
}

/**
 * Switches the mode of the form into completing sign-up.
 */
function switchToEmailVerifiedMode() {
    $body.attr('data-mode', 'email-verified');
}

/**
 * Switches the mode of the form into requesting a confirmation code.
 */
function switchToRequestConfirmationCodeMode() {
    $body.attr('data-mode', 'send-code');
}

/**
 * Callback invoked when a verification code is being requested via XHR.
 *
 * @param {jqXHR} jqXhr
 *   The XHR being sent out to get a verification code sent out.
 */
function handleSendVerificationCodeRequest(jqXhr) {
    let controlsToDisableDuringRequest = [
        '#email_ver_but_send',
    ];

    disableControlsDuringRequest(controlsToDisableDuringRequest, jqXhr);

    jqXhr.done((data) => {
        if ((data.status === "200") && (data.result === STATUS_OK)) {
            // Code sent successfully.
            switchToVerifyCodeMode();
        }
    });
}

/**
 * Callback invoked when a verification code is being validated via XHR.
 *
 * @param {jqXHR} jqXhr
 *   The XHR being sent out to validate a verification code entered by the
 *   user.
 */
function handleValidateCodeRequest(jqXhr) {
    let controlsToDisableDuringRequest = [
        '#email_ver_input',
        '#email_ver_but_verify',
        '#email_ver_but_resend',
    ];

    disableControlsDuringRequest(controlsToDisableDuringRequest, jqXhr);

    jqXhr.done((data) => {
        if (data.status === "200") {
            if (data.result === STATUS_OK) {
                // Code was accepted.
                switchToEmailVerifiedMode();
            } else if (data.result === STATUS_BAD_EMAIL) {
                // Too many attempts; switch back to requesting a new code.
                switchToRequestConfirmationCodeMode();
            }
        }
    });
}

/**
 * Disables the given controls during the provided XHR.
 *
 * @param {string[]} controls
 *   A list of jQuery selectors for the controls to disable during the
 *   XHR.
 * @param {jqXHR} jqXhr
 *   The XHR during which controls should be disabled.
 */
function disableControlsDuringRequest(controls, jqXhr) {
    let $controls = $(controls.join(','));

    // Disable controls during the XHR.
    $controls.prop("disabled", true);

    // Release the controls after the XHR, even on failure.
    jqXhr.always(() => {
        $controls.prop("disabled", false);
    })
}

// At present, there doesn't seem to be a way to be notified about/detect
// whether the user should be prompted for a verification code. But, for
// our styling needs, we need a way to determine what "mode" the form is
// in.
//
// To accomplish this, we listen for when B2C is sending out a
// verification code, and then toggle the "mode" of the form only if the
// request is successful. That way, we do not toggle the form if there are
// client-side or server-side validation errors with the email address
// that the user provided.
$(document).ajaxSend(function (e, jqXhr, settings) {
    if (settings.contentType.startsWith('application/x-www-form-urlencoded')) {
        let parsedData = new URLSearchParams(settings.data),
            requestType = parsedData.get('request_type')

        if (requestType === REQUEST_TYPE_CODE_REQUEST) {
            handleSendVerificationCodeRequest(jqXhr);
        }
        else if (requestType === REQUEST_TYPE_CODE_VALIDATION) {
            handleValidateCodeRequest(jqXhr);
        }
    }
});

setSpinnerStyleDisplay('none');
setupSpinnerTriggerButtons('div.buttons', 'button#continue');