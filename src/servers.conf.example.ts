import type { ServerConfig } from "./types"

const ServerConfig: ServerConfig = {
  mainnet: ["http://relay-server-1.com:1337", "http://relay-server-2.com:1337"], // Ogmios host:port
  preview: ["http://relay-server-preview.com:1337"],
  preprod: ["http://relay-server-preprod.com:1337"],
}

export default ServerConfig
