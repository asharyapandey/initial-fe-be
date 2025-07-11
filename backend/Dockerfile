# Use the official Node.js 20 image from the Docker Hub
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install 

COPY . .

EXPOSE 5001

CMD ["npm", "run", "dev"]
