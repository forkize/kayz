# README #

### How to start ###

```javascript
npm install
npm start
```

### Basic source guideline ###

* **src/app/** - Front end.
* **src/server/** - Back end.

### How to start project in docker container ###

```javascript
// build mongo image
$ docker build -t forkize/kayz-mongo -f MongoDockerfile .
// run mongo container
$ docker run -p 27016:27017 -d forkize/kayz-mongo
$ docker ps 
// copy mongo container id
// ssh into container
$ docker exec -ti <container-id> /bin/bash
// create kaydz database 
# mongo
> use kaydz
# exit
// change server config file
$ vim src/server/config/config.js
  'mongodb://localhost/kaydz' -> 'mongodb://172.17.0.2/kaydz'
// build project image
$ docker build -t forkize/kayz . 
// run project container
$ docker run -p 5000:5000 -d forkize/kayz
```

### How to update container after changing code ###

```javascript
// update project image
$ docker build -t forkize/kayz .
// copy project container id 
$ docker ps
// stop the container
$ docker stop <container-id>
// remove the contaienr
$ docker rm <container-id>
// start new container
$ docker run -p 5000:5000 -d forkize/kayz
```

View container logs 

```javascript
$ docker logs <container-id>
```

