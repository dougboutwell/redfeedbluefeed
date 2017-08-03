FROM node:latest
MAINTAINER Doug Boutwell "doug@dougboutwell.com"

RUN useradd --user-group --create-home app
RUN npm install forever -g

USER app
ENV HOME=/home/app

RUN mkdir /home/app/archiver
WORKDIR /home/app/archiver

COPY ./package.json /home/app/archiver/package.json
RUN npm install --production
COPY ./src /home/app/archiver/src

CMD forever -f src/index.js
