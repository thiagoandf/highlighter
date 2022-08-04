import * as vscode from 'vscode';
import { TextDocument, TextEditor } from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "tabs-api-sample" is now active!');

	const typeParser = (document: Record<string, any> | undefined): TextDocument => {
		if (document?.document) {
			return document.document;
		} 
		return document as TextDocument;
	};

	const updateTabColor = (document: TextDocument | TextEditor | undefined) => {
		const doc = typeParser(document);

		if (!doc) {
			return;
		}

		const hasErrors = vscode.languages.getDiagnostics(doc.uri).some(
			diagnostic =>
				diagnostic.severity === vscode.DiagnosticSeverity.Error
		);

		const baseConfig = vscode.workspace.getConfiguration('workbench').get('colorCustomizations') as any;
		if (hasErrors) {
			baseConfig['tab.activeBorderTop'] = '#ff0000';
			vscode.workspace.getConfiguration('workbench').update('colorCustomizations', baseConfig, true);
		} else {
				baseConfig['tab.activeBorderTop'] = undefined;
			vscode.workspace.getConfiguration('workbench').update('colorCustomizations', baseConfig, true);
		}
	};
	
	context.subscriptions.push(
		vscode.window.onDidChangeActiveTextEditor(updateTabColor)
	);

	context.subscriptions.push(
		vscode.workspace.onDidSaveTextDocument(updateTabColor)
	);
	
	context.subscriptions.push(
		vscode.workspace.onDidOpenTextDocument(updateTabColor)
	);
}
