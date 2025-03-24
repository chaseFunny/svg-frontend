module.exports = {
  apps: [
    {
      name: "svg-generate",
      script: "node_modules/next/dist/bin/next",
      args: "start --port 3002",
      instances: 1,
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
  deploy: {
    production: {
      // 部署相关配置
      "pre-deploy-local": "echo '开始部署'",
      "post-deploy":
        "npm install && npm run build && pm2 reload ecosystem.config.js --update-env && echo '清理缓存完成'",
    },
  },
};
