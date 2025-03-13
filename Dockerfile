FROM node:14-alpine3.14

# First part, build the app
WORKDIR /app
COPY package.json /app/

RUN apk add --no-cache python2 make g++

RUN python2 --version
RUN npm install --legacy-peer-deps
COPY ./ /app/


# Set environment variables
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

ARG AUTH_ENABLED
ENV AUTH_ENABLED=$AUTH_ENABLED

# Adds the package version and commit hash
ARG REACT_APP_VERSION
ENV REACT_APP_VERSION=$REACT_APP_VERSION

ARG REACT_APP_COMMIT
ENV REACT_APP_COMMIT=$REACT_APP_COMMIT

# Add NODE_ENV and PUBLIC_URL for better path resolution
ENV NODE_ENV=production
ENV PUBLIC_URL=.

# Build the React app using npm with additional flags
RUN npm run build -- --prefer-relative

# Second part, copy the build and server the app using a node express server
RUN cp -r /app/build /app/server/

WORKDIR /app/server
RUN npm install

# Expose port 8080
EXPOSE 8080

CMD [ "npm", "start" ]
