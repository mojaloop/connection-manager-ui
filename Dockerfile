FROM ubuntu:22.04

# Install basic dependencies
RUN apt-get update && apt-get install -y \
    curl \
    python2 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Install nvm
ENV NVM_DIR=/root/.nvm
ENV NODE_VERSION=14.21.3

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

# Add node and npm to path so the commands are available
ENV NODE_PATH=$NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH=$NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# First part, build the app
WORKDIR /app
COPY package.json package-lock.json /app/

ENV NODE_ENV=development
ENV SKIP_PREFLIGHT_CHECK=true

RUN npm config set python python2
RUN python2 --version
RUN npm install --legacy-peer-deps --force
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
# ENV NODE_ENV=production
ENV PUBLIC_URL=.
ENV GENERATE_SOURCEMAP=false

# Build the React app using npm
RUN npm run build --verbose

# Second part, copy the build and server the app using a node express server
RUN cp -r /app/build /app/server/

WORKDIR /app/server
RUN npm install

# Expose port 8080
EXPOSE 8080

CMD [ "npm", "start" ]
