import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Send, Smile, Paperclip, ArrowLeft, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api';
import { useApp } from '../context/AppContext';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function Messages() {
  const { user, addToast } = useApp();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [activeMessages, setActiveMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileList, setShowMobileList] = useState(true);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeMessages, isTyping]);

  async function loadConversations() {
    try {
      setLoadingConversations(true);
      const data = await api.messages.conversations();
      setConversations(data);
    } catch (err) {
      addToast('Failed to load conversations');
    } finally {
      setLoadingConversations(false);
    }
  }

  async function handleSelectConversation(conv) {
    setSelectedConversation(conv);
    setShowMobileList(false);
    try {
      setLoadingMessages(true);
      const data = await api.messages.get(conv.id);
      setActiveMessages(data.messages || data || []);
      if (conv.unread > 0) {
        await api.messages.markRead(conv.id);
        setConversations((prev) =>
          prev.map((c) => (c.id === conv.id ? { ...c, unread: 0 } : c))
        );
      }
    } catch (err) {
      addToast('Failed to load messages');
    } finally {
      setLoadingMessages(false);
    }
  }

  async function handleSend() {
    if (!messageInput.trim() || !selectedConversation) return;

    const text = messageInput.trim();
    setMessageInput('');

    const optimisticMessage = {
      id: `msg-${Date.now()}`,
      sender: user?.id,
      text,
      time: 'Just now',
    };

    setActiveMessages((prev) => [...prev, optimisticMessage]);
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedConversation.id
          ? { ...c, lastMessage: text, timestamp: 'Just now' }
          : c
      )
    );

    try {
      await api.messages.send(selectedConversation.id, text);
    } catch (err) {
      addToast('Failed to send message');
      setActiveMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id));
    }

    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 2000);
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleBack = () => {
    setShowMobileList(true);
    setSelectedConversation(null);
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = conversations.reduce((acc, c) => acc + (c.unread || 0), 0);

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-white dark:bg-surface-950 overflow-hidden">
      {/* Left Panel - Conversation List */}
      <div
        className={`
          w-80 border-r border-surface-200 dark:border-surface-800 flex flex-col shrink-0
          ${showMobileList ? 'flex' : 'hidden'}
          md:flex
        `}
      >
        {/* Search */}
        <div className="p-4 border-b border-surface-200 dark:border-surface-800">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400"
            />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface-100 dark:bg-surface-800 rounded-xl text-sm text-surface-900 dark:text-white placeholder-surface-400 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
          </div>
        </div>

        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-surface-900 dark:text-white">
            Messages
          </h2>
          {totalUnread > 0 && (
            <Badge variant="danger">{totalUnread} unread</Badge>
          )}
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {loadingConversations ? (
            <div className="flex items-center justify-center mt-8">
              <Loader2 size={24} className="animate-spin text-primary-500" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <p className="text-center text-sm text-surface-400 mt-8 px-4">
              No conversations found
            </p>
          ) : (
            filteredConversations.map((conv) => {
              const isSelected = selectedConversation?.id === conv.id;
              return (
                <motion.button
                  key={conv.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectConversation(conv)}
                  className={`
                    w-full flex items-start gap-3 p-4 text-left transition-colors cursor-pointer
                    border-l-2
                    ${
                      isSelected
                        ? 'bg-primary-50 dark:bg-primary-500/10 border-l-primary-500'
                        : 'border-l-transparent hover:bg-surface-50 dark:hover:bg-surface-800/50'
                    }
                  `}
                >
                  <Avatar name={conv.user?.name} size="md" online={conv.online} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-semibold text-surface-900 dark:text-white truncate">
                        {conv.user?.name}
                      </span>
                      <span className="text-xs text-surface-400 shrink-0 ml-2">
                        {conv.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-surface-500 dark:text-surface-400 truncate flex-1">
                        {conv.lastMessage}
                      </p>
                      {conv.unread > 0 && (
                        <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })
          )}
        </div>
      </div>

      {/* Center Panel - Active Chat */}
      <div
        className={`
          flex-1 flex flex-col min-w-0
          ${!showMobileList ? 'flex' : 'hidden'}
          md:flex
        `}
      >
        {!selectedConversation ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-4">
              <MessageCircleEmpty />
            </div>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">
              Select a conversation
            </h3>
            <p className="text-sm text-surface-500 dark:text-surface-400 max-w-xs">
              Choose from your existing conversations or start a new one to begin
              messaging.
            </p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-surface-200 dark:border-surface-800">
              <button
                onClick={handleBack}
                className="md:hidden p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              >
                <ArrowLeft size={20} className="text-surface-600 dark:text-surface-300" />
              </button>
              <Avatar
                name={selectedConversation.user?.name}
                size="md"
                online={selectedConversation.online}
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-surface-900 dark:text-white truncate">
                  {selectedConversation.user?.name}
                </h3>
                <p className={`text-xs ${selectedConversation.online ? 'text-emerald-600 dark:text-emerald-400' : 'text-surface-400 dark:text-surface-500'}`}>
                  {selectedConversation.online ? 'Online' : 'Offline'}
                </p>
              </div>
              <Link to={`/app/profile/${selectedConversation.user?.id}`}>
                <Button variant="outline" size="sm" icon={User} className="hidden sm:inline-flex">
                  View Profile
                </Button>
              </Link>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 size={24} className="animate-spin text-primary-500" />
                </div>
              ) : (
                activeMessages.map((msg) => {
                  const isSent = msg.sender === user?.id || msg.senderId === user?.id;
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`
                          max-w-[75%] px-4 py-2.5
                          ${
                            isSent
                              ? 'bg-primary-500 text-white rounded-2xl rounded-br-md'
                              : 'bg-surface-100 dark:bg-surface-800 text-surface-900 dark:text-white rounded-2xl rounded-bl-md'
                          }
                        `}
                      >
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                        <p
                          className={`
                            text-xs mt-1
                            ${isSent ? 'text-primary-100' : 'text-surface-400 dark:text-surface-500'}
                          `}
                        >
                          {msg.time || msg.createdAt}
                        </p>
                      </div>
                    </motion.div>
                  );
                })
              )}

              {/* Typing Indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex justify-start"
                  >
                    <div className="bg-surface-100 dark:bg-surface-800 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-surface-400 dark:bg-surface-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-surface-400 dark:bg-surface-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-surface-400 dark:bg-surface-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-3">
              <div className="flex items-end gap-2">
                <button className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors text-surface-400 hover:text-surface-600 dark:hover:text-surface-300">
                  <Smile size={20} />
                </button>
                <button className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors text-surface-400 hover:text-surface-600 dark:hover:text-surface-300">
                  <Paperclip size={20} />
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-surface-100 dark:bg-surface-800 text-sm text-surface-900 dark:text-white placeholder-surface-400 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={!messageInput.trim()}
                  className="p-2.5 rounded-full bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Right Panel - User Details */}
      {selectedConversation && (
        <div className="hidden lg:flex w-72 border-l border-surface-200 dark:border-surface-800 flex-col shrink-0 overflow-y-auto">
          <div className="p-6 flex flex-col items-center text-center">
            <Avatar
              name={selectedConversation.user?.name}
              size="xl"
              online={selectedConversation.online}
              ring
            />
            <h3 className="text-base font-bold text-surface-900 dark:text-white mt-4">
              {selectedConversation.user?.name}
            </h3>
            <p
              className={`text-xs font-medium mt-1 ${
                selectedConversation.online
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-surface-400 dark:text-surface-500'
              }`}
            >
              {selectedConversation.online ? 'Online' : 'Offline'}
            </p>
            {selectedConversation.user?.bio && (
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-3 leading-relaxed">
                {selectedConversation.user.bio}
              </p>
            )}
          </div>

          <div className="border-t border-surface-200 dark:border-surface-800" />

          {/* Skills They Teach */}
          {selectedConversation.user?.skillsTeach && selectedConversation.user.skillsTeach.length > 0 && (
            <div className="p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-surface-400 dark:text-surface-500 mb-2">
                Skills They Teach
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedConversation.user.skillsTeach.map((skill) => (
                  <Badge key={skill.name || skill} variant="primary">
                    {skill.name || skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Skills They Want to Learn */}
          {selectedConversation.user?.skillsLearn && selectedConversation.user.skillsLearn.length > 0 && (
            <div className="p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-surface-400 dark:text-surface-500 mb-2">
                Skills They Want to Learn
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedConversation.user.skillsLearn.map((skill) => (
                  <Badge key={skill.name || skill} variant="accent">
                    {skill.name || skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-surface-200 dark:border-surface-800" />

          {/* Actions */}
          <div className="p-4 space-y-2">
            <Button
              variant="primary"
              className="w-full"
              onClick={() => addToast('Skill exchange request sent!')}
            >
              Request Skill Exchange
            </Button>
            <Link
              to={`/app/profile/${selectedConversation.user?.id}`}
              className="block"
            >
              <Button variant="outline" className="w-full">
                View Full Profile
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function MessageCircleEmpty() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-surface-300 dark:text-surface-600"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
