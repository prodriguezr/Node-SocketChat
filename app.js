require('dotenv').config();

const express = require('express');
const Server = require('./src/server/server');

const server = new Server();

server.listen();