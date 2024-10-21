# 使用官方的 Node.js 镜像作为基础镜像
FROM node:20-alpine as build-stage

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 yarn.lock
COPY package.json yarn.lock ./

# 使用 npm 安装 yarn
#RUN npm install -g yarn
RUN set -x && node -v
RUN set -x && npm -v
RUN set -x && rm -f /usr/local/bin/yarn
RUN set -x && npm install -g yarn --force

# 安装项目依赖
RUN yarn install

# 复制项目文件
COPY . .

# 构建项目
RUN yarn build --mode prod

# 使用 Nginx 作为生产环境服务器
FROM nginx:alpine

#RUN adduser --system --no-create-home --shell /bin/false --group --disabled-login www-data

# 复制构建好的文件到 Nginx 的默认目录
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 复制自定义的 Nginx 配置文件
COPY ./docker/nginx/conf/nginx.conf /etc/nginx/nginx.conf

# 暴露 8080 端口
EXPOSE 8080

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]