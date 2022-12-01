import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const gitChecker = function () {
	const projPath = vscode.workspace.rootPath ?? ""

	const hasGit = fs.existsSync(path.join(projPath, '.git'))

	if (hasGit === false) {
		vscode.commands.executeCommand('workbench.action.quit')
		return
	}

	const cpOpt = {
		"cwd": projPath
	}

	cp.exec('git remote -v', cpOpt, (err, stdout, stderr) => {
		if (stderr.length > 0) {
			vscode.window.showErrorMessage(stderr)
			return;
		}

		if (err != null) {
			vscode.window.showErrorMessage(err.message)
			return;
		}

		if (stdout.length == 0) {
			vscode.commands.executeCommand('workbench.action.quit')
			return
		}

		vscode.window.showWarningMessage("Did you push your code?", "Yes", "No")
			.then(answer => {
				if (answer == "Yes") {
					vscode.window.showWarningMessage("Are you sure you did it?", "Yes", "No")
						.then(answer => {
							if (answer == "Yes") {
								vscode.window.showWarningMessage("Oh man! look into my eyes. did you really push it?", "Yes", "No")
									.then(answer => {
										if (answer == "Yes") {
											vscode.commands.executeCommand('workbench.action.quit')
										} else {
											vscode.window.showInformationMessage("Push it now");
										}
									})
							} else {
								vscode.window.showInformationMessage("Push it now");
							}
						})
				} else {
					vscode.window.showInformationMessage("Push it now");
				}
			})
	})
}

export function activate(context: vscode.ExtensionContext) {
	vscode.commands.executeCommand('setContext', 'git-push-reminder.isActive', true);

	const stopCloseEmptyWindowCommand = vscode.commands.registerCommand(
		'git-push-reminder.keybindings.stopCloseEmptyWindow'
		, () => { }
	)

	const closeWindowCommand = vscode.commands.registerCommand(
		'git-push-reminder.keybindings.closeWindow'
		, gitChecker
	)

	const quitCommand = vscode.commands.registerCommand(
		'git-push-reminder.keybindings.quit',
		gitChecker
	)

	const quitCommandEmptyWindow = vscode.commands.registerCommand(
		'git-push-reminder.keybindings.quitEmptyWindow'
		, gitChecker
	)

	context.subscriptions.push(stopCloseEmptyWindowCommand)
	context.subscriptions.push(closeWindowCommand)
	context.subscriptions.push(quitCommand)
	context.subscriptions.push(quitCommandEmptyWindow)
}

export function deactivate() {
	vscode.commands.executeCommand('setContext', 'git-push-reminder.isActive', false);
}
