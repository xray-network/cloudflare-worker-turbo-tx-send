import type { ServerConfig } from "./types"

const ServerConfig: ServerConfig = {
  // IP addresses are forbidden by CF, expose them through CF DNS. HAProxy routes to the desired service on port 80 using the HostResolver header
  mainnet: ["http://ogmios-server-1.com", "http://ogmios-server-2.com"],
  preview: ["http://ogmios-server-preview.com"],
  preprod: ["http://ogmios-server-preprod.com"],
}

export default ServerConfig
