"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const analyzeCode_1 = require("./commands/analyzeCode");
const generateInlineCommands_1 = require("./commands/generateInlineCommands");
const reviewSuggestion_1 = require("./commands/reviewSuggestion");
function activate(context) {
    console.log('Backdoor extension is now active.');
    // Register commands
    context.subscriptions.push(vscode.commands.registerCommand('backdoor.analyzeCode', analyzeCode_1.analyzeCode), vscode.commands.registerCommand('backdoor.generateInlineCommands', generateInlineCommands_1.generateInlineCommands), vscode.commands.registerCommand('backdoor.reviewSuggestion', reviewSuggestion_1.reviewSuggestion), vscode.commands.registerCommand('backdoor.backdoorDashboardInit', showBackdoorDashboard));
}
exports.activate = activate;
function showBackdoorDashboard() {
    return __awaiter(this, void 0, void 0, function* () {
        const panel = vscode.window.createWebviewPanel('backdoorUI', 'Backdoor UI', vscode.ViewColumn.One, {});
        panel.webview.html = getWebviewContent(panel.webview);
        // Handle messages from the webview
        panel.webview.onDidReceiveMessage((message) => {
            switch (message.command) {
                case 'analyzeCode':
                    (0, analyzeCode_1.analyzeCode)();
                    break;
                // Handle other commands here...
            }
        });
    });
}
function getWebviewContent(webview) {
    const buttonStyle = 'padding: 6px 12px; font-size: 16px; background-color:#313131; border-radius:7px; border:1px solid white; color:white; margin: 10px;';
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Backdoor Code Reviewer</title>
        </head>
        <body>
            <h1>Backdoor Code Reviewer</h1>
            <p style="color:white;"> Backdoor is a free code reviewer assistant. It helps developers with AI support, increases code quality with highlighter and linter features.<p>
            <button id="analyzeButton" style="${buttonStyle}">Enable Code Analysis</button>
            <button id="analyzeButton" style="${buttonStyle}">Enable AI Support</button>
            <button id="analyzeButton" style="${buttonStyle}">Enable Highlighter</button>
            <script src="${webview.asWebviewUri(vscode.Uri.file(__dirname + '/script.js'))}"></script>
        </body>
        </html>
    `;
}
function deactivate() {
    console.log('Backdoor Code Reviewer extension is now deactivated.');
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map