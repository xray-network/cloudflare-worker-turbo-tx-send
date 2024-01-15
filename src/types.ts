export type Network = "mainnet" | "preview" | "preprod"

export type ServerConfig = {
  [service: string]: string[]
}
