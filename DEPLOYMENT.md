# Deployment on Proxmox + Cloudflare Tunnel

For an explanation of how election content is produced and updated, see [CONTENT.md](./CONTENT.md).

## 1) Prepare VM/LXC on Proxmox
- Install Docker Engine and Docker Compose plugin.
- Clone this repository on the host, e.g. `/opt/verkiezingen`.

## 2) Configure Cloudflare Tunnel
- In Cloudflare Zero Trust, create a **Cloudflared** tunnel.
- Add a public hostname (for example `verkiezingen.yourdomain.nl`).
- Set service URL to `http://web:3000`.
- Copy the tunnel token.

## 3) Configure runtime env
```bash
cp .env.example .env
# edit .env and set CF_TUNNEL_TOKEN
```

## 4) Start the stack
```bash
docker compose --env-file .env up -d --build
```

## 5) Update/deploy new versions
```bash
./deploy.sh
```

## Useful checks
```bash
docker compose ps
docker compose logs -f cloudflared
docker compose logs -f web
```
