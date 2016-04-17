/** @babel */
import path from 'path';
import sass from 'node-sass';

/* cmd+shift+s */
function run() {
    const editor = atom.workspace.getActiveTextEditor();
    let buffer = editor.getBuffer();
    let currentSelectorLocator = '/*scss-preview-current*/';

    if (!editor) {
        return;
    }

    let isScssFile = (/\.scss$/i).test(buffer.file.path);
    if (!isScssFile) {
        return;
    }

    let markerPos = editor.getCursorBufferPosition();
    let characterIndex = buffer.characterIndexForPosition(markerPos);

    //Remove properties, only keep selectors
    let input = buffer.cachedText;
    let nextCurlyPos = input.indexOf('{', characterIndex);
    let nextSemiColonPos = input.indexOf(';', characterIndex);
    //Cursor is at a property, not supported atm
    if (nextCurlyPos > nextSemiColonPos) return;

    //Insert our custom comment that will keep this selector in the output
    let modifiedInput = input.splice(nextCurlyPos + 1, 0, currentSelectorLocator);

    //Remove potential compile breakers
    modifiedInput = modifiedInput.replace(/@include .*;/g, '');
    modifiedInput = modifiedInput.replace(/@import .*;/g, '');

    //Remove variable declarations
    modifiedInput = modifiedInput.replace(/\$.+=.+;/g, '');

    //Remove variables
    modifiedInput = modifiedInput.replace(/\$[^ |;|)]+/g, '');

    //Remove properties
    modifiedInput = modifiedInput.replace(/[^{|\s]+:[^{|}]+;/ig, '');

    sass.render({
        data: modifiedInput,
        outputStyle: 'expanded'
    }, (err, result) => {
        if (err) {
            atom.notifications.addError('Could not get full css selector.');
        } else if (result) {
            let resultString = result.css.toString('utf-8');
            //Remove media queries for now
            resultString = resultString.replace(/@media.*{/g, '');
            let selector = resultString.match(/[^}]*\/\*scss-preview-current\*/);
            //Remove everything but the actual string containing the selector
            selector = selector[0].replace(/{[\s\S]*\/\*scss-preview-current\*/gmi, '');
            atom.notifications.addInfo(selector);
        }
    });
};

export const activate = () => {
    atom.commands.add('atom-workspace', 'scss-preview-selector:run', run);
};

String.prototype.splice = function(idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};
