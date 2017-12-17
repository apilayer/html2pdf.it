FROM node:9

RUN apt-get update -y

RUN  apt-get install build-essential chrpath libssl-dev libxft-dev
RUN  apt-get install libfreetype6 libfreetype6-dev libfontconfig1 libfontconfig1-dev


run npm install phantomjs

RUN mkdir -p  /app
WORKDIR /app
COPY package.json /app/
RUN npm install
COPY . /app/
EXPOSE 8080
CMD [ "npm", "start" ]

