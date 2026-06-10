#!/bin/sh

ROOT_DIR=/usr/share/nginx/html

# Replace env vars in JavaScript files
echo "Replacing env constants in JS"
for file in $ROOT_DIR/*.js*
do
  echo "Processing $file ...";

  sed -i 's|VAR_APP_URL|'${VAR_APP_URL}'|g' $file
  sed -i 's|VAR_APP_API_URL|'${VAR_APP_API_URL}'|g' $file
  sed -i 's|VAR_KEYCLOAK_URL|'${VAR_KEYCLOAK_URL}'|g' $file
  sed -i 's|VAR_KEYCLOAK_REALM|'${VAR_KEYCLOAK_REALM}'|g' $file
  sed -i 's|VAR_KEYCLOAK_CLIENT_ID|'${VAR_KEYCLOAK_CLIENT_ID}'|g' $file
  sed -i 's|VAR_INACTIVITY_DURATION|'${VAR_INACTIVITY_DURATION}'|g' $file

done

echo "Starting Nginx"
nginx -g 'daemon off;'
