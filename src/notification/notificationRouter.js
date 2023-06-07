const express = require('express');
const jwt = require('jsonwebtoken')
const error = require('../helper/error');
const { client } = require('../services/database');
const { getAllNotifications, updateNotification } = require('./notificationController');

const notificationRouter = express.Router()

// Get All Notifications
notificationRouter.get('/', getAllNotifications)

// Update Notification
notificationRouter.put('/:notification_id', updateNotification)

module.exports = notificationRouter