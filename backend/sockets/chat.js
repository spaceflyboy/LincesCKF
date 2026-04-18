/**
 * Socket.IO Chat Handler
 * Real-time chat system with message persistence in MySQL
 */
const MessageModel = require('../models/messageModel');

function initializeChat(io) {
  io.on('connection', (socket) => {
    console.log(`💬 User connected: ${socket.id}`);

    // Send chat history when a user connects
    socket.on('join', async (userData) => {
      try {
        // Store user info on the socket for later use
        socket.userData = userData;
        console.log(`👤 ${userData.name} joined the chat`);

        // Send recent message history to the newly connected user
        const history = await MessageModel.getRecent(50);
        socket.emit('chatHistory', history);
      } catch (error) {
        console.error('Chat join error:', error);
      }
    });

    // Handle incoming chat messages
    socket.on('chatMessage', async (data) => {
      try {
        const { senderId, senderName, message } = data;

        // Validate the message
        if (!message || !message.trim()) return;

        // Save message to database
        const messageId = await MessageModel.create(senderId || null, senderName || 'Guest', message.trim());

        // Create the message object to broadcast
        const chatMessage = {
          id: messageId,
          sender_id: senderId || null,
          sender_name: senderName || 'Guest',
          message: message.trim(),
          created_at: new Date().toISOString(),
        };

        // Broadcast the message to ALL connected clients (including sender)
        io.emit('chatMessage', chatMessage);
      } catch (error) {
        console.error('Chat message error:', error);
      }
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
      console.log(`👋 User disconnected: ${socket.id}`);
    });
  });
}

module.exports = { initializeChat };
