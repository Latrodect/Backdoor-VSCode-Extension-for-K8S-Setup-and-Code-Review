import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export async function generateKubernetesFiles() {
    if (!vscode.workspace.workspaceFolders) {
        vscode.window.showErrorMessage('No workspace is open.');
        return;
    }
    const namespaceName = ''; 

    const deploymentsInput = await vscode.window.showInputBox({
      prompt: 'Your Deployment Files:',
      placeHolder: 'frontend, backend, redis',
    });

    if (!deploymentsInput) {
      vscode.window.showInformationMessage('Please specify atleast one deployment name.');
      return;
  }

  const deploymentNames = deploymentsInput.split(',').map(name => name.trim());

    const kubernetesFolder = vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, 'kubernetes');
    fs.mkdirSync(kubernetesFolder.fsPath, { recursive: true });

    const namespacesFolder = vscode.Uri.joinPath(kubernetesFolder, 'namespaces');
    fs.mkdirSync(namespacesFolder.fsPath, { recursive: true });

    const deploymentsFolder = vscode.Uri.joinPath(kubernetesFolder, 'deployments');
    fs.mkdirSync(deploymentsFolder.fsPath, { recursive: true });

    const servicesFolder = vscode.Uri.joinPath(kubernetesFolder, 'services');
    fs.mkdirSync(servicesFolder.fsPath, { recursive: true });

    const ingressFolder = vscode.Uri.joinPath(kubernetesFolder, 'ingess');
    fs.mkdirSync(ingressFolder.fsPath, { recursive: true });

    const configmapsFolder = vscode.Uri.joinPath(kubernetesFolder, 'configmaps');
    fs.mkdirSync(configmapsFolder.fsPath, { recursive: true });

    const secretsFolder = vscode.Uri.joinPath(kubernetesFolder, 'secrets');
    fs.mkdirSync(secretsFolder.fsPath, { recursive: true });

    const jobsFolder = vscode.Uri.joinPath(kubernetesFolder, 'jobs');
    fs.mkdirSync(jobsFolder.fsPath, { recursive: true });

    const namespaceYAML = "apiVersion: v1\nkind: Namespace\nmetadata:name: ${namespaceName}";
    fs.writeFileSync(path.join(namespacesFolder.fsPath, 'development.yaml'), namespaceYAML);
    fs.writeFileSync(path.join(namespacesFolder.fsPath, 'staging.yaml'), namespaceYAML);
    fs.writeFileSync(path.join(namespacesFolder.fsPath, 'production.yaml'), namespaceYAML);

    const promises = deploymentNames.map(async deploymentName => {
      const deploymentYAML = `
          apiVersion: apps/v1
          kind: Deployment
          metadata:
          name: ${deploymentName}
          namespace: ${namespaceName}
          # Add other deployment details here
          `;
      await writeFileWithDirectoryCheck(path.join(deploymentsFolder.fsPath, `${deploymentName}.yaml`), deploymentYAML);

      const serviceYAML = `
          apiVersion: v1
          kind: Service
          metadata:
          name: ${deploymentName}-service
          namespace: ${namespaceName}
          spec:
          selector:
            app: ${deploymentName}
          ports:
            - protocol: TCP
              port: 80
              targetPort: 8080
          `;
      await writeFileWithDirectoryCheck(path.join(servicesFolder.fsPath, `${deploymentName}-service.yaml`), serviceYAML);

      const ingressYAML = `
          apiVersion: networking.k8s.io/v1
          kind: Ingress
          metadata:
          name: ${deploymentName}-ingress
          namespace: ${namespaceName}
          spec:
          rules:
            - host: ${deploymentName}.example.com
              http:
                paths:
                  - path: /
                    pathType: Prefix
                    backend:
                      service:
                        name: ${deploymentName}-service
                        port:
                          number: 80
          `;
      await writeFileWithDirectoryCheck(path.join(ingressFolder.fsPath, `${deploymentName}-ingress.yaml`), ingressYAML);

      const secretYAML = `
          apiVersion: v1
          kind: Secret
          metadata:
            name: ${deploymentName}-secret
            namespace: ${namespaceName}
          type: Opaque
          data:
            username: ${Buffer.from('my-username').toString('base64')}
            password: ${Buffer.from('my-password').toString('base64')}
          `;
        await writeFileWithDirectoryCheck(path.join(secretsFolder.fsPath, `${deploymentName}-secret.yaml`), secretYAML);

        const configMapYAML = `
            apiVersion: v1
            kind: ConfigMap
            metadata:
              name: ${deploymentName}-configmap
              namespace: ${namespaceName}
            data:
              config.properties: |
                key1=value1
                key2=value2
            `;
        await writeFileWithDirectoryCheck(path.join(configmapsFolder.fsPath, `${deploymentName}-configmap.yaml`), configMapYAML);
    
  });

  await Promise.all(promises);

  vscode.window.showInformationMessage(`${deploymentNames.length} deployment, service, and ingress files generated successfully.`);
}

async function writeFileWithDirectoryCheck(filePath: string, content: string) {
  const folderPath = path.dirname(filePath);
  await fs.promises.mkdir(folderPath, { recursive: true });
  await fs.promises.writeFile(filePath, content);
}
