import { setSpinnerStyleDisplay } from './spinner.js';

/*
    Self-Asserted Email-Verification has different steps
    Currently, there is no built-in indicator to know which step the user is currently in
    A workaround is possible by listening to AJAX calls
    Reference: https://stackoverflow.com/a/68426051
*/

const STATUS_OK = 0,
    STATUS_RETRIES_EXCEEDED = 2,
    STATUS_WRONG_CODE = 3;

const REQUEST_TYPE_RESPONSE = 'RESPONSE'
    , REQUEST_TYPE_VERIFICATION_REQUEST = 'VERIFICATION_REQUEST'
    , REQUEST_TYPE_VALIDATION_REQUEST = 'VALIDATION_REQUEST';

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
export function handleRequest(settings, jqXhr) {
    let parsedData = new URLSearchParams(settings.data),
        requestType = parsedData.get('request_type')

    switch (requestType) {
        case REQUEST_TYPE_RESPONSE:
            setSpinnerStyleDisplay('none');
            break;
        case REQUEST_TYPE_VERIFICATION_REQUEST:
            handleSendVerificationCodeRequest(jqXhr);
            break;
        case REQUEST_TYPE_VALIDATION_REQUEST:
            handleValidateCodeRequest(jqXhr);
            break;
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
            setVerifyCodeView();
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
        setSpinnerStyleDisplay('none');

        if (data.status !== "200") return;

        switch (data.result) {
            case STATUS_OK:
                setSpinnerStyleDisplay('none');
                break;
            case STATUS_RETRIES_EXCEEDED:
                break;
            case STATUS_WRONG_CODE:
                setVerifyCodeView();              
                break;
        }
    });
}

function setVerifyCodeView() {
    let $inputEmail = document.querySelector('input#readOnlyEmail');

    if (!!$inputEmail) {
        $inputEmail.setAttribute('disabled', 'true');
    }

    let $inputCode = document.querySelector('input#readOnlyEmail_ver_input');

    if (!!$inputCode) {
        $inputCode.value = '';
        $inputCode.focus();
    }

    setSpinnerStyleDisplay('none');
}