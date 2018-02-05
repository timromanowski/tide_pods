FROM node:latest
MAINTAINER timromanowski
# Set environment variables
ENV appDir /var/www/app/current
# Prepare app directory
RUN mkdir -p ${appDir}
ADD . ${appDir}
WORKDIR ${appDir}
RUN npm install --production
CMD npm start
