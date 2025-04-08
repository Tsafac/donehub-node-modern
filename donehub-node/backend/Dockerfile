FROM node:18-alpine3.20

WORKDIR /app

COPY package*.json ./

RUN npm install express pg cors

COPY server.js ./

CMD ["node", "server.js"]
