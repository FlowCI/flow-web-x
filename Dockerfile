FROM flowci/flow-web-base:latest

ENV FLOW_WEB_SOURCE=/flow-web
ENV FLOW_WEB_DIR=/var/www/flow-web
ENV FLOW_WEB_API=:FLOWCI:

RUN mkdir -p $FLOW_WEB_DIR

COPY . $FLOW_WEB_SOURCE
COPY ./docker/nginx.conf /etc/nginx/sites-enabled/default
COPY ./docker/flow-web.sh $FLOW_WEB_DIR

WORKDIR $FLOW_WEB_SOURCE

# install yarn
RUN 	yarn config set registry 'https://registry.npm.taobao.org' \
		&& yarn install \
        && npm run build \
        && mkdir -p $FLOW_WEB_DIR \
        && cp -r $FLOW_WEB_SOURCE/dist/* $FLOW_WEB_DIR 


WORKDIR $FLOW_WEB_DIR

CMD bash $FLOW_WEB_DIR/flow-web.sh && nginx -g 'daemon off;'