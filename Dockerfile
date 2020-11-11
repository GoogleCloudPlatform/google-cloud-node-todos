FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD [ "npm", "start" ]
