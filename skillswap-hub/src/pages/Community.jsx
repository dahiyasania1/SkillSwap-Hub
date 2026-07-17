import { useState, useEffect } from 'react';
import {
  Globe, HelpCircle, TrendingUp, Lightbulb, Rocket,
  Heart, MessageCircle, Share2, Send, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { api } from '../api';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';

const postTypeConfig = {
  question: { label: 'Question', icon: HelpCircle, variant: 'primary' },
  update: { label: 'Learning Update', icon: TrendingUp, variant: 'success' },
  tip: { label: 'Skill Tip', icon: Lightbulb, variant: 'warning' },
  showcase: { label: 'Project Showcase', icon: Rocket, variant: 'accent' },
};

const filterTabs = [
  { key: 'all', label: 'All Posts', icon: Globe },
  { key: 'question', label: 'Questions', icon: HelpCircle },
  { key: 'update', label: 'Learning Updates', icon: TrendingUp },
  { key: 'tip', label: 'Skill Tips', icon: Lightbulb },
  { key: 'showcase', label: 'Project Showcases', icon: Rocket },
];

const trendingTopics = [
  '#PythonTips', '#DesignInspiration', '#LearningJourney', '#ReactJS', '#PublicSpeaking'
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: 'easeOut' },
  }),
};

export default function Community() {
  const { user, addToast } = useApp();
  const [activeFilter, setActiveFilter] = useState('all');
  const [localPosts, setLocalPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [showComments, setShowComments] = useState(new Set());
  const [postComments, setPostComments] = useState({});
  const [loadingComments, setLoadingComments] = useState(new Set());
  const [newCommentText, setNewCommentText] = useState('');
  const [expandedContent, setExpandedContent] = useState(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostType, setNewPostType] = useState('question');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTags, setNewPostTags] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      setLoading(true);
      const data = await api.community.posts();
      setLocalPosts(Array.isArray(data) ? data : data.posts || []);
    } catch (err) {
      console.error('Failed to load posts:', err);
      addToast('Failed to load posts');
    } finally {
      setLoading(false);
    }
  }

  const filteredPosts = activeFilter === 'all'
    ? localPosts
    : localPosts.filter(p => p.type === activeFilter);

  const toggleLike = async (postId) => {
    const wasLiked = likedPosts.has(postId);
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
    try {
      await api.community.toggleLike(postId);
    } catch (err) {
      setLikedPosts(prev => {
        const next = new Set(prev);
        if (wasLiked) next.add(postId);
        else next.delete(postId);
        return next;
      });
      addToast('Failed to update like');
    }
  };

  const toggleComments = async (postId) => {
    const isExpanding = !showComments.has(postId);
    setShowComments(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
    if (isExpanding && !postComments[postId]) {
      setLoadingComments(prev => new Set(prev).add(postId));
      try {
        const data = await api.community.getComments(postId);
        setPostComments(prev => ({ ...prev, [postId]: Array.isArray(data) ? data : data.comments || [] }));
      } catch (err) {
        console.error('Failed to load comments:', err);
        setPostComments(prev => ({ ...prev, [postId]: [] }));
      } finally {
        setLoadingComments(prev => {
          const next = new Set(prev);
          next.delete(postId);
          return next;
        });
      }
    }
  };

  const toggleContent = (postId) => {
    setExpandedContent(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };

  const handlePublish = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      addToast('Please fill in title and content');
      return;
    }
    try {
      const data = {
        type: newPostType,
        title: newPostTitle,
        content: newPostContent,
        tags: newPostTags.split(',').map(t => t.trim()).filter(Boolean),
      };
      await api.community.createPost(data);
      setShowCreateModal(false);
      setNewPostTitle('');
      setNewPostContent('');
      setNewPostTags('');
      addToast('Post published!');
      await fetchPosts();
    } catch (err) {
      console.error('Failed to create post:', err);
      addToast('Failed to create post');
    }
  };

  const handleAddComment = async (postId) => {
    if (!newCommentText.trim()) return;
    try {
      await api.community.addComment(postId, newCommentText);
      setNewCommentText('');
      addToast('Comment added!');
      const data = await api.community.getComments(postId);
      setPostComments(prev => ({ ...prev, [postId]: Array.isArray(data) ? data : data.comments || [] }));
      setLocalPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: (p.comments || 0) + 1 } : p));
    } catch (err) {
      console.error('Failed to add comment:', err);
      addToast('Failed to add comment');
    }
  };

  const getLikeCount = (post) => {
    return likedPosts.has(post.id) ? (post.likes || 0) + 1 : (post.likes || 0);
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Community</h1>
            <p className="text-surface-500 dark:text-surface-400 mt-1">Share, learn, and grow together</p>
          </div>
          <Button variant="primary" icon={Plus} onClick={() => setShowCreateModal(true)}>
            Create Post
          </Button>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          className="mb-6 flex gap-2 overflow-x-auto pb-2"
        >
          {filterTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                  whitespace-nowrap transition-all duration-200 cursor-pointer
                  ${isActive
                    ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/25'
                    : 'bg-white dark:bg-surface-900 text-surface-600 dark:text-surface-400 border border-surface-200 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800'
                  }
                `}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </motion.div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-4">
            {/* Create Post Card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.35 }}
            >
              <Card padding="sm">
                <div className="flex items-center gap-3">
                   <Avatar name={user?.name || 'U'} size="md" />
                   <button
                     onClick={() => setShowCreateModal(true)}
                     className="flex-1 text-left px-4 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700 text-surface-400 dark:text-surface-500 text-sm hover:border-surface-300 dark:hover:border-surface-600 transition-colors cursor-pointer"
                  >
                    Share something with the community...
                  </button>
                </div>
              </Card>
            </motion.div>

            {/* Loading */}
            {loading && (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* Posts */}
            <AnimatePresence>
              {!loading && filteredPosts.map((post, i) => {
                const typeConf = postTypeConfig[post.type] || postTypeConfig.question;
                const TypeIcon = typeConf.icon;
                const isLiked = likedPosts.has(post.id);
                const showCommentSection = showComments.has(post.id);
                const isExpanded = expandedContent.has(post.id);
                const comments = postComments[post.id] || [];
                const isLoadingComments = loadingComments.has(post.id);

                return (
                  <motion.div
                    key={post.id}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -10 }}
                    variants={fadeUp}
                    layout
                  >
                    <Card hover className="transition-shadow hover:shadow-md">
                      {/* Author */}
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar
                          name={post.author?.name || 'User'}
                          size="md"
                          online={post.author?.online}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-surface-900 dark:text-white">
                            {post.author?.name || 'User'}
                          </div>
                          <div className="text-xs text-surface-500 dark:text-surface-400 flex items-center gap-1.5">
                            {post.author?.location || 'Member'}
                            <span className="text-surface-300 dark:text-surface-600">·</span>
                            {post.timestamp}
                          </div>
                        </div>
                        <Badge variant={typeConf.variant} className="gap-1">
                          <TypeIcon size={12} />
                          {typeConf.label}
                        </Badge>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
                        {post.title}
                      </h3>

                      {/* Content */}
                      <p className={`text-surface-600 dark:text-surface-300 text-sm leading-relaxed mb-3 ${!isExpanded ? 'line-clamp-3' : ''}`}>
                        {post.content}
                      </p>
                      {(post.content || '').length > 200 && (
                        <button
                          onClick={() => toggleContent(post.id)}
                          className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline mb-3 cursor-pointer"
                        >
                          {isExpanded ? 'Show less' : 'Read more'}
                        </button>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {(post.tags || []).map((tag) => (
                          <Badge key={tag} variant="default" className="text-[11px]">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Engagement Bar */}
                      <div className="flex items-center gap-1 pt-3 border-t border-surface-100 dark:border-surface-800">
                        <button
                          onClick={() => toggleLike(post.id)}
                          className={`
                            flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
                            transition-colors cursor-pointer
                            ${isLiked
                              ? 'text-red-500 bg-red-50 dark:bg-red-500/10'
                              : 'text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
                            }
                          `}
                        >
                          <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
                          <span>{getLikeCount(post)}</span>
                        </button>

                        <button
                          onClick={() => toggleComments(post.id)}
                          className={`
                            flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
                            transition-colors cursor-pointer
                            ${showCommentSection
                              ? 'text-primary-500 bg-primary-50 dark:bg-primary-500/10'
                              : 'text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
                            }
                          `}
                        >
                          <MessageCircle size={16} />
                          <span>{post.comments || 0}</span>
                        </button>

                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer">
                          <Share2 size={16} />
                          <span>Share</span>
                        </button>
                      </div>

                      {/* Comments Section */}
                      <AnimatePresence>
                        {showCommentSection && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-3 mt-3 border-t border-surface-100 dark:border-surface-800 space-y-3">
                              {isLoadingComments && (
                                <div className="flex justify-center py-4">
                                  <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                                </div>
                              )}
                              {!isLoadingComments && comments.map((comment) => (
                                <div key={comment.id} className="flex items-start gap-2.5">
                                  <Avatar name={comment.author?.name || 'User'} size="sm" />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium text-surface-900 dark:text-white">
                                        {comment.author?.name || 'User'}
                                      </span>
                                      <span className="text-xs text-surface-400 dark:text-surface-500">
                                        {comment.timestamp}
                                      </span>
                                    </div>
                                    <p className="text-sm text-surface-600 dark:text-surface-300 mt-0.5">
                                      {comment.text}
                                    </p>
                                  </div>
                                </div>
                              ))}

                              {/* Comment Input */}
                              <div className="flex items-center gap-2 pt-2">
                                <Avatar name={user?.name || 'U'} size="sm" />
                                <div className="flex-1 flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={newCommentText}
                                    onChange={(e) => setNewCommentText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                                    placeholder="Write a comment..."
                                    className="flex-1 px-3 py-1.5 text-sm rounded-lg bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-colors"
                                  />
                                  <button
                                    onClick={() => handleAddComment(post.id)}
                                    disabled={!newCommentText.trim()}
                                    className="p-1.5 rounded-lg text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                  >
                                    <Send size={16} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {!loading && filteredPosts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <p className="text-surface-500 dark:text-surface-400">No posts in this category yet.</p>
              </motion.div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block space-y-5">
            {/* Trending Topics */}
            <motion.div
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <Card padding="sm">
                <h3 className="font-semibold text-surface-900 dark:text-white mb-3">Trending Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {trendingTopics.map((topic) => (
                    <button
                      key={topic}
                      className="px-3 py-1.5 text-sm font-medium rounded-full bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-500/10 dark:hover:text-primary-400 transition-colors cursor-pointer"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Active Members */}
            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <Card padding="sm">
                <h3 className="font-semibold text-surface-900 dark:text-white mb-3">Active Members</h3>
                <div className="flex items-center gap-2 mb-3">
                  {user && <Avatar name={user.name} size="md" />}
                </div>
                <button className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline cursor-pointer">
                  View All
                </button>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Post"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Post Type</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(postTypeConfig).map(([key, conf]) => {
                const Icon = conf.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setNewPostType(key)}
                    className={`
                      flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
                      transition-colors cursor-pointer
                      ${newPostType === key
                        ? 'bg-primary-500 text-white'
                        : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'
                      }
                    `}
                  >
                    <Icon size={14} />
                    {conf.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Title</label>
            <input
              type="text"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              placeholder="Enter post title..."
              className="w-full px-3 py-2 text-sm rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Content</label>
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Share your thoughts..."
              rows={4}
              className="w-full px-3 py-2 text-sm rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Tags (comma-separated)</label>
            <input
              type="text"
              value={newPostTags}
              onChange={(e) => setNewPostTags(e.target.value)}
              placeholder="e.g. Python, Tips, Beginner"
              className="w-full px-3 py-2 text-sm rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="primary"
              onClick={handlePublish}
              className="flex-1"
            >
              Publish
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
