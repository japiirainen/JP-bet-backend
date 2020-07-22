
FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 1998

CMD ["npm", "start"]


