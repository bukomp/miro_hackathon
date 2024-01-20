FROM node:20.11.0-alpine
WORKDIR /app
COPY src ./src
COPY package*.json ./
COPY tsconfig.json ./
COPY .env ./
RUN npm install i
RUN npm run build
CMD ["node", "dist/main.js"]