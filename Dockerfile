FROM node:latest
MAINTAINER Doug Boutwell "doug@dougboutwell.com"

RUN useradd --user-group --create-home archiver
RUN npm install forever -g

USER archiver
ENV HOME=/home/archiver

WORKDIR /home/archiver

COPY ./package.json /home/archiver/package.json
RUN npm install --production

COPY ./archiver/src /home/archiver/src
COPY ./archiver/config /home/archiver/config

CMD forever src/index.js -f
