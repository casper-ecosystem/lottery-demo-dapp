FROM node:18-alpine as builder
RUN mkdir /lottery-demo-app
WORKDIR /lottery-demo-app
COPY . /lottery-demo-app
RUN npm install
#RUN npm i serve -g

#EXPOSE 3030
#ENV NODE_ENV=dev REACT_APP_API_URL=https://url 

CMD [ "npm", "start" ]