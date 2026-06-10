FROM nexus.airastana.com:5000/node/20-alpine:latest as build-stage
 
WORKDIR /app
RUN npm config set strict-ssl false
COPY package*.json ./
COPY . .
RUN npm install --force --legacy-peer-deps
RUN npm run build
 
FROM nginx:stable-alpine as production-stage

COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /app/dist/trms-front /usr/share/nginx/html

COPY .docker/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh \
&& mkdir -p /var/cache/nginx/client_temp \
&& chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx
 
EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]

 