FROM quay.io/ivanvanderbyl/docker-nightmare:latest
MAINTAINER "Ivan Vanderbyl <ivan@flood.io>"

EXPOSE 8080
ENV PORT 8080
ENV DOCKER true

ADD . /workspace
RUN yarn install
