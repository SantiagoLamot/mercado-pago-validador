#!/bin/bash
# ============================================================
# mp-validador — Script de despliegue en VPS
# Uso: ./deploy.sh [comando]
# ============================================================

set -e

COMPOSE_FILE="docker-compose.prod.yml"
PROJECT_NAME="mp-validador"
DOMAIN="mpvalidador.online"
EMAIL="santiagolamot25@gmail.com"
REPO="git@github.com:SantiagoLamot/mercado-pago-validador.git"
NGINX_PROXY_CONTAINER="nginx-proxy"
LE_VOLUME="tapalqueapp_letsencrypt_data"
CERTBOT_VOLUME="tapalqueapp_certbot_www"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
log()  { echo -e "${BLUE}[mp-validador]${NC} $1"; }
ok()   { echo -e "${GREEN}[OK]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
err()  { echo -e "${RED}[ERR]${NC} $1"; exit 1; }

check_env() {
    if [ ! -f ".env" ]; then
        err "Falta .env en la raíz — copiá .env.prod.example a .env y completá los valores"
    fi
    if [ ! -f "validador-backend/.env" ]; then
        err "Falta validador-backend/.env — copiá validador-backend/.env.prod.example y completá los valores"
    fi
    if [ ! -f "validador-frontend/.env" ]; then
        err "Falta validador-frontend/.env — copiá validador-frontend/.env.prod.example y completá los valores (se hornea en el build, así que debe existir ANTES de up/deploy)"
    fi
}

# ── SSL con certbot usando los volúmenes del proyecto existente ───────────────

cmd_ssl() {
    log "Obteniendo certificado SSL para $DOMAIN..."

    log "Agregando config HTTP temporal al nginx-proxy..."
    docker exec $NGINX_PROXY_CONTAINER sh -c "cat > /etc/nginx/conf.d/mp-validador-temp.conf << 'NGINXEOF'
server {
    listen 80;
    server_name mpvalidador.online www.mpvalidador.online;
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    location / {
        return 200 'mp-validador - configurando...';
        add_header Content-Type text/plain;
    }
}
NGINXEOF"
    docker exec $NGINX_PROXY_CONTAINER nginx -t
    docker exec $NGINX_PROXY_CONTAINER nginx -s reload
    ok "nginx-proxy recargado con config temporal"

    sleep 2

    log "Ejecutando certbot..."
    docker run --rm \
        -v ${LE_VOLUME}:/etc/letsencrypt \
        -v ${CERTBOT_VOLUME}:/var/www/certbot \
        certbot/certbot certonly \
        --webroot \
        --webroot-path /var/www/certbot \
        --email "$EMAIL" \
        --agree-tos \
        --no-eff-email \
        -d "$DOMAIN" \
        -d "www.$DOMAIN"

    log "Instalando config final de nginx..."
    docker exec $NGINX_PROXY_CONTAINER rm -f /etc/nginx/conf.d/mp-validador-temp.conf
    docker cp nginx/mp-validador.conf $NGINX_PROXY_CONTAINER:/etc/nginx/conf.d/mp-validador.conf
    docker exec $NGINX_PROXY_CONTAINER nginx -t
    docker exec $NGINX_PROXY_CONTAINER nginx -s reload

    ok "SSL configurado para $DOMAIN"
    ok "nginx-proxy actualizado — los otros proyectos siguen intactos"
}

# ── Actualizar solo el config de nginx ───────────────────────────────────────

cmd_nginx() {
    log "Actualizando config nginx de mp-validador..."
    docker cp nginx/mp-validador.conf $NGINX_PROXY_CONTAINER:/etc/nginx/conf.d/mp-validador.conf
    docker exec $NGINX_PROXY_CONTAINER nginx -t && docker exec $NGINX_PROXY_CONTAINER nginx -s reload
    ok "nginx-proxy recargado"
}

# ── Docker ───────────────────────────────────────────────────────────────────

cmd_up() {
    check_env
    log "Levantando servicios mp-validador..."
    docker compose -f $COMPOSE_FILE -p $PROJECT_NAME up -d --build
    ok "Servicios activos"
}

cmd_down() {
    log "Deteniendo servicios mp-validador..."
    docker compose -f $COMPOSE_FILE -p $PROJECT_NAME down
    ok "Servicios detenidos"
}

cmd_restart() {
    log "Reiniciando servicios mp-validador..."
    docker compose -f $COMPOSE_FILE -p $PROJECT_NAME restart
    ok "Servicios reiniciados"
}

cmd_logs() {
    SERVICE="${2:-}"
    docker compose -f $COMPOSE_FILE -p $PROJECT_NAME logs -f --tail=150 $SERVICE
}

cmd_status() {
    docker compose -f $COMPOSE_FILE -p $PROJECT_NAME ps
}

cmd_pull() {
    log "Actualizando código..."
    git pull origin main
    ok "Código actualizado"
}

cmd_deploy() {
    log "=== Deploy ==="
    cmd_pull
    check_env
    docker compose -f $COMPOSE_FILE -p $PROJECT_NAME up -d --build
    ok "=== Deploy completado ==="
}

# ── Instalación completa ─────────────────────────────────────────────────────

cmd_install() {
    log "=== Instalación inicial de mp-validador ==="
    check_env

    log "Construyendo y levantando containers..."
    docker compose -f $COMPOSE_FILE -p $PROJECT_NAME up -d --build

    cmd_ssl

    ok "=== mp-validador instalado ==="
    echo ""
    echo "  Sitio: https://$DOMAIN"
    echo ""
}

# ── Router ───────────────────────────────────────────────────────────────────

case "${1:-help}" in
    install) cmd_install ;;
    ssl)     cmd_ssl ;;
    nginx)   cmd_nginx ;;
    up)      cmd_up ;;
    down)    cmd_down ;;
    restart) cmd_restart ;;
    deploy)  cmd_deploy ;;
    logs)    cmd_logs "$@" ;;
    status)  cmd_status ;;
    pull)    cmd_pull ;;
    *)
        echo "Uso: ./deploy.sh [comando]"
        echo ""
        echo "  install   Primera instalación completa"
        echo "  deploy    git pull + rebuild + restart"
        echo "  ssl       Solo obtener/renovar certificado SSL"
        echo "  nginx     Solo actualizar config nginx"
        echo "  up        Levantar/rebuildar containers"
        echo "  down      Detener containers"
        echo "  restart   Reiniciar sin rebuild"
        echo "  logs      Ver logs  (./deploy.sh logs backend)"
        echo "  status    Estado de los containers"
        ;;
esac
