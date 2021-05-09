// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// The name of the extension.
const extensionName = 'accessible-code-ruler';

/// The name of the configuration section where the extension options reside.
const extensionConfigurationName = 'accessibleCodeRuler';

/// The type of the languages dictionary.
interface LanguageLineLengths {
	[key: string]: number;
}

// The configuration ID for the language line lengths.
const languageLineLengthsConfigurationId = `${extensionConfigurationName}.languageMaximumLineLength`;

/// Get the dictionary of language line lengths.
function getLanguageLineLengths(): LanguageLineLengths {
	return vscode.workspace.getConfiguration().get<LanguageLineLengths>(languageLineLengthsConfigurationId, {});
}

// A function to get the maximum line length.
function getMaxLineLength(language: string): number {
	const languages = getLanguageLineLengths();
	return languages[language] || vscode.workspace.getConfiguration().get<number>(`${extensionConfigurationName}.maximumLineLength`, 79);
}

// A function to get the ignored languages list.
function getIgnoredLanguages(): Array<String> {
	return vscode.workspace.getConfiguration().get<Array<String>>(`${extensionConfigurationName}.ignoredLanguages`, []);
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.window.onDidChangeTextEditorSelection(function (e) {
			const editor = vscode.window.activeTextEditor;
			const currentLanguage = editor?.document.languageId;
			if (!currentLanguage || getIgnoredLanguages().includes(currentLanguage)) {
				// Don't bother with this language.
				return;
			}
			if (editor) {
				const text = editor.document.lineAt(editor.selection.active.line).text;
				const l = editor.selection.active.character;
				const maxChar: number = getMaxLineLength(currentLanguage);
				if (l > maxChar) {
					const difference = l - maxChar;
					return vscode.window.showInformationMessage(`${difference} ${difference === 1 ? "char" : "chars"} over.`);
				}
			} else {
				return vscode.window.showErrorMessage("No editor, even though this function has been called by a cursor move.");
			}
		}));

	context.subscriptions.push(vscode.commands.registerCommand(
		`${extensionName}.showLineLength`, () => {
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				const text = editor.document.lineAt(editor.selection.active.line).text;
				vscode.window.showInformationMessage(`Line length: ${text.length}.`);
			}
		}));

	context.subscriptions.push(
		vscode.commands.registerCommand(
			`${extensionName}.gotoOverflowChar`, () => {
				const editor = vscode.window.activeTextEditor;
				if (editor) {
					const text = editor.document.lineAt(editor.selection.active.line).text;
					const lineLength = text.length;
					const maxChar = Math.min(getMaxLineLength(editor.document.languageId), lineLength);
					const position = new vscode.Position(editor.selection.active.line, maxChar);
					editor.selection = new vscode.Selection(position, position);
				}
			}));

	context.subscriptions.push(
		vscode.commands.registerCommand(
			`${extensionName}.addIgnoredLanguage`, () => {
				const ignoredLanguages = getIgnoredLanguages();
				const currentLanguage = vscode.window.activeTextEditor?.document.languageId;
				if (currentLanguage === undefined) {
					vscode.window.showWarningMessage('No current language.');
				} else if (ignoredLanguages.includes(currentLanguage) === false) {
					ignoredLanguages.push(currentLanguage);
					vscode.window.showInformationMessage(`Now ignoring ${currentLanguage}.`);
				} else {
					vscode.window.showWarningMessage(`You are already ignoring ${currentLanguage}.`);
				}
			})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			`${extensionName}.removeIgnoredLanguage`, () => {
				const ignoredLanguages = getIgnoredLanguages();
				const currentLanguage = vscode.window.activeTextEditor?.document.languageId;
				if (currentLanguage === undefined) {
					vscode.window.showWarningMessage('No current language.');
				} else {
					const index = ignoredLanguages.indexOf(currentLanguage, 0);
					if (index > -1) {
						vscode.workspace.getConfiguration().update(`${extensionConfigurationName}.ignoredLanguages`, ignoredLanguages.splice(index, 1));
						vscode.window.showInformationMessage(`No longer ignoring ${currentLanguage} (${ignoredLanguages}).`);
					} else {
						vscode.window.showWarningMessage(`You aren't ignoring ${currentLanguage}.`);
					}
				}
			}
		)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			`${extensionName}.setLanguageLineLength`, async () => {
				const currentLanguage = vscode.window.activeTextEditor?.document.languageId;
				if (!currentLanguage) {
					vscode.window.showErrorMessage('No current editor found.');
					return;
				}
				const lengthString = await vscode.window.showInputBox(
					{
						value: String(getMaxLineLength(currentLanguage)),
						prompt: `Enter the line length to be used for ${currentLanguage}`,
					}
				);
				if (lengthString) {
					const length = Number.parseInt(lengthString);
					if (isNaN(length) || length <= 0) {
						vscode.window.showErrorMessage(`Invalid line length: ${lengthString}.`);
						return;
					} else {
						const languages: LanguageLineLengths = getLanguageLineLengths();
						languages[currentLanguage] = Number.parseInt(lengthString);
						vscode.workspace.getConfiguration().update(languageLineLengthsConfigurationId, languages);
						vscode.window.showInformationMessage(`Line length for ${currentLanguage} set to ${length}.`);
					}
				}
			}
		)
	);
}

// this method is called when your extension is deactivated
export function deactivate() { }
