FROM node:latest
MAINTAINER Doug Boutwell "doug@dougboutwell.com"

ADD ./archiver /archiver
ADD package.json /archiver/package.json
WORKDIR /archiver
RUN npm i

CMD node index.js
