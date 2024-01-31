/**
 * @@ XRAY NETWORK | Graph | Turbo TX Send API
 * Sending TXs to nodes that are evenly distributed geographically AND have a small queue in Mempool gives a higher probability of hitting the blockchain sooner
 * Learn more at https://developers.cloudflare.com/workers/
 */

import serversConfig from "./servers.conf"
import formTemplate from "./form.template"
import * as Types from "./types"

const API_GROUP = "turbo-tx-send"
const ALLOWED_METHODS = ["GET", "POST", "OPTIONS", "HEAD"]
const ALLOWED_NETWORKS: Types.Network[] = ["mainnet", "preprod", "preview"]
const LOAD_BALANCER_ENABLED = true // Transmit to random node for to avoid unnecesary accumulation of transactions in Mempool
const LOAD_BALANCER_SERVERS_COUNT = 3 // Amount of nodes to send
const TIMEOUT = 5000 // 5 second timeout for each request

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const { segments, pathname, search } = getUrlSegments(new URL(request.url))
    const [group, __network, transaction] = segments
    const network = __network as Types.Network

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": ALLOWED_METHODS.join(", "),
          "Access-Control-Max-Age": "86400",
          "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
        },
      })
    }

    if (!ALLOWED_METHODS.includes(request.method)) return throw405()
    if (group !== API_GROUP) return throw404()
    if (!ALLOWED_NETWORKS.includes(network)) return throw404()

    const __servers = serversConfig[network].map((server, index) => ({ url: server, id: index }))
    const servers = LOAD_BALANCER_ENABLED
      ? __servers
          .sort(() => 0.5 - Math.random())
          .slice(0, LOAD_BALANCER_SERVERS_COUNT)
          .sort((a, b) => a.id - b.id)
      : __servers

    try {
      if (request.method === "GET") {
        return addCorsHeaders(
          new Response(formTemplate(network), {
            headers: {
              "Content-Type": "text/html;charset=UTF-8",
            },
          })
        )
      }

      if (request.method === "POST") {
        const TX = await request.text()

        const postToServerWithTimeout = async (url: string, body: string): Promise<any> => {
          const timeout = new Promise((_, reject) => setTimeout(() => reject("timeout"), TIMEOUT))
          const postRequest = fetch(url, {
            method: "POST",
            headers: {
              HostResolver: `ogmios/${network}`,
              "Content-Type": "application/json",
            },
            body,
          }).then((response) => response.json())
          return Promise.race([postRequest, timeout])
        }

        const sendRequestsAndGetStats = async (): Promise<any[]> => {
          const requests = servers.map(async (server, index) => {
            const body = JSON.stringify({
              jsonrpc: "2.0",
              method: "submitTransaction",
              params: { transaction: { cbor: TX } },
            })
            return postToServerWithTimeout(server.url, body)
              .then((data) => ({ node: server.id, done: true, response: data }))
              .catch((data) => ({ node: server.id, done: false, response: data }))
          })
          return Promise.all(requests)
        }

        const txResponse = await sendRequestsAndGetStats()
        const txsSuccess = txResponse.filter((tx: any) => tx?.done && tx?.response?.result?.transaction?.id)
        const txWithHash = txsSuccess.find((tx: any) => tx?.response?.result?.transaction?.id)
        const txHash = txWithHash?.response?.result?.transaction?.id || ""
        const nodesTotal = serversConfig[network].length
        const nodesPicked = servers.length
        const nodesSuccess = txResponse.filter((result: any) => result?.done)
        const nodesIds = servers.map((server) => server.id)
        const status = txsSuccess.length > 0 ? "success" : "failed"

        // Adding request count to Stats, using waitUntil()
        const delayedProcessing = async () => {
          const requestsCount = (await env.KV_TURBO_TX_SEND_COUNTER.get(`${network}::${status}`)) || 0
          await env.KV_TURBO_TX_SEND_COUNTER.put(`${network}::${status}`, (Number(requestsCount) + 1).toString())
        }
        ctx.waitUntil(delayedProcessing())

        return addCorsHeaders(
          new Response(
            JSON.stringify({
              status,
              hash: txHash,
              network,
              accept_success: txsSuccess.length,
              accept_failed: nodesPicked - txsSuccess.length,
              nodes: {
                conn_success: nodesSuccess.length,
                conn_failed: nodesPicked - nodesSuccess.length,
                lb_enabled: LOAD_BALANCER_ENABLED,
                lb_nodes_pool_size: nodesTotal,
                lb_picked: nodesPicked,
                lb_picked_ids: nodesIds,
                details: txResponse,
              },
            }),
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
        )
      }

      return throw404()
    } catch (error) {
      console.log(error)
      return throw404()
    }
  },
}

const getUrlSegments = (url: URL) => {
  const pathname = url.pathname
  const search = url.search
  const segments = pathname.replace(/^\//g, "").split("/")

  return {
    segments,
    pathname,
    search,
  }
}

const addCorsHeaders = (response: Response) => {
  const headers = new Headers(response.headers)
  headers.set("Access-Control-Allow-Origin", "*")
  return new Response(response.body, { ...response, status: response.status, headers })
}

const addExpirationHeaders = (response: Response, time: number) => {
  const headers = new Headers(response.headers)
  headers.set("Cache-Control", `public, max-age=${time.toString()}`)
  headers.set("Expires", new Date(Date.now() + time * 1000).toUTCString())
  return new Response(response.body, { ...response, status: response.status, headers })
}

const throw404 = () => {
  return addCorsHeaders(new Response("404. API not found. Check if the request is correct", { status: 404 }))
}

const throw405 = () => {
  return addCorsHeaders(new Response("405. Method not allowed. Check if the request is correct", { status: 405 }))
}

const throw500 = () => {
  return addCorsHeaders(new Response("500. Server error! Something went wrong", { status: 500 }))
}

const throwReject = (response: Response) => {
  return addCorsHeaders(new Response(response.body, response))
}
