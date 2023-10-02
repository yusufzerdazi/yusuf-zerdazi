
resource blobStorage 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  name: 'yusufzerdazi'
  location: 'westeurope'
  tags: {}
  properties: {
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: true
    allowSharedKeyAccess: true
    networkAcls: {
      ipv6Rules: []
      bypass: 'AzureServices'
      virtualNetworkRules: []
      ipRules: []
      defaultAction: 'Allow'
    }
    supportsHttpsTrafficOnly: true
    encryption: {
      services: {
        file: {
          keyType: 'Account'
          enabled: true
        }
        blob: {
          keyType: 'Account'
          enabled: true
        }
      }
      keySource: 'Microsoft.Storage'
    }
    accessTier: 'Hot'
  }
}

resource cdn 'Microsoft.Cdn/profiles@2023-05-01' = {
  name: 'yusufzerdazi'
  location: 'SouthCentralUs'
  tags: {}
  sku: {
    name: 'Standard_Verizon'
  }
  properties: {}
}


@description('Generated from /subscriptions/4b89f88e-13f2-4990-bf5f-3ab2e4d5301f/resourceGroups/yusufzerdazi/providers/Microsoft.Cdn/profiles/yusufzerdazi/endpoints/yusufzerdazi')
resource endpoint 'Microsoft.Cdn/profiles/endpoints@2023-05-01' = {
  parent: cdn
  name: 'yusufzerdazi'
  location: 'SouthCentralUs'
  tags: {}
  properties: {
    originHostHeader: 'yusufzerdazi.z6.web.core.windows.net'
    contentTypesToCompress: [
      'text/plain'
      'text/html'
      'text/css'
      'text/javascript'
      'application/x-javascript'
      'application/javascript'
      'application/json'
      'application/xml'
    ]
    isCompressionEnabled: false
    isHttpAllowed: false
    isHttpsAllowed: true
    queryStringCachingBehavior: 'IgnoreQueryString'
    origins: [
      {
        name: 'yusufzerdazi-azurewebsites-net'
        properties: {
          hostName: 'yusufzerdazi.z6.web.core.windows.net'
          enabled: true
        }
      }
    ]
    originGroups: []
    geoFilters: []
    urlSigningKeys: []
  }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: 'yusufzerdazi'
  location: 'westeurope'
  tags: {
    'hidden-link:/subscriptions/4b89f88e-13f2-4990-bf5f-3ab2e4d5301f/resourceGroups/yusufzerdazi/providers/Microsoft.Web/sites/yusufzerdazi': 'Resource'
  }
  kind: 'web'
  etag: '"8200ef06-0000-0200-0000-651b160c0000"'
  properties: {
    Application_Type: 'web'
    Request_Source: 'IbizaWebAppExtensionCreate'
    RetentionInDays: 90
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
    Ver: 'v2'
  }
}
