#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const TOOLS = [
  {
    "name": "accountsListAccounts",
    "description": "GET /accounts · List Accounts",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "page": {
          "type": "string"
        },
        "per_page": {
          "type": "string"
        },
        "direction": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "accountCreation",
    "description": "POST /accounts · Create an account",
    "inputSchema": {
      "type": "object",
      "properties": {}
    }
  },
  {
    "name": "accountsBatchMoveAccounts",
    "description": "POST /accounts/move · Batch move accounts",
    "inputSchema": {
      "type": "object",
      "properties": {}
    }
  },
  {
    "name": "customPagesForAnAccountListCustomPages",
    "description": "GET /accounts/{account_identifier}/custom_pages · List custom pages",
    "inputSchema": {
      "type": "object",
      "properties": {
        "account_identifier": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "customAssetsForAnAccountListCustomAssets",
    "description": "GET /accounts/{account_identifier}/custom_pages/assets · List custom assets",
    "inputSchema": {
      "type": "object",
      "properties": {
        "account_identifier": {
          "type": "string"
        },
        "page": {
          "type": "string"
        },
        "per_page": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "customAssetsForAnAccountCreateACustomAsset",
    "description": "POST /accounts/{account_identifier}/custom_pages/assets · Create a custom asset",
    "inputSchema": {
      "type": "object",
      "properties": {
        "account_identifier": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "customAssetsForAnAccountGetACustomAsset",
    "description": "GET /accounts/{account_identifier}/custom_pages/assets/{asset_name} · Get a custom asset",
    "inputSchema": {
      "type": "object",
      "properties": {
        "asset_name": {
          "type": "string"
        },
        "account_identifier": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "customAssetsForAnAccountUpdateACustomAsset",
    "description": "PUT /accounts/{account_identifier}/custom_pages/assets/{asset_name} · Update a custom asset",
    "inputSchema": {
      "type": "object",
      "properties": {
        "asset_name": {
          "type": "string"
        },
        "account_identifier": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "customAssetsForAnAccountDeleteACustomAsset",
    "description": "DELETE /accounts/{account_identifier}/custom_pages/assets/{asset_name} · Delete a custom asset",
    "inputSchema": {
      "type": "object",
      "properties": {
        "asset_name": {
          "type": "string"
        },
        "account_identifier": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "customPagesForAnAccountCreatePreviewToken",
    "description": "POST /accounts/{account_identifier}/custom_pages/preview_tokens · Create a preview token",
    "inputSchema": {
      "type": "object",
      "properties": {
        "account_identifier": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "customPagesForAnAccountGetACustomPage",
    "description": "GET /accounts/{account_identifier}/custom_pages/{identifier} · Get a custom page",
    "inputSchema": {
      "type": "object",
      "properties": {
        "identifier": {
          "type": "string"
        },
        "account_identifier": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "customPagesForAnAccountUpdateACustomPage",
    "description": "PUT /accounts/{account_identifier}/custom_pages/{identifier} · Update a custom page",
    "inputSchema": {
      "type": "object",
      "properties": {
        "identifier": {
          "type": "string"
        },
        "account_identifier": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "accountsAccountDetails",
    "description": "GET /accounts/{account_id} · Account Details",
    "inputSchema": {
      "type": "object",
      "properties": {
        "account_id": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "accountsUpdateAccount",
    "description": "PUT /accounts/{account_id} · Update Account",
    "inputSchema": {
      "type": "object",
      "properties": {
        "account_id": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "accountDeletion",
    "description": "DELETE /accounts/{account_id} · Delete a specific account",
    "inputSchema": {
      "type": "object",
      "properties": {
        "account_id": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "listAbuseReports",
    "description": "GET /accounts/{account_id}/abuse-reports · List abuse reports",
    "inputSchema": {
      "type": "object",
      "properties": {
        "account_id": {
          "type": "string"
        },
        "page": {
          "type": "string"
        },
        "per_page": {
          "type": "string"
        },
        "sort": {
          "type": "string"
        },
        "domain": {
          "type": "string"
        },
        "created_before": {
          "type": "string"
        },
        "created_after": {
          "type": "string"
        },
        "status": {
          "type": "string"
        },
        "type": {
          "type": "string"
        },
        "mitigation_status": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "listEmails",
    "description": "GET /accounts/{account_id}/abuse-reports/{report_id}/emails · List abuse report emails",
    "inputSchema": {
      "type": "object",
      "properties": {
        "account_id": {
          "type": "string"
        },
        "report_id": {
          "type": "string"
        },
        "page": {
          "type": "string"
        },
        "per_page": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "listMitigations",
    "description": "GET /accounts/{account_id}/abuse-reports/{report_id}/mitigations · List abuse report mitigations",
    "inputSchema": {
      "type": "object",
      "properties": {
        "account_id": {
          "type": "string"
        },
        "report_id": {
          "type": "string"
        },
        "page": {
          "type": "string"
        },
        "per_page": {
          "type": "string"
        },
        "sort": {
          "type": "string"
        },
        "type": {
          "type": "string"
        },
        "effective_before": {
          "type": "string"
        },
        "effective_after": {
          "type": "string"
        },
        "status": {
          "type": "string"
        },
        "entity_type": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "requestReview",
    "description": "POST /accounts/{account_id}/abuse-reports/{report_id}/mitigations/appeal · Request review on mitigations",
    "inputSchema": {
      "type": "object",
      "properties": {
        "account_id": {
          "type": "string"
        },
        "report_id": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "getAbuseReport",
    "description": "GET /accounts/{account_id}/abuse-reports/{report_param} · Abuse Report Details",
    "inputSchema": {
      "type": "object",
      "properties": {
        "account_id": {
          "type": "string"
        },
        "report_param": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "submitAbuseReport",
    "description": "POST /accounts/{account_id}/abuse-reports/{report_param} · Submit an abuse report",
    "inputSchema": {
      "type": "object",
      "properties": {
        "account_id": {
          "type": "string"
        },
        "report_param": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "mcpPortalsApiListPortals",
    "description": "GET /accounts/{account_id}/access/ai-controls/mcp/portals · List MCP Portals",
    "inputSchema": {
      "type": "object",
      "properties": {
        "account_id": {
          "type": "string"
        },
        "page": {
          "type": "string"
        },
        "per_page": {
          "type": "string"
        },
        "search": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "mcpPortalsApiCreatePortals",
    "description": "POST /accounts/{account_id}/access/ai-controls/mcp/portals · Create a new MCP Portal",
    "inputSchema": {
      "type": "object",
      "properties": {
        "account_id": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "mcpPortalsApiFetchGateways",
    "description": "GET /accounts/{account_id}/access/ai-controls/mcp/portals/{id} · Read details of an MCP Portal",
    "inputSchema": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "account_id": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "mcpPortalsApiUpdatePortals",
    "description": "PUT /accounts/{account_id}/access/ai-controls/mcp/portals/{id} · Update a MCP Portal",
    "inputSchema": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "account_id": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "mcpPortalsApiDeletePortals",
    "description": "DELETE /accounts/{account_id}/access/ai-controls/mcp/portals/{id} · Delete a MCP Portal",
    "inputSchema": {
      "type": "object",
      "properties": {
        "account_id": {
          "type": "string"
        },
        "id": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "mcpPortalsApiListServers",
    "description": "GET /accounts/{account_id}/access/ai-controls/mcp/servers · List MCP Servers",
    "inputSchema": {
      "type": "object",
      "properties": {
        "account_id": {
          "type": "string"
        },
        "page": {
          "type": "string"
        },
        "per_page": {
          "type": "string"
        },
        "search": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "mcpPortalsApiCreateServers",
    "description": "POST /accounts/{account_id}/access/ai-controls/mcp/servers · Create a new MCP Server",
    "inputSchema": {
      "type": "object",
      "properties": {
        "account_id": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "mcpPortalsApiFetchServers",
    "description": "GET /accounts/{account_id}/access/ai-controls/mcp/servers/{id} · Read the details of a MCP Server",
    "inputSchema": {
      "type": "object",
      "properties": {
        "account_id": {
          "type": "string"
        },
        "id": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "mcpPortalsApiUpdateServers",
    "description": "PUT /accounts/{account_id}/access/ai-controls/mcp/servers/{id} · Update a MCP Server",
    "inputSchema": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "account_id": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "mcpPortalsApiDeleteServers",
    "description": "DELETE /accounts/{account_id}/access/ai-controls/mcp/servers/{id} · Delete a MCP Server",
    "inputSchema": {
      "type": "object",
      "properties": {
        "account_id": {
          "type": "string"
        },
        "id": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "mcpPortalsApiSyncServer",
    "description": "POST /accounts/{account_id}/access/ai-controls/mcp/servers/{id}/sync · Sync MCP Server Capabilities",
    "inputSchema": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "account_id": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "accessApplicationsListAccessApplications",
    "description": "GET /accounts/{account_id}/access/apps · List Access applications",
    "inputSchema": {
      "type": "object",
      "properties": {
        "account_id": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "domain": {
          "type": "string"
        },
        "aud": {
          "type": "string"
        },
        "target_attributes": {
          "type": "string"
        },
        "exact": {
          "type": "string"
        },
        "search": {
          "type": "string"
        },
        "undefined": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "accessApplicationsAddAnApplication",
    "description": "POST /accounts/{account_id}/access/apps · Add an Access application",
    "inputSchema": {
      "type": "object",
      "properties": {
        "account_id": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "accessShortLivedCertificateCAsListShortLivedCertificateCAs",
    "description": "GET /accounts/{account_id}/access/apps/ca · List short-lived certificate CAs",
    "inputSchema": {
      "type": "object",
      "properties": {
        "account_id": {
          "type": "string"
        },
        "undefined": {
          "type": "string"
        },
        "per_page": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "accessApplicationsGetAnAccessApplication",
    "description": "GET /accounts/{account_id}/access/apps/{app_id} · Get an Access application",
    "inputSchema": {
      "type": "object",
      "properties": {
        "app_id": {
          "type": "string"
        },
        "account_id": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "accessApplicationsUpdateAnAccessApplication",
    "description": "PUT /accounts/{account_id}/access/apps/{app_id} · Update an Access application",
    "inputSchema": {
      "type": "object",
      "properties": {
        "app_id": {
          "type": "string"
        },
        "account_id": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "accessApplicationsDeleteAnAccessApplication",
    "description": "DELETE /accounts/{account_id}/access/apps/{app_id} · Delete an Access application",
    "inputSchema": {
      "type": "object",
      "properties": {
        "app_id": {
          "type": "string"
        },
        "account_id": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "accessShortLivedCertificateCAsGetAShortLivedCertificateCa",
    "description": "GET /accounts/{account_id}/access/apps/{app_id}/ca · Get a short-lived certificate CA",
    "inputSchema": {
      "type": "object",
      "properties": {
        "app_id": {
          "type": "string"
        },
        "account_id": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "accessShortLivedCertificateCAsCreateAShortLivedCertificateCa",
    "description": "POST /accounts/{account_id}/access/apps/{app_id}/ca · Create a short-lived certificate CA",
    "inputSchema": {
      "type": "object",
      "properties": {
        "app_id": {
          "type": "string"
        },
        "account_id": {
          "type": "string"
        }
      }
    }
  }
];
const UPSTREAM = process.env.UPSTREAM || 'https://api.cloudflare.com/client/v4';
const APIKEY = process.env.CLOUDFLARE_WORKERS_KEY || process.env.API_KEY || '';

const server = new Server({ name: 'cloudflare-workers-mcp', version: '1.0.0' }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));
server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const tool = TOOLS.find(t => t.name === req.params.name);
  if (!tool) throw new Error('unknown tool');
  const args = req.params.arguments || {};
  const path = tool.description.match(/(GET|POST|PUT|PATCH|DELETE) (\S+)/) || [];
  const method = path[1] || 'GET';
  let url = new URL(path[2] || '/', UPSTREAM);
  for (const [k, v] of Object.entries(args)) if (typeof v === 'string' && url.pathname.includes('{' + k + '}')) url.pathname = url.pathname.replace('{' + k + '}', v);
  const opts = { method, headers: { Authorization: APIKEY ? 'Bearer ' + APIKEY : '' } };
  if (method !== 'GET' && Object.keys(args).length) { opts.body = JSON.stringify(args); opts.headers['Content-Type'] = 'application/json'; }
  const res = await fetch(url, opts);
  const txt = await res.text();
  return { content: [{ type: 'text', text: txt.slice(0, 4000) }] };
});

await server.connect(new StdioServerTransport());
console.error('cloudflare-workers-mcp v1.0.0 · stdio ready · 40 tools');
