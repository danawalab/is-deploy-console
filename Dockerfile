FROM node:16

RUN apt-get update && apt-get install -y yarn

WORKDIR /home/is-deploy-console

COPY package.json ./

RUN yarn

COPY ./ ./

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]