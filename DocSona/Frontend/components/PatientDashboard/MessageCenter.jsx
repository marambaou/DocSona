import React, { useState, useEffect } from 'react';
import { FiSend, FiUser, FiMessageSquare, FiClock, FiLoader } from 'react-icons/fi';
import { messageAPI } from '../../services/api';

const MessageCenter = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.doctor._id);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await messageAPI.getConversations();
      setConversations(response.conversations || []);
      
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (doctorId) => {
    try {
      setError(null);
      
      const response = await messageAPI.getConversation(doctorId);
      setMessages(response.messages || []);
      
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages');
    }
  };

  const createSampleMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await messageAPI.createSample();
      await loadConversations();
      
    } catch (err) {
      console.error('Error creating sample messages:', err);
      setError('Failed to create sample messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setSending(true);
      setError(null);

      const response = await messageAPI.sendMessage(selectedConversation.doctor._id, {
        content: newMessage.trim()
      });

      // Add the new message to the current conversation
      const newMessageData = {
        _id: response.messageData._id,
        content: newMessage.trim(),
        sender: 'patient',
        createdAt: new Date().toISOString(),
        read: false
      };

      setMessages(prev => [...prev, newMessageData]);
      setNewMessage('');

      // Update the conversation's last message
      setConversations(prev =>
        prev.map(conv =>
          conv.doctor._id === selectedConversation.doctor._id
            ? {
                ...conv,
                lastMessage: newMessage.trim(),
                timestamp: new Date().toISOString()
              }
            : conv
        )
      );

    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FiLoader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800 text-sm mt-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Message Center</h2>
            <p className="text-sm text-gray-500">Communicate with your doctors and clinic</p>
          </div>
          <button
            onClick={createSampleMessages}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
          >
            Create Sample Messages
          </button>
        </div>
      </div>

      {/* Messages Interface */}
      <div className="bg-white rounded-lg shadow-sm border h-96">
        <div className="flex h-full">
          {/* Conversations List */}
          <div className="w-1/3 border-r">
            <div className="p-4 border-b">
              <h3 className="font-medium text-gray-900">Conversations</h3>
            </div>
            <div className="overflow-y-auto h-full">
              {conversations.length > 0 ? (
                conversations.map((conversation) => (
                  <button
                    key={conversation._id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`w-full p-4 text-left border-b hover:bg-gray-50 transition-colors ${
                      selectedConversation?._id === conversation._id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FiUser className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 truncate">
                            {`${conversation.doctor.firstName} ${conversation.doctor.lastName}`}
                            {conversation.unreadCount > 0 && (
                              <span className="ml-2 inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                            )}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(conversation.lastMessage.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {conversation.lastMessage.content}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{conversation.doctor.specialty}</p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center">
                  <FiMessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No conversations yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Conversation Header */}
                <div className="p-4 border-b">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiUser className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {`${selectedConversation.doctor.firstName} ${selectedConversation.doctor.lastName}`}
                      </h3>
                      <p className="text-sm text-gray-500">{selectedConversation.doctor.specialty}</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length > 0 ? (
                    messages.map((message) => (
                      <div
                        key={message._id}
                        className={`flex ${message.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender === 'patient'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'patient' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {formatTimestamp(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FiMessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No messages yet</p>
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      disabled={sending}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      onKeyPress={(e) => e.key === 'Enter' && !sending && handleSendMessage()}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sending}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      {sending ? (
                        <FiLoader className="w-4 h-4 animate-spin" />
                      ) : (
                        <FiSend className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <FiMessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageCenter; 