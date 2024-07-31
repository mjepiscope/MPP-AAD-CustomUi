/*
    Self-Asserted Email-Verification has different steps
    Currently, there is no built-in indicator to know which step the user is currently in
    A workaround is possible by listening to AJAX calls
    Reference: https://stackoverflow.com/a/68426051
*/

const STATUS_OK = 0,
    STATUS_BAD_EMAIL = 2;

const REQUEST_TYPE_RESPONSE = 'RESPONSE'
    , REQUEST_TYPE_VERIFICATION_REQUEST = 'VERIFICATION_REQUEST'
    , REQUEST_TYPE_VALIDATION_REQUEST = 'VALIDATION_REQUEST';

let $body = $('body');

export function setOnStepChangeCallback(callback) {
    var observer = new MutationObserver(callback);

    observer.observe($body, {
        attributes: true,
        attributeFilter: ['data-step']
    });
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
export function identifyStep(settings, jqXhr) {
    if (settings.contentType.startsWith('application/x-www-form-urlencoded')) {
        let parsedData = new URLSearchParams(settings.data),
            requestType = parsedData.get('request_type')

        switch (requestType) {
            case REQUEST_TYPE_RESPONSE:
                setBodyAttr(requestType);
                break;
            case REQUEST_TYPE_VERIFICATION_REQUEST:
                handleSendVerificationCodeRequest(jqXhr);
                break;
            case REQUEST_TYPE_VALIDATION_REQUEST:
                handleValidateCodeRequest(jqXhr);
                break;
        }
    }
}

/**
 * Callback invoked when a verification code is being requested via XHR.
 *
 * @param {jqXHR} jqXhr
 *   The XHR being sent out to get a verification code sent out.
 */
function handleSendVerificationCodeRequest(jqXhr) {
    jqXhr.done((data) => {
        if ((data.status === "200") && (data.result === STATUS_OK)) {
            // Code sent successfully.
            setBodyAttr('verify-code');
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
    jqXhr.done((data) => {
        if (data.status === "200") {
            if (data.result === STATUS_OK) {
                // Code was accepted.
                setBodyAttr('email-verified');
            } else if (data.result === STATUS_BAD_EMAIL) {
                // Too many attempts; switch back to requesting a new code.
                setBodyAttr('send-code');
            }
        }
    });
}

/**
 * Sets the current step of the form into the body.
 */
function setBodyAttr(step) {
    $body.attr('data-step', step);
}