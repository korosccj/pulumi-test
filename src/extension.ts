import * as vscode from 'vscode';
import { 
    InlineProgramArgs, LocalWorkspace, LocalWorkspaceOptions, PulumiFn, Stack
} from "@pulumi/pulumi/automation";
import { MyResource } from './resource';
import * as random from "@pulumi/random";


const runTest = async (fn: PulumiFn) => {
	const inlineArgs: InlineProgramArgs = {
		projectName: 'pulumi-test',
		stackName: 'pulumi-test',
		program: fn
	}

	const workspaceArgs: LocalWorkspaceOptions = {
		projectSettings: {
			name: 'test',
			main: __dirname,
			runtime: 'nodejs',
			backend: {
				url: `file://${__dirname}`
			}
		},
		workDir: __dirname
	};

	const stack: Stack = await LocalWorkspace.createOrSelectStack(inlineArgs, workspaceArgs);
	await stack.up({ onOutput: console.log });
}

export function activate(context: vscode.ExtensionContext) {
	process.env.PULUMI_CONFIG_PASSPHRASE = 'secret';

	// Invoked when the vscode command 'Pulumi: Test (Pass)' is run
	// Will successfully create a random pet resource
	const testPass = vscode.commands.registerCommand('pulumi-test.pass', () => {
		console.log('Pulumi Test Extension Running');
		const passFn = async () => {
			return new random.RandomPet('test', {});
		}
		runTest(passFn);
	});

	// Invoked when the vscode command 'Pulumi: Test (Fail)' is run
	// Will fail to create a dynamic resource provider resource
	const testFail = vscode.commands.registerCommand('pulumi-test.fail', () => {
		console.log('Pulumi Test Extension Running');
		const failFn = async () => {
			return new MyResource('test', {});
		}
		runTest(failFn);
	});

	context.subscriptions.push(testPass, testFail);
}

export function deactivate() {}
