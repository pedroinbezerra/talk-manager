FROM node:12.13.0-alpine

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

ENV TZ=America/Fortaleza
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY . /data-prod/
WORKDIR /data-prod/

RUN npm install --production

RUN npm run build; 

EXPOSE 3000

CMD ["npm", "start"]