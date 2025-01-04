FROM node:22.7.0-alpine

RUN npm install -g turbo@2.1.3

COPY package.json /home/node/project/
COPY package-lock.json /home/node/project/
COPY ./apps/admin/package.json /home/node/project/apps/admin/
COPY ./apps/client/package.json /home/node/project/apps/client/
COPY ./apps/auth/package.json /home/node/project/apps/auth/
COPY ./apps/showcase/package.json /home/node/project/apps/showcase/
COPY ./apps/storybook/package.json /home/node/project/apps/storybook/
COPY ./apps/documentation/package.json /home/node/project/apps/documentation/
COPY ./packages/ /home/node/project/packages/

WORKDIR /home/node/project
RUN mkdir node_modules
RUN npm ci --no-audit --include=dev --include=peer

COPY . .
