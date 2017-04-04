FROM quay.io/ivanvanderbyl/docker-nightmare:latest
MAINTAINER "Ivan Vanderbyl <ivan@flood.io>"

EXPOSE 80
ENV PORT 80
ENV DOCKER true

ADD . /workspace
RUN yarn install
