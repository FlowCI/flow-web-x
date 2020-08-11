#!/bin/sh
# Used as default CMD in docker

# change server url
for entry in ${SOURCE_DIR}/js/*.js
do
  sed -e "s#\"http://replace:me\"#\"${FLOWCI_SERVER_URL}\"#g" "${entry}" > "${entry}".replaced
done

# copy to caddy work folder
cp -r ${SOURCE_DIR}/. ${CADDY_DIR}

# write back to .js from .js.replaced
for entry in ${CADDY_DIR}/js/*.replaced
do
  name=${entry%.replaced}
  mv ${entry} ${name}
done

caddy run -config /etc/caddy/Caddyfile
