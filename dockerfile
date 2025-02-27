FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx tsc

EXPOSE 3001

# Add type: module to package.json
RUN npm pkg set type="module"

CMD ["node", "dist/index.js"]