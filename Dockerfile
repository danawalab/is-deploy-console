FROM node:16-slim

WORKDIR /home/is-deploy-console

COPY package.json .

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]