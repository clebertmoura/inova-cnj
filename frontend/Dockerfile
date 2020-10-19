# Stage 1
FROM node:12.19.0-alpine3.12 as node

#ENV HTTP_PROXY=http://192.168.251.227:8080
#ENV HTTPS_PROXY=http://192.168.251.227:8080
#ENV NO_PROXY=*.tjpe.gov.br,*.tjpe.jus.br,localhost

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm i npm@latest -g
RUN npm install
COPY . .
RUN npm install -g @angular/cli@^10.0.6
RUN ng build --configuration production --output-path=/dist

# Stage 2
FROM nginx:1.19.2-alpine

COPY --from=node /dist /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf