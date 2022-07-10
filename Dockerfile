FROM node:14.15.4 as base

WORKDIR /

COPY package.json package.json
COPY package-lock.json package-lock.json

FROM base as test
COPY . .

ENV PORT=1770
ENV MONGO_URI=mongodb://localhost/devtemplate
ENV MONGO_TEST_URI=mongodb://localhost/testtemplate
ENV COLLECTION_NAME=blogs
ENV USER_COLLECTION_NAME=users
ENV VECTOR=1234567890123456
ENV SECRET_KEY=12345678901234561234567890123456
ENV TOKEN_KEY=topsecret
ENV NEED_AUTH=false

RUN npm install 
RUN [ "npm", "run", "test" ]
RUN [ "npm", "run", "build" ]

FROM base as prod 
WORKDIR /
COPY --from=test /dist ./dist
COPY package*.json ./
RUN npm install --production --silent

WORKDIR /dist

CMD node index.js

EXPOSE 6060