FROM abiosoft/caddy:1.0.3

ENV CADDY_DIR=/srv
ENV SOURCE_DIR=/www/flow-web-x
ENV FLOWCI_SERVER_URL=http://127.0.0.1:8080

RUN mkdir -p $SOURCE_DIR
RUN echo "root /srv" >> /etc/Caddyfile

COPY dist $SOURCE_DIR
COPY start_caddy.sh $SOURCE_DIR

WORKDIR $SOURCE_DIR

ENTRYPOINT ./start_caddy.sh
