# Stage 1
FROM node:12.19.0-alpine3.12 as node

# ENV http_proxy=http://192.168.251.227:8080 \
#     https_proxy=http://192.168.251.227:8080 \
#     no_proxy=*.tjpe.gov.br,*.tjpe.jus.br,localhost \
#     HTTP_PROXY=http://192.168.251.227:8080 \
#     HTTPS_PROXY=http://192.168.251.227:8080 \
#     NO_PROXY=*.tjpe.gov.br,*.tjpe.jus.br,localhost

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm install -g @angular/cli@10.0.6
RUN ng build --configuration production --output-path=/dist

# Stage 2
FROM nginx:1.19.2-alpine

COPY --from=node /dist /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf