FROM node

RUN apt update && apt install -y yarn

WORKDIR /home/is-deploy-console

COPY . .

RUN yarn

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]