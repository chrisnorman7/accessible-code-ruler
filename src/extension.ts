// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// The name of the extension.
const extensionName = 'accessible-code-ruler';

// A function to get the maximum line length.
function getMaxLineLength(): number {
	return vscode.workspace.getConfiguration(extensionName).get<number>('maximumLineLength', 79);
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.window.onDidChangeTextEditorSelection(function (e) {
			let editor = vscode.window.activeTextEditor;
			if (editor) {
				let text = editor.document.lineAt(editor.selection.active.line).text;
				let l = editor.selection.active.character;
				let maxChar: number = getMaxLineLength();
				if (l > maxChar) {
					let difference = l - maxChar;
					return vscode.window.showErrorMessage(`${difference} ${difference === 1 ? "char" : "chars"} over.`);
				}
			} else {
				return vscode.window.showErrorMessage("editor error");
			}
		}));

	context.subscriptions.push(
		vscode.commands.registerCommand(
			`${extensionName}.showLineLength`, () => {
				let editor = vscode.window.activeTextEditor;
				if (editor) {
					let text = editor.document.lineAt(editor.selection.active.line).text;
					vscode.window.showInformationMessage(`Line length: ${text.length}.`);
				} else {
					return vscode.window.showErrorMessage("editor error");
				}
			}));

	context.subscriptions.push(vscode.commands.registerCommand(`${extensionName}.gotoOverflowChar`, () => {
let editor = vscode.window.activeTextEditor;
if (editor) {
	let text = editor.document.lineAt(editor.selection.active.line).text;
	let lineLength = text.length;
	let maxChar = Math.min(getMaxLineLength(), lineLength);
	let position = new vscode.Position(editor.selection.active.line, maxChar);
	editor.selection = new vscode.Selection(position, position);
}
	}));
}

// this method is called when your extension is deactivated
export function deactivate() { }
