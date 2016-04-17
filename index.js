/** @babel */
import path from 'path';
import sass from 'node-sass';
import S from 'string';

/* cmd+shift+s */
function init() {
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

	/*ToDo: first remove all comments*/
	let modifiedInput = input.splice(nextCurlyPos + 1, 0, currentSelectorLocator);
	modifiedInput = modifiedInput.replace(/@include .*;/g, '');
	modifiedInput = modifiedInput.replace(/@import .*;/g, '');

	//Remove variable declarations
	modifiedInput = modifiedInput.replace(/\$.+=.+;/g, '');
	//Remove variables
	modifiedInput = modifiedInput.replace(/\$[^ |;|)]+/g, '');

	//Remove properties
	modifiedInput = modifiedInput.replace(/[^{|\s]+:[^{|}]+;/ig, '');
	console.log(modifiedInput);

	/*Todo: async*/
	sass.render({
			data: modifiedInput,
			outputStyle: 'expanded'
		}, (err, result) => {
			if(err) {
				atom.notifications.addError('Could not get full css selector.');
			}
			let resultString = result.css.toString('utf-8');
			//Remove media queries for now
			resultString = resultString.replace(/@media.*{/g, '');
			let selector = resultString.match(/[^}]*\/\*scss-preview-current\*/);
			atom.notifications.addInfo(selector[0].replace(/{[\s\S]*\/\*scss-preview-current\*/gmi, ''));
	});
};

	export const activate = () => {
		atom.commands.add('atom-workspace', 'scss-preview-selector', init);
	};

	String.prototype.splice = function(idx, rem, str) {
		return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
	};
