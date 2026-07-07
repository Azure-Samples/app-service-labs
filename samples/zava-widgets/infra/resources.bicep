@description('Azure region for all resources.')
param location string

@description('Tags applied to every resource.')
param tags object

@description('Unique-ish token used to build globally unique resource names.')
param resourceToken string

@description('App Service plan SKU.')
param appServiceSku string

// Linux App Service plan that hosts the web app.
resource plan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: 'plan-${resourceToken}'
  location: location
  tags: tags
  sku: {
    name: appServiceSku
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

// The web app. A system-assigned managed identity is turned on from the start,
// so later labs (database, Key Vault) can grant it access without adding secrets.
resource web 'Microsoft.Web/sites@2023-12-01' = {
  name: 'app-${resourceToken}'
  location: location
  // azd maps the 'web' service in azure.yaml to the resource carrying this tag.
  tags: union(tags, { 'azd-service-name': 'web' })
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: plan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|22-lts'
      alwaysOn: appServiceSku != 'F1' && appServiceSku != 'D1'
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
      appSettings: [
        {
          // Build the app on deploy (npm install) via Oryx.
          name: 'SCM_DO_BUILD_DURING_DEPLOYMENT'
          value: 'true'
        }
      ]
    }
  }
}

output webAppName string = web.name
output webAppUri string = 'https://${web.properties.defaultHostName}'
