FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

COPY .env .env.production

RUN npm run build

EXPOSE 3000

CMD [ "npm" , "run", "start:prod" ]
