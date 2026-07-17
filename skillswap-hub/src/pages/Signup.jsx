import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Camera,
  ArrowLeft,
  ArrowRight,
  Check,
  Sun,
  Moon,
  Plus,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../api';

const stepVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (direction) => ({
    x: direction > 0 ? -200 : 200,
    opacity: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Signup() {
  const { signup, addToast, darkMode, toggleDarkMode } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [teachSkills, setTeachSkills] = useState([]);
  const [learnSkills, setLearnSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const [avatarPreview, setAvatarPreview] = useState(null);

  const [categories, setCategories] = useState(['All']);
  const [allSkills, setAllSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.skills.categories()
      .then((data) => {
        setCategories(['All', ...data.map((c) => c.name || c)]);
      })
      .catch(() => {
        setCategories(['All']);
      });

    api.skills.list()
      .then((data) => {
        setAllSkills(data);
      })
      .catch(() => {
        setAllSkills([]);
      });
  }, []);

  const toggleSkill = (skill, type) => {
    const setter = type === 'teach' ? setTeachSkills : setLearnSkills;
    setter((prev) =>
      prev.find((s) => s.name === skill.name)
        ? prev.filter((s) => s.name !== skill.name)
        : [...prev, skill]
    );
  };

  const addCustomSkill = (type) => {
    const setter = type === 'teach' ? setTeachSkills : setLearnSkills;
    if (customSkill.trim()) {
      setter((prev) => [
        ...prev,
        { name: customSkill.trim(), category: 'Custom' },
      ]);
      setCustomSkill('');
    }
  };

  const removeCustomSkill = (skillName, type) => {
    const setter = type === 'teach' ? setTeachSkills : setLearnSkills;
    setter((prev) => prev.filter((s) => s.name !== skillName));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const filteredSkills =
    activeCategory === 'All'
      ? allSkills
      : allSkills.filter((s) => s.category === activeCategory);

  const goNext = () => {
    setDirection(1);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await signup({
        name,
        email,
        password,
        skillsTeach: teachSkills.map((s) => ({
          name: s.name,
          category: s.category,
          level: s.level || 'Intermediate',
        })),
        skillsLearn: learnSkills.map((s) => ({
          name: s.name,
          category: s.category,
          goal: s.goal || '',
        })),
      });
      addToast('Account created successfully!');
      navigate('/app');
    } catch (error) {
      addToast(error.message || 'Signup failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-surface-50 dark:bg-surface-950">
      {/* Left Panel – branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Ccircle%20cx%3D%221%22%20cy%3D%221%22%20r%3D%221%22%20fill%3D%22rgba(255%2C255%2C255%2C0.06)%22%2F%3E%3C%2Fsvg%3E')] opacity-40" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-md text-center text-white"
        >
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-8">
            <Zap size={32} className="text-white" />
          </div>

          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Start your <br /> skill exchange journey
          </h1>
          <p className="text-white/80 text-lg leading-relaxed mb-10">
            Create an account, list your skills, and connect with learners & teachers around the world.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { label: 'Active Users', value: '10K+' },
              { label: 'Skills', value: '5K+' },
              { label: 'Exchanges', value: '25K+' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/10 backdrop-blur-sm rounded-xl py-3 px-2"
              >
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-white/70 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-left">
            <p className="text-sm text-white/80 italic leading-relaxed">
              &ldquo;SkillSwap Hub helped me land my first freelance client by connecting me with a
              marketing pro who taught me SEO — all for free.&rdquo;
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                AC
              </div>
              <div>
                <p className="text-sm font-medium">Alex Chen</p>
                <p className="text-xs text-white/60">UI/UX Designer</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Panel – form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 relative">
        {/* Dark-mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="absolute top-5 right-5 p-2 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="w-full max-w-lg">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">SkillSwap Hub</span>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-surface-900 dark:text-white">
              Create your account
            </h2>
            <p className="text-surface-500 dark:text-surface-400 mt-1 text-sm">
              Step {step} of 3
            </p>
          </div>

          {/* Progress bar */}
          <div className="flex gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                  s <= step
                    ? 'bg-primary-500'
                    : 'bg-surface-200 dark:bg-surface-800'
                }`}
              />
            ))}
          </div>

          {/* Step content */}
          <div className="relative min-h-[420px]">
            <AnimatePresence mode="wait" custom={direction}>
              {step === 1 && (
                <motion.div
                  key="step1"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="space-y-5"
                >
                  {/* Profile photo */}
                  <div className="flex items-center gap-5 mb-2">
                    <label className="relative cursor-pointer group">
                      <div className="w-20 h-20 rounded-full border-2 border-dashed border-surface-300 dark:border-surface-600 flex flex-col items-center justify-center overflow-hidden group-hover:border-primary-500 transition-colors">
                        {avatarPreview ? (
                          <img
                            src={avatarPreview}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <>
                            <Camera size={20} className="text-surface-400 dark:text-surface-500 mb-1" />
                            <span className="text-[10px] text-surface-400 dark:text-surface-500">
                              Upload
                            </span>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </label>
                    <div>
                      <p className="text-sm font-medium text-surface-900 dark:text-white">
                        Profile Photo
                      </p>
                      <p className="text-xs text-surface-500 dark:text-surface-400">
                        Optional — you can add this later
                      </p>
                    </div>
                  </div>

                  {/* Full name */}
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                      Full name
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Doe"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 text-sm transition"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                      Email
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jane@example.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 text-sm transition"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a strong password"
                        className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 text-sm transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={goNext}
                    className="w-full py-2.5 rounded-xl bg-primary-500 text-white font-medium text-sm hover:bg-primary-600 transition-colors flex items-center justify-center gap-2 mt-4"
                  >
                    Next
                    <ArrowRight size={16} />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="space-y-5"
                >
                  <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                    What can you teach?
                  </h3>
                  <p className="text-sm text-surface-500 dark:text-surface-400 -mt-3">
                    Select at least one skill you can share with others.
                  </p>

                  {/* Category filter */}
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          activeCategory === cat
                            ? 'bg-primary-500 text-white'
                            : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Skill chips */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto pr-1">
                    {filteredSkills.map((skill) => {
                      const selected = teachSkills.find((s) => s.name === skill.name);
                      return (
                        <button
                          key={skill.name}
                          onClick={() => toggleSkill(skill, 'teach')}
                          className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-all border ${
                            selected
                              ? 'bg-primary-50 border-primary-500 text-primary-700 dark:bg-primary-500/10 dark:border-primary-500 dark:text-primary-400'
                              : 'bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 hover:border-primary-300 dark:hover:border-primary-600'
                          }`}
                        >
                          {skill.name}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom skill */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customSkill}
                      onChange={(e) => setCustomSkill(e.target.value)}
                      placeholder="Add custom skill"
                      onKeyDown={(e) => e.key === 'Enter' && addCustomSkill('teach')}
                      className="flex-1 px-3 py-2 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-900 dark:text-white placeholder-surface-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                    />
                    <button
                      onClick={() => addCustomSkill('teach')}
                      className="px-3 py-2 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Selected custom skills */}
                  {teachSkills.filter((s) => s.category === 'Custom').length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {teachSkills
                        .filter((s) => s.category === 'Custom')
                        .map((skill) => (
                          <span
                            key={skill.name}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 text-xs font-medium"
                          >
                            {skill.name}
                            <button
                              onClick={() => removeCustomSkill(skill.name, 'teach')}
                              className="hover:text-primary-900 dark:hover:text-primary-200"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                    </div>
                  )}

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={goBack}
                      className="flex-1 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 font-medium text-sm hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <ArrowLeft size={16} />
                      Back
                    </button>
                    <button
                      onClick={goNext}
                      className="flex-1 py-2.5 rounded-xl bg-primary-500 text-white font-medium text-sm hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
                    >
                      Next
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="space-y-5"
                >
                  <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                    What do you want to learn?
                  </h3>
                  <p className="text-sm text-surface-500 dark:text-surface-400 -mt-3">
                    Pick the skills you&apos;re eager to develop.
                  </p>

                  {/* Category filter */}
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          activeCategory === cat
                            ? 'bg-primary-500 text-white'
                            : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Skill chips */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto pr-1">
                    {filteredSkills.map((skill) => {
                      const selected = learnSkills.find((s) => s.name === skill.name);
                      return (
                        <button
                          key={skill.name}
                          onClick={() => toggleSkill(skill, 'learn')}
                          className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-all border ${
                            selected
                              ? 'bg-primary-50 border-primary-500 text-primary-700 dark:bg-primary-500/10 dark:border-primary-500 dark:text-primary-400'
                              : 'bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 hover:border-primary-300 dark:hover:border-primary-600'
                          }`}
                        >
                          {skill.name}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom skill */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customSkill}
                      onChange={(e) => setCustomSkill(e.target.value)}
                      placeholder="Add custom skill"
                      onKeyDown={(e) => e.key === 'Enter' && addCustomSkill('learn')}
                      className="flex-1 px-3 py-2 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-900 dark:text-white placeholder-surface-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                    />
                    <button
                      onClick={() => addCustomSkill('learn')}
                      className="px-3 py-2 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Selected custom skills */}
                  {learnSkills.filter((s) => s.category === 'Custom').length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {learnSkills
                        .filter((s) => s.category === 'Custom')
                        .map((skill) => (
                          <span
                            key={skill.name}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 text-xs font-medium"
                          >
                            {skill.name}
                            <button
                              onClick={() => removeCustomSkill(skill.name, 'learn')}
                              className="hover:text-primary-900 dark:hover:text-primary-200"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                    </div>
                  )}

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={goBack}
                      className="flex-1 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 font-medium text-sm hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <ArrowLeft size={16} />
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 py-2.5 rounded-xl bg-primary-500 text-white font-medium text-sm hover:bg-primary-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Creating account...
                        </>
                      ) : (
                        <>
                          <Check size={16} />
                          Create Account
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer link */}
          <p className="text-center text-sm text-surface-500 dark:text-surface-400 mt-8">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 dark:text-primary-400 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
