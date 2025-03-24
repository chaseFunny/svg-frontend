#!/bin/bash

# 停止 PM2 应用
pm2 stop svg-generate

# 清理 Next.js 缓存
rm -rf .next

# 重新构建
npm run clean-build

# 重启应用
pm2 reload ecosystem.config.js

# 清理 Nginx 缓存 (如果您知道缓存路径)
# 请替换为实际的缓存路径，可以通过 grep proxy_cache_path /www/server/nginx/conf/nginx.conf 查找
CACHE_PATH="/www/server/nginx/proxy_temp"
if [ -d "$CACHE_PATH" ]; then
  rm -rf ${CACHE_PATH}/*
  echo "Nginx 缓存已清理"
fi

# 重启 Nginx
/www/server/nginx/sbin/nginx -s reload

echo "部署完成，所有缓存已清理" 