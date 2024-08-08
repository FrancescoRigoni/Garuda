ARG NODE_VERSION=22.4.1

FROM node:${NODE_VERSION}-alpine AS garuda-api

WORKDIR /usr/src/app

COPY src/package*.json ./

RUN npm ci
RUN npm install -g nodemon

# Run the application as a non-root user.
USER node

# Expose the port that the application listens on.
EXPOSE 3000

# Start the app using nodemon
CMD ["nodemon", "index.js"]
