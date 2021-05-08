// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// The name of the extension.
const extensionName = 'accessible-code-ruler';
const extensionConfigurationName = 'accessibleCodeRuler';

// A function to get the maximum line length.
function getMaxLineLength(): number {
	return vscode.workspace.getConfiguration().get<number>(`${extensionConfigurationName}.maximumLineLength`, 79);
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
			const currentLanguage = vscode.window.activeTextEditor?.document.languageId;
			if (!currentLanguage || getIgnoredLanguages().includes(currentLanguage)) {
				// Don't bother with this language.
				return;
			}
			if (editor) {
				const text = editor.document.lineAt(editor.selection.active.line).text;
				const l = editor.selection.active.character;
				const maxChar: number = getMaxLineLength();
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
			vscode.window.showInformationMessage(String(getMaxLineLength()));
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
					const maxChar = Math.min(getMaxLineLength(), lineLength);
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
			`${extensionName}.removeIgnoredLanguage`, async () => {
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
}

// this method is called when your extension is deactivated
export function deactivate() { }
