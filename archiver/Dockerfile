FROM node:latest
MAINTAINER Doug Boutwell "doug@dougboutwell.com"

# Use the prebuilt user from node image
USER node
ENV NODE_ENV=production

RUN mkdir /home/node/archiver
WORKDIR /home/node/archiver

# Install deps
COPY ./package.json /home/node/archiver/package.json
RUN ["npm", "install", "--production"]
COPY ./src /home/node/archiver/src
COPY ./config /home/node/archiver/config

# Keep server alive with forever
CMD ["node", "src/index.js"]
