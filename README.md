# Meesage Queue
## Table of contents
* [General info](#general-info)
* [Setup](#setup)

## General info
This project is a simple exercise for creating rabbitmq messaging

## Setup

### How to build
1. Clone the project
`git clone -b messaging https://github.com/hothithanhthao/meesage-queue.git`
2. Navigate for exercise folder
`cd meesage-queue`
3. Run docker-compose
`docker-compose up -d`


### How to test
1. A text file will appear in the project root folder
`data.txt`
2. Do the curl command to localhost
`curl localhost:8080`
3. Stop and remove all containers & images
`docker-compose down --rmi all`