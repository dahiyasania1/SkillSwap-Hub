import { useState, useEffect } from 'react';
import { Star, Users, Pencil, Trash2, Plus, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../api';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import ProgressBar from '../components/ui/ProgressBar';

const skillCategories = ['Technology', 'Design', 'Business', 'Music', 'Language', 'Art', 'Fitness', 'Culinary'];

const levelColors = {
  Expert: 'bg-purple-100 text-purple-700',
  Advanced: 'bg-blue-100 text-blue-700',
  Intermediate: 'bg-green-100 text-green-700',
  Beginner: 'bg-gray-100 text-gray-700',
};

const categoryBorderColors = {
  Technology: 'border-l-blue-500',
  Design: 'border-l-pink-500',
  Business: 'border-l-amber-500',
  Music: 'border-l-purple-500',
  Language: 'border-l-teal-500',
  Art: 'border-l-rose-500',
  Fitness: 'border-l-green-500',
  Culinary: 'border-l-orange-500',
};

const availabilityOptions = ['Weekday mornings', 'Weekday evenings', 'Weekends', 'Flexible'];

export default function MySkills() {
  const { user, addToast } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('teach');
  const [skillsTeach, setSkillsTeach] = useState([]);
  const [skillsLearn, setSkillsLearn] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [teachOrLearn, setTeachOrLearn] = useState('teach');
  const [formData, setFormData] = useState({
    skillName: '',
    category: 'Technology',
    level: 'Intermediate',
    description: '',
    availability: 'Flexible',
    learningGoal: '',
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const data = await api.skills.my();
      setSkillsTeach(data.teach || []);
      setSkillsLearn(data.learn || []);
    } catch (err) {
      addToast(err.message || 'Failed to load skills', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.skillName.trim()) {
      addToast('Please enter a skill name', 'error');
      return;
    }

    const payload = {
      name: formData.skillName.trim(),
      category: formData.category,
      level: formData.level,
      description: formData.description,
      availability: formData.availability,
    };

    if (teachOrLearn === 'learn') {
      payload.learningGoal = formData.learningGoal;
    }

    try {
      setSubmitting(true);
      if (teachOrLearn === 'teach') {
        await api.skills.addTeach(payload);
      } else {
        await api.skills.addLearn(payload);
      }
      addToast('Skill added successfully!');
      setIsModalOpen(false);
      setFormData({
        skillName: '',
        category: 'Technology',
        level: 'Intermediate',
        description: '',
        availability: 'Flexible',
        learningGoal: '',
      });
      await fetchSkills();
    } catch (err) {
      addToast(err.message || 'Failed to add skill', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, type) => {
    if (deleteConfirmId === id) {
      try {
        if (type === 'teach') {
          await api.skills.deleteTeach(id);
        } else {
          await api.skills.deleteLearn(id);
        }
        setDeleteConfirmId(null);
        addToast('Skill removed');
        await fetchSkills();
      } catch (err) {
        addToast(err.message || 'Failed to remove skill', 'error');
      }
    } else {
      setDeleteConfirmId(id);
      setTimeout(() => setDeleteConfirmId(null), 3000);
    }
  };

  const handleProgressUpdate = async (id, newProgress) => {
    try {
      await api.skills.updateLearnProgress(id, newProgress);
      addToast('Progress updated!');
      await fetchSkills();
    } catch (err) {
      addToast(err.message || 'Failed to update progress', 'error');
    }
  };

  const handleEdit = (skill) => {
    addToast(`Edit mode for ${skill.name} coming soon`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Skills</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Manage the skills you teach and want to learn
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="mt-4 sm:mt-0" disabled={loading}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Skill
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('teach')}
            className={`relative py-3 px-1 text-sm font-medium transition-colors ${
              activeTab === 'teach'
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Skills I Teach ({skillsTeach.length})
            {activeTab === 'teach' && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('learn')}
            className={`relative py-3 px-1 text-sm font-medium transition-colors ${
              activeTab === 'learn'
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Skills I Want to Learn ({skillsLearn.length})
            {activeTab === 'learn' && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      )}

      {/* Tab Content */}
      {!loading && (
        <AnimatePresence mode="wait">
          {activeTab === 'teach' ? (
            <motion.div
              key="teach"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {skillsTeach.length === 0 ? (
                <Card className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                    You haven't added any skills to teach yet.
                  </p>
                  <Button onClick={() => setIsModalOpen(true)} className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Skill
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {skillsTeach.map((skill) => (
                      <motion.div
                        key={skill.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                      >
                        <Card
                          className={`border-l-4 ${
                            categoryBorderColors[skill.category] || 'border-l-gray-300'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {skill.name}
                            </h3>
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handleEdit(skill)}
                                className="p-1.5 text-gray-400 hover:text-primary-500 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(skill.id, 'teach')}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  deleteConfirmId === skill.id
                                    ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                                    : 'text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {deleteConfirmId === skill.id && (
                            <p className="text-sm text-red-500 mb-2">Are you sure? Click again to confirm.</p>
                          )}

                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge className={levelColors[skill.level]}>{skill.level}</Badge>
                            <Badge>{skill.category}</Badge>
                          </div>

                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {skill.experience || '1 years'}
                          </p>

                          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {skill.learnersHelped || 0} learners
                            </div>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 mr-1 text-amber-400" />
                              {skill.rating || 'New'}
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="learn"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {skillsLearn.length === 0 ? (
                <Card className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                    You haven't added any skills to learn yet.
                  </p>
                  <Button onClick={() => setIsModalOpen(true)} className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Skill
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {skillsLearn.map((skill) => (
                      <motion.div
                        key={skill.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                      >
                        <Card>
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {skill.name}
                            </h3>
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handleDelete(skill.id, 'learn')}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  deleteConfirmId === skill.id
                                    ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                                    : 'text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {deleteConfirmId === skill.id && (
                            <p className="text-sm text-red-500 mb-2">Are you sure? Click again to confirm.</p>
                          )}

                          <div className="mb-3">
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                              <span>Progress</span>
                              <span>{skill.progress || 0}%</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <ProgressBar value={skill.progress || 0} className="flex-1" />
                              <select
                                value={skill.progress || 0}
                                onChange={(e) => handleProgressUpdate(skill.id, Number(e.target.value))}
                                className="text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-1 py-0.5"
                              >
                                {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((v) => (
                                  <option key={v} value={v}>{v}%</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {skill.learningGoal && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              Goal: {skill.learningGoal}
                            </p>
                          )}

                          <Button
                            variant="secondary"
                            className="w-full"
                            onClick={() => navigate('/app/explore')}
                          >
                            Find Mentors
                          </Button>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Add Skill Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Skill</h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              I want to
            </label>
            <div className="flex space-x-4">
              <button
                onClick={() => setTeachOrLearn('teach')}
                className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                  teachOrLearn === 'teach'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                }`}
              >
                Teach this skill
              </button>
              <button
                onClick={() => setTeachOrLearn('learn')}
                className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                  teachOrLearn === 'learn'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                }`}
              >
                Learn this skill
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Skill Name
              </label>
              <input
                type="text"
                name="skillName"
                value={formData.skillName}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g. React, Python, Guitar"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {skillCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Proficiency Level
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Brief description of your experience or goals"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Availability
              </label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {availabilityOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {teachOrLearn === 'learn' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Learning Goal
                </label>
                <input
                  type="text"
                  name="learningGoal"
                  value={formData.learningGoal}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g. Build a portfolio project"
                />
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Adding...' : 'Add Skill'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
