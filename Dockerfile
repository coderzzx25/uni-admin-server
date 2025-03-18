FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY .env .

RUN cp .env .env.production

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm" , 'run', 'start:prod' ]
