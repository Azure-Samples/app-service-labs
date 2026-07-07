targetScope = 'subscription'

@minLength(1)
@maxLength(64)
@description('Name of the azd environment - used to name the resource group and derive resource names.')
param environmentName string

@minLength(1)
@description('Azure region for all resources. Use a region where your App Service plan tier is available.')
param location string

@description('App Service plan SKU. B1 (Basic) is a low-cost tier that is ideal for this learning path.')
param appServiceSku string = 'B1'

var resourceToken = toLower(uniqueString(subscription().id, environmentName, location))
var tags = { 'azd-env-name': environmentName }

resource rg 'Microsoft.Resources/resourceGroups@2023-07-01' = {
  name: 'rg-${environmentName}'
  location: location
  tags: tags
}

module resources 'resources.bicep' = {
  name: 'resources'
  scope: rg
  params: {
    location: location
    tags: tags
    resourceToken: resourceToken
    appServiceSku: appServiceSku
  }
}

output AZURE_LOCATION string = location
output RESOURCE_GROUP_NAME string = rg.name
output WEB_APP_NAME string = resources.outputs.webAppName
output WEB_APP_URI string = resources.outputs.webAppUri
