<a href="https://discord.gg/WhZmm46APN"><img alt="Discord" src="https://img.shields.io/discord/852538978946383893?style=for-the-badge&logo=discord&label=Discord&labelColor=%231940ED&color=%233FCB9B"></a>

# XRAY | Graph | Turbo TX Send — Cloudflare Worker

> [!WARNING]
> **DEPRECATED:** The tool has been moved to XRAY | Graph | Output, which is an internal proprietary XRAY project that acts as a load balancer and proxy tool for API management and documentation in OpenAPI format

> [!NOTE]
> XRAY | Graph | Turbo TX Send — Accelerating TXs sending for Cardano blockchain

## Getting Started
### Prepare Installation

``` console
git clone \
  --recurse-submodules \
  https://github.com/xray-network/cloudflare-worker-turbo-tx-send/.git \
  && cd cloudflare-worker-turbo-tx-send
```
``` console
cp src/servers.conf.example.ts src/servers.conf.ts
```

### Edit [wrangler.toml](https://github.com/xray-network/cloudflare-worker-output-load-balancer/blob/main/wrangler.toml)

```
change KV_TURBO_TX_SEND_COUNTER id
```

### Edit [servers.conf.ts](https://github.com/xray-network/cloudflare-worker-output-load-balancer/blob/main/src/servers.conf.example.ts)

```
Configure settings for ogmios
```

### Run Dev Server

```
yarn start
```

### Deploy to Cloudflare Workers

```
yarn deploy
```
