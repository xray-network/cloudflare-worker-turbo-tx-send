import type { ServerConfig } from "./types"

const ServerConfig: ServerConfig = {
  // IP addresses are forbidden by CF, expose them through CF DNS. HAProxy routes to the desired service on port 80 using the HostResolver header
  mainnet: ["http://relay-server-1.com", "http://relay-server-2.com"],
  preview: ["http://relay-server-preview.com"],
  preprod: ["http://relay-server-preprod.com"],
}

export default ServerConfig
