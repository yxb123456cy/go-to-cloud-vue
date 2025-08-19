# 使用官方 Nginx 镜像作为基础镜像
FROM swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/nginx:1.26.2-alpine

# 将 Vue 项目打包后的 dist 目录内容复制到 Nginx 的默认站点目录
COPY ./dist /usr/share/nginx/html

# 可选：复制自定义的 Nginx 配置文件（如果需要自定义配置）
# COPY nginx.conf /etc/nginx/nginx.conf

# 暴露 80 端口
EXPOSE 80

# 启动 Nginx 服务
CMD ["nginx", "-g", "daemon off;"]