FROM node:6.3.1

########### installing dependencies
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
COPY bower.json /usr/src/app
RUN node --version
RUN npm install -g bower
RUN npm install
RUN npm run postinstall
###########

########### coping project files
COPY . /usr/src/app
###########

#exposing port
EXPOSE 5000

#starting project
CMD [ "npm", "start" ]

