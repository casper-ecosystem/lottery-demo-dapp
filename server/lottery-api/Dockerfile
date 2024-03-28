FROM node:18-alpine as builder
RUN mkdir -p /lottery-api
WORKDIR /lottery-api
COPY . /lottery-api
RUN npm install
EXPOSE 3030

CMD ["npm", "run", "start"]