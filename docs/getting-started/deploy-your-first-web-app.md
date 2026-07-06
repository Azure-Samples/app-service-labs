---
title: Deploy your first web app
sidebar_position: 2
---

{/*
SCREENSHOT MANIFEST - Azure portal captures needed for this lab.
Do not capture these yourself. The orchestrator captures them later.
All images are referenced as /img/labs/deploy-your-first-web-app/<name>.png

1. create-web-app-search.png
   URL/blade: https://portal.azure.com -> top search bar
   Capture: The global search box with "app services" typed, showing the
   "App Services" result highlighted in the dropdown.

2. create-basics.png
   URL/blade: Create Web App wizard, Basics tab
   (portal.azure.com/#create/Microsoft.WebSite)
   Capture: The Basics tab filled in - Subscription, Resource Group
   (new: rg-firstwebapp), Name, Publish = Code, Runtime stack dropdown open
   showing language options, Operating System (Linux vs Windows radio),
   Region = East US, and the pricing plan section.

3. create-review.png
   URL/blade: Create Web App wizard, "Review + create" tab
   Capture: The validation "Validation passed" banner and the summary of
   settings, with the Create button visible at the bottom.

4. deployment-complete.png
   URL/blade: Deployment overview blade after Create
   Capture: "Your deployment is complete" screen with the
   "Go to resource" button visible.

5. overview-browse.png
   URL/blade: App Service Overview blade
   Capture: The Overview blade with the "Default domain" URL highlighted
   and the "Browse" button in the top command bar.

6. default-site.png
   URL/blade: The running app in a browser tab
   Capture: The default App Service landing page (or the deployed
   "Hello from Azure App Service!" page) at *.azurewebsites.net.

7. vscode-deploy.png
   URL/blade: Visual Studio Code, Azure extension
   Capture: Right-click context menu on a project folder showing
   "Deploy to Web App..." from the Azure App Service extension.

8. delete-resource-group.png
   URL/blade: Resource group Overview blade
   Capture: The resource group command bar with "Delete resource group"
   highlighted and the confirmation pane asking to type the group name.
*/}

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import PathPicker from '@site/src/components/PathPicker';
import Prerequisites from '@site/src/components/SharedMarkdown/_prerequisites.mdx';

# Deploy your first web app

In this lab, you deploy a simple web app to [Azure App Service](https://learn.microsoft.com/azure/app-service/overview) and open it in your browser. App Service is a fully managed platform for hosting web apps, so you can ship code without managing servers.

You'll build the same result three ways so you can pick the workflow that fits you:

- **Azure Developer CLI (azd)** - an opinionated, repeatable workflow that provisions infrastructure and deploys code in one step.
- **Azure CLI (az)** - explicit commands that create each resource and deploy your code.
- **Azure portal** - a visual, click-through experience.

You can follow the lab in your language of choice: **.NET**, **Node.js**, **Python**, **Java**, or **PHP**. Each path calls out the differences between **Linux** and **Windows** App Service plans.

:::info App Service Labs complements Microsoft Learn
This lab is a hands-on, end-to-end walkthrough. For reference depth on any concept, follow the "Learn more" links to the official Microsoft Learn quickstarts.
:::

**Estimated time:** 15-20 minutes

## What you'll build

A single web app running on an App Service plan (the compute that hosts your app), reachable at a default `https://<app-name>.azurewebsites.net` hostname that returns HTTP 200.

<Prerequisites
  tools={[
    { name: 'Azure Developer CLI (azd)', url: 'https://learn.microsoft.com/azure/developer/azure-developer-cli/install-azd' },
    { name: 'The SDK or runtime for your chosen language', description: '(.NET SDK, Node.js, Python, JDK + Maven, or PHP - linked in each step)' },
  ]}
/>

:::tip Choose a region and low-cost tier
This lab uses the **East US** region and the **B1 (Basic)** pricing tier, a low-cost option that's ideal for learning. The **F1 (Free)** tier also works for the code paths, with some limits. You can change the region to one near you.
:::

## Deploy the app

<PathPicker
  description="Set these once - every matching step and code sample below follows your choice."
  groups={[
    { id: 'tooling', label: 'Tooling', options: [
      { value: 'azd', label: 'azd' },
      { value: 'az', label: 'az CLI' },
      { value: 'portal', label: 'Portal' },
    ]},
    { id: 'language', label: 'Language', options: [
      { value: 'dotnet', label: '.NET' },
      { value: 'node', label: 'Node.js' },
      { value: 'python', label: 'Python' },
      { value: 'java', label: 'Java' },
      { value: 'php', label: 'PHP' },
    ]},
    { id: 'os', label: 'OS', options: [
      { value: 'linux', label: 'Linux' },
      { value: 'windows', label: 'Windows' },
    ]},
  ]}
/>

Pick a deployment mechanism, then choose your language. The steps produce an identical running app.

<Tabs groupId="tooling" queryString>

<TabItem value="azd" label="Azure Developer CLI (azd)">

The Azure Developer CLI packages your app code and infrastructure together, then provisions and deploys in one flow. In this lab you use a minimal project: a small app plus a Bicep file that defines the App Service plan and web app.

### 1. Sign in

```bash
azd auth login
```

### 2. Create the project structure

Create a new folder and add the four files below. The `infra/main.bicep` and `infra/resources.bicep` files are shared across every language - only the app code and two values change per language (the `language` value in `azure.yaml` and `linuxFxVersion` in `infra/main.parameters.json`).

```bash
mkdir my-first-web-app && cd my-first-web-app
mkdir infra src
```

Create `azure.yaml` in the project root:

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/Azure/azure-dev/main/schemas/v1.0/azure.yaml.json
name: my-first-web-app
services:
  web:
    project: ./src
    language: js # change per language: js, dotnet, python, java
    host: appservice
```

Create `infra/main.parameters.json`:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "environmentName": { "value": "${AZURE_ENV_NAME}" },
    "location": { "value": "${AZURE_LOCATION}" },
    "resourceGroupName": { "value": "${AZURE_RESOURCE_GROUP}" },
    "linuxFxVersion": { "value": "NODE|22-lts" }
  }
}
```

Create `infra/main.bicep`. It runs at subscription scope so `azd` creates and owns the resource group for this environment - the reliable pattern that avoids reusing a shared group:

```bicep
targetScope = 'subscription'

@description('Name of the azd environment; used to derive resource names.')
param environmentName string

@description('Azure region for all resources.')
param location string

@description('Resource group to create for this environment.')
param resourceGroupName string

@description('Runtime stack for the web app, for example NODE|22-lts or DOTNETCORE|8.0.')
param linuxFxVersion string = 'NODE|22-lts'

resource rg 'Microsoft.Resources/resourceGroups@2024-03-01' = {
  name: resourceGroupName
  location: location
}

module resources 'resources.bicep' = {
  name: 'resources'
  scope: rg
  params: {
    location: location
    environmentName: environmentName
    linuxFxVersion: linuxFxVersion
  }
}

output WEB_URI string = resources.outputs.webUri
```

Create `infra/resources.bicep`:

```bicep
@description('Azure region for all resources.')
param location string

@description('azd environment name used to derive globally unique names.')
param environmentName string

@description('Runtime stack for the web app, for example NODE|22-lts or DOTNETCORE|8.0.')
param linuxFxVersion string = 'NODE|22-lts'

var suffix = uniqueString(subscription().id, resourceGroup().id, environmentName)
var planName = 'plan-${suffix}'
var webName = 'app-${suffix}'

resource plan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: planName
  location: location
  sku: {
    name: 'B1'
  }
  kind: 'linux'
  properties: {
    reserved: true // required for Linux plans
  }
}

resource web 'Microsoft.Web/sites@2023-12-01' = {
  name: webName
  location: location
  kind: 'app,linux'
  tags: {
    'azd-service-name': 'web' // links this site to the "web" service in azure.yaml
  }
  properties: {
    serverFarmId: plan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: linuxFxVersion
      appSettings: [
        {
          name: 'SCM_DO_BUILD_DURING_DEPLOYMENT'
          value: 'true' // let App Service build the app on deploy (installs dependencies)
        }
      ]
    }
  }
}

output webUri string = 'https://${web.properties.defaultHostName}'
```

### 3. Add your app code

Choose your language and add the sample code under `src/`. Update the `language` value in `azure.yaml` and `linuxFxVersion` in `infra/main.parameters.json` to match.

<Tabs groupId="language" queryString>

<TabItem value="dotnet" label=".NET">

Requires the [.NET SDK](https://dotnet.microsoft.com/download). Set `language: dotnet` and `linuxFxVersion` to `DOTNETCORE|8.0`.

```bash
cd src
dotnet new webapp
cd ..
```

</TabItem>

<TabItem value="node" label="Node.js">

Requires [Node.js](https://nodejs.org). Set `language: js` and `linuxFxVersion` to `NODE|22-lts`.

Create `src/server.js`:

```js
const http = require('http');
const port = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h1>Hello from Azure App Service!</h1>');
}).listen(port);
```

Create `src/package.json`:

```json
{
  "name": "my-first-web-app",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": { "start": "node server.js" },
  "engines": { "node": ">=20" }
}
```

</TabItem>

<TabItem value="python" label="Python">

Requires [Python](https://www.python.org/downloads/). Set `language: python` and `linuxFxVersion` to `PYTHON|3.13`. Python is supported on **Linux plans only**.

Create `src/app.py`:

```python
from flask import Flask
app = Flask(__name__)

@app.route("/")
def home():
    return "<h1>Hello from Azure App Service!</h1>"
```

Create `src/requirements.txt`:

```text
flask
gunicorn
```

App Service auto-detects the `app` object and starts it with gunicorn.

</TabItem>

<TabItem value="java" label="Java">

Requires a [JDK](https://learn.microsoft.com/java/openjdk/download) and [Maven](https://maven.apache.org/). Set `language: java` and `linuxFxVersion` to `JAVA|17-java17`. Package your Spring Boot app as an executable JAR named `app.jar` in `src/`, and rename the built JAR so App Service can find it. For a first Java app, the [Maven Plugin for Azure App Service](https://learn.microsoft.com/azure/app-service/quickstart-java) shown in the Azure CLI tab is often simpler.

</TabItem>

<TabItem value="php" label="PHP">

The minimal **azd** workflow in this lab doesn't support `language: php` in `azure.yaml` (`azd` has no built-in PHP framework service), so `azd up` fails for PHP. Use the **Azure CLI (az)** tab above for the PHP variant of this lab - it deploys PHP to a Linux plan reliably.

</TabItem>

</Tabs>

### 4. Create an environment and provision

Create an `azd` environment with a unique suffix (so the resource group and app names don't collide with earlier runs), then let `azd` create the resource group and deploy:

```bash
SUFFIX=$(openssl rand -hex 3)   # 6 lowercase hex chars
azd env new "my-first-web-app-${SUFFIX}" --location eastus
azd env set AZURE_RESOURCE_GROUP "rg-firstwebapp-${SUFFIX}"
```

Provision the infrastructure and deploy your code in one step:

```bash
azd up
```

When it finishes, `azd` prints the app endpoint:

```text
- Endpoint: https://app-<random>.azurewebsites.net/
SUCCESS: Your application was deployed to Azure in 3 minutes 46 seconds.
```

:::note First azd up can't find the tagged resource
On the very first `azd up`, `azd` occasionally reports `unable to find a resource tagged with 'azd-service-name: web'` because the provisioning outputs aren't cached yet. If that happens, run `azd deploy` once more - the resources already exist and the code deploy completes.
:::

:::warning One azd service per resource group
`azd` finds your app by the `azd-service-name: web` tag. If you deploy more than one `azd` app into the **same** resource group, deployment fails with `expecting only '1' resource tagged with 'azd-service-name: web', but found '2'`. The unique suffix above gives each run its own resource group, which avoids this.
:::

:::note Windows plans with azd
The Bicep in `infra/resources.bicep` targets Linux. For a Windows plan, remove `reserved: true`, change `kind` to `app`, and replace `linuxFxVersion` with a Windows setting - for example `netFrameworkVersion: 'v8.0'` for .NET or `nodeVersion: '~22'` for Node.js. Python and PHP aren't available on Windows plans.
:::

</TabItem>

<TabItem value="az" label="Azure CLI (az)">

With the Azure CLI you create each resource explicitly, then deploy your code. This lab uses `az webapp create` and `az webapp deploy` (the modern replacements for the deprecated `az webapp up`).

### 1. Sign in and set variables

```bash
az login
```

```bash
export RESOURCE_GROUP=rg-firstwebapp
export LOCATION=eastus
export APP_NAME=my-first-web-app-$RANDOM
export PLAN_NAME=my-first-plan
```

### 2. Create the resource group and plan

```bash
az group create --name $RESOURCE_GROUP --location $LOCATION
```

Create an App Service plan. Use `--is-linux` for a Linux plan, or omit it for a Windows plan:

<Tabs groupId="os" queryString>

<TabItem value="linux" label="Linux">

```bash
az appservice plan create \
  --name $PLAN_NAME \
  --resource-group $RESOURCE_GROUP \
  --sku B1 \
  --is-linux
```

</TabItem>

<TabItem value="windows" label="Windows">

```bash
az appservice plan create \
  --name $PLAN_NAME \
  --resource-group $RESOURCE_GROUP \
  --sku B1
```

</TabItem>

</Tabs>

### 3. Create the web app, deploy, and browse

Choose your language. List all available runtimes any time with `az webapp list-runtimes --os linux` (or `--os windows`).

<Tabs groupId="language" queryString>

<TabItem value="dotnet" label=".NET">

Requires the [.NET SDK](https://dotnet.microsoft.com/download). Create and publish a sample:

```bash
dotnet new webapp -o app && cd app
dotnet publish -c Release -o publish
cd publish && zip -r ../app.zip . && cd ..
```

Create the app (Linux uses `DOTNETCORE:8.0`; Windows uses `dotnet:8`):

<Tabs groupId="os" queryString>

<TabItem value="linux" label="Linux">

```bash
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan $PLAN_NAME \
  --name $APP_NAME \
  --runtime "DOTNETCORE:8.0"
```

</TabItem>

<TabItem value="windows" label="Windows">

```bash
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan $PLAN_NAME \
  --name $APP_NAME \
  --runtime "dotnet:8"
```

</TabItem>

</Tabs>

Deploy the published output:

```bash
az webapp deploy \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --src-path app.zip \
  --type zip
```

</TabItem>

<TabItem value="node" label="Node.js">

Requires [Node.js](https://nodejs.org). Create a minimal app:

```bash
mkdir app && cd app
cat > server.js <<'EOF'
const http = require('http');
const port = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h1>Hello from Azure App Service!</h1>');
}).listen(port);
EOF
cat > package.json <<'EOF'
{ "name": "app", "version": "1.0.0", "main": "server.js", "scripts": { "start": "node server.js" } }
EOF
zip -r app.zip server.js package.json
```

Create the app (Linux uses `NODE:22-lts`; Windows uses `NODE:22LTS`):

<Tabs groupId="os" queryString>

<TabItem value="linux" label="Linux">

```bash
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan $PLAN_NAME \
  --name $APP_NAME \
  --runtime "NODE:22-lts"
```

</TabItem>

<TabItem value="windows" label="Windows">

```bash
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan $PLAN_NAME \
  --name $APP_NAME \
  --runtime "NODE:22LTS"
```

</TabItem>

</Tabs>

Deploy the app:

```bash
az webapp deploy \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --src-path app.zip \
  --type zip
```

</TabItem>

<TabItem value="python" label="Python">

Requires [Python](https://www.python.org/downloads/). Python runs on **Linux plans only**. Use the official quickstart sample:

```bash
git clone https://github.com/Azure-Samples/msdocs-python-flask-webapp-quickstart
cd msdocs-python-flask-webapp-quickstart
```

Create the app with a Python runtime:

```bash
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan $PLAN_NAME \
  --name $APP_NAME \
  --runtime "PYTHON:3.13"
```

Deploy the source; App Service builds it with Oryx (installs `requirements.txt`):

```bash
zip -r app.zip . -x '*.git*'
az webapp deploy \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --src-path app.zip \
  --type zip
```

</TabItem>

<TabItem value="java" label="Java">

Requires a [JDK](https://learn.microsoft.com/java/openjdk/download) and [Maven](https://maven.apache.org/). The simplest path for Java is the **Maven Plugin for Azure App Service**, which creates the app and deploys the JAR for you. Clone the quickstart sample:

```bash
git clone https://github.com/Azure-Samples/app-service-java-quickstart
cd app-service-java-quickstart/booking-management-slots
```

Configure and deploy (the plugin prompts for OS, region, and Java version, and supports both Linux and Windows):

```bash
mvn com.microsoft.azure:azure-webapp-maven-plugin:2.14.1:config
mvn package azure-webapp:deploy
```

The plugin prints the app URL when it finishes.

</TabItem>

<TabItem value="php" label="PHP">

Requires [PHP](https://www.php.net/downloads). PHP runs on **Linux plans only**. Use the official quickstart sample:

```bash
git clone https://github.com/Azure-Samples/php-docs-hello-world
cd php-docs-hello-world
```

Create the app with a PHP runtime:

```bash
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan $PLAN_NAME \
  --name $APP_NAME \
  --runtime "PHP:8.4"
```

Deploy the source:

```bash
zip -r app.zip . -x '*.git*'
az webapp deploy \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --src-path app.zip \
  --type zip
```

</TabItem>

</Tabs>

### 4. Get the app URL

```bash
az webapp show \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --query defaultHostName \
  --output tsv
```

</TabItem>

<TabItem value="portal" label="Azure portal">

The Azure portal gives you a visual way to create the web app. You create the app first, then deploy your code from Visual Studio Code.

### 1. Start creating a web app

Sign in to the [Azure portal](https://portal.azure.com). In the top search bar, enter **app services**, then select **App Services**. Select **Create** > **Web App**.

![Search for App Services in the Azure portal](/img/labs/deploy-your-first-web-app/create-web-app-search.png)

{/* Capture: global search box with "app services" typed and the App Services result highlighted. */}

### 2. Fill in the Basics tab

On the **Basics** tab, enter the following:

- **Subscription**: your subscription.
- **Resource Group**: select **Create new** and enter `rg-firstwebapp`.
- **Name**: a globally unique name (this becomes `<name>.azurewebsites.net`).
- **Publish**: select **Code**.
- **Runtime stack**: choose your language - for example **.NET 8 (LTS)**, **Node 22 LTS**, **Python 3.13**, **Java 17**, or **PHP 8.4**.
- **Operating System**: choose **Linux** or **Windows**. Python and PHP are available on Linux only.
- **Region**: **East US**.
- **Pricing plan**: select a plan and choose the **Basic B1** tier for this lab.

![Create Web App Basics tab](/img/labs/deploy-your-first-web-app/create-basics.png)

{/* Capture: Basics tab with Subscription, Resource Group, Name, Publish=Code, Runtime stack dropdown open, OS radio, Region=East US, and pricing plan. */}

### 3. Review and create

Select **Review + create**. After validation passes, select **Create**.

![Review and create](/img/labs/deploy-your-first-web-app/create-review.png)

{/* Capture: Review + create tab with "Validation passed" and the Create button. */}

Wait for deployment to finish, then select **Go to resource**.

![Deployment complete](/img/labs/deploy-your-first-web-app/deployment-complete.png)

{/* Capture: "Your deployment is complete" screen with the Go to resource button. */}

### 4. Deploy your code

A new web app shows a default landing page until you deploy code. The quickest cross-language way is the **Azure App Service** extension in Visual Studio Code:

1. Open your project folder in Visual Studio Code.
1. In the **Azure** view, right-click your app and select **Deploy to Web App...**.
1. Select the web app you just created and confirm the deployment.

![Deploy to Web App from Visual Studio Code](/img/labs/deploy-your-first-web-app/vscode-deploy.png)

{/* Capture: VS Code Azure extension right-click menu showing "Deploy to Web App...". */}

:::tip Other deployment options
You can also use **Deployment Center** in the portal to connect a GitHub repository for continuous deployment, or the Azure CLI / azd paths in the other tabs.
:::

</TabItem>

</Tabs>

## Verify your app is running

Open the app's URL in a browser, or test it from the command line and confirm you get an HTTP `200` response:

```bash
curl -I https://<your-app-name>.azurewebsites.net
```

Expected output (validated during authoring):

```text
HTTP/1.1 200 OK
Content-Type: text/html
```

You should see your page - for example, **Hello from Azure App Service!** - or the framework's default start page.

![The running app in the browser](/img/labs/deploy-your-first-web-app/default-site.png)

{/* Capture: the running app at *.azurewebsites.net returning the deployed page. */}

:::tip First request can be slow
The first request after a deployment may take a few seconds while the app starts. If you see a "starting" or `503` page, wait a moment and refresh.
:::

## Clean up resources

To avoid ongoing charges, delete the resources when you're done. Deleting the resource group removes the web app and its App Service plan.

<Tabs groupId="tooling" queryString>

<TabItem value="azd" label="Azure Developer CLI (azd)">

```bash
azd down --purge --force
```

</TabItem>

<TabItem value="az" label="Azure CLI (az)">

```bash
az group delete --name rg-firstwebapp --yes --no-wait
```

</TabItem>

<TabItem value="portal" label="Azure portal">

In the portal, open the **rg-firstwebapp** resource group, select **Delete resource group**, enter the group name to confirm, and select **Delete**.

![Delete the resource group](/img/labs/deploy-your-first-web-app/delete-resource-group.png)

{/* Capture: resource group command bar with "Delete resource group" and the confirmation pane. */}

</TabItem>

</Tabs>

## Summary

In this lab, you deployed your first web app to Azure App Service and confirmed it returns an HTTP `200` response. You learned how to:

- Create an App Service plan and web app on both **Linux** and **Windows**.
- Deploy code three ways - with the **Azure Developer CLI**, the **Azure CLI**, and the **Azure portal**.
- Choose a runtime stack for **.NET**, **Node.js**, **Python**, **Java**, or **PHP**, and where language and OS support differ (Python and PHP are Linux-only).
- Clean up resources to avoid charges.

## Learn more

- [App Service overview](https://learn.microsoft.com/azure/app-service/overview)
- [Quickstart: Deploy an ASP.NET web app](https://learn.microsoft.com/azure/app-service/quickstart-dotnetcore)
- [Quickstart: Deploy a Node.js web app](https://learn.microsoft.com/azure/app-service/quickstart-nodejs)
- [Quickstart: Deploy a Python (Flask) web app](https://learn.microsoft.com/azure/app-service/quickstart-python)
- [Quickstart: Deploy a Java app](https://learn.microsoft.com/azure/app-service/quickstart-java)
- [Quickstart: Deploy a PHP web app](https://learn.microsoft.com/azure/app-service/quickstart-php)
- [Azure Developer CLI overview](https://learn.microsoft.com/azure/developer/azure-developer-cli/overview)
- [App Service plans and pricing tiers](https://learn.microsoft.com/azure/app-service/overview-hosting-plans)
