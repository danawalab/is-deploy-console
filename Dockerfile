FROM node:16-alpine

WORKDIR /tmp/is-deploy-console

COPY package.json ./

RUN npm install

COPY ./ ./

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]