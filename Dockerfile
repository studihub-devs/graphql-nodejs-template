FROM node:18-alpine as builder
WORKDIR /app
ADD package.json /app/
COPY . /app

RUN npm install --legacy-peer-deps  && npm run build

FROM node:18-alpine
EXPOSE 3000
EXPOSE 4000
WORKDIR /app
COPY package.json package-lock.json /app/

RUN npm install husky -g &&  npm i --force --only=production
COPY --from=builder /app/dist ./dist

CMD node --max-old-space-size=4096 dist/src/server.js
