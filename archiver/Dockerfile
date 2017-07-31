FROM node:latest
MAINTAINER Doug Boutwell "doug@dougboutwell.com"

RUN useradd --user-group --create-home archiver
RUN npm install forever -g

USER archiver
ENV HOME=/home/archiver
WORKDIR /home/archiver

COPY ./package.json /home/archiver/package.json
RUN npm install --production
COPY ./src /home/archiver/src
# Keep these out of the image - Mount them as a volume instead
# COPY ./config /home/archiver/config

CMD forever -f src/index.js
