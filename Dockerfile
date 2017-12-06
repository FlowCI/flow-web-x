FROM node:6.12.1

ENV FLOW_WEB_SOURCE=/flow-web
ENV FLOW_WEB_DIR=/var/www/flow-web
ENV FLOW_WEB_API=:FLOWCI:

RUN apt-get update \
        && apt-get install -y apt-utils  git nginx vim curl \
        && npm install -g yarn

RUN mkdir -p $FLOW_WEB_DIR

COPY . $FLOW_WEB_SOURCE
COPY ./docker/nginx.conf /etc/nginx/sites-enabled/default
COPY ./docker/flow-web.sh $FLOW_WEB_DIR

WORKDIR $FLOW_WEB_SOURCE

# install yarn
RUN yarn install \
        && npm run build \
        && mkdir -p $FLOW_WEB_DIR \
        && cp -r $FLOW_WEB_SOURCE/dist/* $FLOW_WEB_DIR 


WORKDIR $FLOW_WEB_DIR

CMD bash $FLOW_WEB_DIR/flow-web.sh && nginx -g 'daemon off;'