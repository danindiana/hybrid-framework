#!/bin/bash
# check_upstream_versions.sh
# Verifies installed custom versions against the latest online releases.

echo "=================================================="
echo "Custom Upstream Software Version Auditor"
echo "=================================================="

# Local Versions
openssl_local=$(/usr/local/bin/openssl version | awk '{print $2}')
curl_local=$(/usr/local/bin/curl --version | head -n1 | awk '{print $2}')
ssh_local=$(/usr/local/ssh/bin/ssh -V 2>&1 | awk -F'[_ ]' '{print $2}' | cut -d',' -f1)
nginx_local=$(/usr/local/sbin/nginx -v 2>&1 | awk -F'/' '{print $2}')

echo "Checking local versions..."
echo "- OpenSSL:  $openssl_local"
echo "- cURL:     $curl_local"
echo "- OpenSSH:  $ssh_local"
echo "- Nginx:    $nginx_local"
echo ""

# Query Online Releases (fetching latest tag/version)
echo "Querying latest upstream versions..."

# OpenSSL latest 3.5.x
openssl_latest=$(/usr/local/bin/curl -s https://api.github.com/repos/openssl/openssl/releases | grep -oP '"tag_name": "openssl-\K3.5.[0-9]+' | head -n1)

# zlib-ng
zlibng_latest=$(/usr/local/bin/curl -s https://api.github.com/repos/zlib-ng/zlib-ng/releases/latest | grep -oP '"tag_name": "\K[0-9.]+')

# cURL
curl_latest=$(/usr/local/bin/curl -s https://api.github.com/repos/curl/curl/releases/latest | grep -oP '"tag_name": "curl-\K[0-9_]+' | head -n1 | tr '_' '.')

# OpenSSH
openssh_latest=$(/usr/local/bin/curl -s https://ftp.openbsd.org/pub/OpenBSD/OpenSSH/portable/ | grep -oP 'openssh-\K10.[0-9]p[0-9]' | sort -V | tail -n1)

# Nginx
nginx_latest=$(/usr/local/bin/curl -s https://nginx.org/en/download.html | grep -oP 'nginx-\K1.30.[0-9]+' | head -n1)

echo "- OpenSSL (LTS 3.5.x) Latest:  $openssl_latest"
echo "- zlib-ng Latest:             $zlibng_latest"
echo "- cURL Latest:                $curl_latest"
echo "- OpenSSH (Portable) Latest:  $openssh_latest"
echo "- Nginx (Stable) Latest:      $nginx_latest"
echo ""

echo "Audit Summary:"
# Compare
if [ "$openssl_local" = "$openssl_latest" ]; then echo " [OK] OpenSSL is up to date."; else echo " [!] OpenSSL update available ($openssl_latest)."; fi
if [ "$curl_local" = "$curl_latest" ]; then echo " [OK] cURL is up to date."; else echo " [!] cURL update available ($curl_latest)."; fi
if [ "$ssh_local" = "$openssh_latest" ]; then echo " [OK] OpenSSH is up to date."; else echo " [!] OpenSSH update available ($openssh_latest)."; fi
if [ "$nginx_local" = "$nginx_latest" ]; then echo " [OK] Nginx is up to date."; else echo " [!] Nginx update available ($nginx_latest)."; fi
