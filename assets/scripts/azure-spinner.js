export function showSpinner() {
    setSpinnerStyleDisplay('block');
}

export function hideSpinner() {
    setSpinnerStyleDisplay('none');
}

export function showSpinnerViaButtonClick(parentSelector, buttonSelectors) {
    var parents = window.document.querySelectorAll(parentSelector);

    if (!parents) return;

    parents.forEach(p => {

        var buttons = Array.prototype.slice.call(p.querySelectorAll(buttonSelectors), 0);

        buttons.forEach((b) => {
            if (!b) return;

            b.addEventListener('click', () => {
                if (!hasErrorMessage()) {
                    showSpinner();
                }
            });
        });

    });
}

function setSpinnerStyleDisplay(display) {
    var spinner = window.document.querySelector('div.spinner-overlay');

    if (!spinner) return;

    spinner.style.display = display;
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