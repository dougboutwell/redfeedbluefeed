FROM node:latest
MAINTAINER Doug Boutwell "doug@dougboutwell.com"

# Install forever globally while we're still root
RUN npm install forever -g

# Use the prebuilt user from node image
USER node
ENV NODE_ENV=production

RUN mkdir /home/node/archiver
WORKDIR /home/node/archiver

# Install deps
COPY ./package.json /home/node/archiver/package.json
RUN ["npm", "install", "--production"]
COPY ./src /home/node/archiver/src

# Keep server alive with forever
CMD ["forever", "-f", "src/index.js"]
