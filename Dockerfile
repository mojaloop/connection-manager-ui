FROM node:14-alpine

# First part, build the app
WORKDIR /app
COPY package.json /app/
COPY package-lock.json /app/

# Install dependencies using npm
RUN npm install

# Copy the rest of the application files
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

# Build the React app using npm
RUN npm run build

# Second part, copy the build and serve the app using a node express server
RUN cp -r /app/build /app/server/

WORKDIR /app/server
RUN npm install

# Expose port 8080
EXPOSE 8080

# Start the app using npm
CMD ["npm", "start"]
