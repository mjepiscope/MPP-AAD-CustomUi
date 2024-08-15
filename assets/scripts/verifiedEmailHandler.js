import { hideSpinner, showSpinner } from './spinner.js';

/*
    Self-Asserted Email-Verification has different steps
    Currently, there is no built-in indicator to know which step the user is currently in
    A workaround is possible by listening to AJAX calls
    Reference: https://stackoverflow.com/a/68426051
*/

const STATUS_OK = 0,
    STATUS_WRONG_CODE = 3;

const REQUEST_TYPE = 'request_type'
    , REQUEST_TYPE_RESPONSE = 'RESPONSE'
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
        requestType = parsedData.get(REQUEST_TYPE)

    switch (requestType) {
        case REQUEST_TYPE_RESPONSE:
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
        hideSpinner();

        if (data.status === "400" || (data.status === "200" && data.result === STATUS_OK)) {
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
        hideSpinner();

        if (data.status !== "200") return;

        /* result:
            0 - correct code
            2 - retries exceeded
            3 - incorrect code
        */
        if (data.result === STATUS_OK) {
            setVerifiedCodeView();
        }
        else if (data.result === STATUS_WRONG_CODE) {
            setVerifyCodeView();
            preventFormSubmitIfEnterIsPressed();
        }
    });
}

function setVerifyCodeView() {
    let $divClaimError = document.querySelector('div#claimVerificationServerError');

    if (!!$divClaimError) {
        $divClaimError.style.display = 'none';
    }

    let $inputEmail = document.querySelector('input#readOnlyEmail');

    if (!!$inputEmail) {
        $inputEmail.setAttribute('disabled', 'true');
    }

    let $inputCode = document.querySelector('input#readOnlyEmail_ver_input');

    if (!!$inputCode) {
        $inputCode.value = '';
        $inputCode.focus();
    }
}

function setVerifiedCodeView() {
    let $btnContinue = document.querySelector('button#continue');

    if (!$btnContinue) return;

    let $divApi = document.querySelector('div#api');

    if (!$divApi) return;

    $divApi.style.visibility = 'hidden';
    $divApi.style.maxHeight = '0';

    showSpinner();

    $btnContinue.click();
}

function preventFormSubmitIfEnterIsPressed() {
    let $formVerify = document.querySelector('form#attributeVerification');

    if (!$formVerify) return;

    $formVerify.addEventListener('keypress', (e) => {
        if (e.target.dataset.enterForSubmit) {
            if (e.key === 'Enter') {
                e.preventDefault();
                return;
            }

            return true;
        }
    });
}