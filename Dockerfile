FROM node:24.19.0-alpine3.24
# First part, build the app
WORKDIR /app
COPY package.json /app/
COPY yarn.lock /app/
RUN yarn install

COPY ./ /app/

ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

ARG AUTH_ENABLED
ENV AUTH_ENABLED=$AUTH_ENABLED

# Adds the package version and commit hash 

ARG REACT_APP_VERSION
ENV REACT_APP_VERSION=$REACT_APP_VERSION

ARG REACT_APP_COMMIT
ENV REACT_APP_COMMIT=$REACT_APP_COMMIT

RUN yarn run build

# Second part, copy the build and server the app using a node express server

RUN cp -r /app/build /app/server/

# The document the platform composes this service's authorization from, at the
# path a deployment names it by
RUN mkdir -p /opt/app/src && cp -r /app/src/api /opt/app/src/api

WORKDIR /app/server
RUN npm install

EXPOSE 8080

CMD [ "npm", "start" ]
