import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Zap,
  Search,
  Sparkles,
  Users,
  Globe,
  BarChart3,
  Star,
  UserPlus,
  ArrowRightLeft,
  Menu,
  X,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Code2,
  MessageSquare,
  Briefcase,
  ExternalLink,
} from 'lucide-react';
import Button from '../components/ui/Button';
import { testimonials, skillCategories } from '../data/mockData';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const floatAnimation = {
  y: [0, -12, 0],
  transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
};

const floatAnimationDelayed = {
  y: [0, -10, 0],
  transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
};

function AnimatedCounter({ target, suffix = '', duration = 2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = parseInt(target.replace(/[^0-9]/g, ''), 10);
    const step = Math.ceil(end / (duration * 60));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setCount(start);
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Testimonials', href: '#testimonials' },
  ];

  const features = [
    {
      icon: Search,
      title: 'Skill Discovery',
      description: 'Find skills that match your interests from our growing community of learners and teachers.',
      color: 'bg-primary-50 text-primary-500',
    },
    {
      icon: Sparkles,
      title: 'Smart Matching',
      description: 'Our algorithm connects you with the perfect skill exchange partners based on your goals.',
      color: 'bg-purple-50 text-purple-500',
    },
    {
      icon: Users,
      title: 'Peer-to-Peer Learning',
      description: 'Learn directly from skilled individuals through one-on-one interactive sessions.',
      color: 'bg-emerald-50 text-emerald-500',
    },
    {
      icon: Globe,
      title: 'Community Networking',
      description: 'Join a vibrant community of learners and teachers from around the world.',
      color: 'bg-amber-50 text-amber-500',
    },
    {
      icon: BarChart3,
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed analytics and meaningful insights.',
      color: 'bg-rose-50 text-rose-500',
    },
    {
      icon: Star,
      title: 'Ratings & Reviews',
      description: 'Quality learning experiences backed by community ratings and honest feedback.',
      color: 'bg-indigo-50 text-indigo-500',
    },
  ];

  const steps = [
    {
      icon: UserPlus,
      title: 'Create Your Profile',
      description: 'Sign up and showcase the skills you can teach and want to learn.',
    },
    {
      icon: Search,
      title: 'Discover & Connect',
      description: 'Browse matched partners and send connection requests.',
    },
    {
      icon: ArrowRightLeft,
      title: 'Learn & Exchange',
      description: 'Schedule sessions and start your skill exchange journey.',
    },
  ];

  const stats = [
    { value: '10', suffix: 'K+', label: 'Learners', icon: Users },
    { value: '5', suffix: 'K+', label: 'Skills', icon: BookOpen },
    { value: '25', suffix: 'K+', label: 'Skill Exchanges', icon: ArrowRightLeft },
    { value: '95', suffix: '%', label: 'Positive Reviews', icon: Star },
  ];

  const heroSkills = [
    { name: 'Python', icon: '🐍', color: 'from-blue-500 to-indigo-600' },
    { name: 'Web Development', icon: '🌐', color: 'from-emerald-500 to-teal-600' },
    { name: 'Graphic Design', icon: '🎨', color: 'from-purple-500 to-pink-600' },
    { name: 'Mathematics', icon: '📐', color: 'from-amber-500 to-orange-600' },
    { name: 'Public Speaking', icon: '🎤', color: 'from-rose-500 to-red-600' },
    { name: 'Digital Marketing', icon: '📈', color: 'from-cyan-500 to-blue-600' },
  ];

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-surface-950/70 border-b border-surface-100 dark:border-surface-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center">
                <Zap size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">SkillSwap Hub</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-surface-600 dark:text-surface-300 hover:text-primary-500 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-surface-600 dark:text-surface-300 hover:text-primary-500 transition-colors px-3 py-2"
              >
                Login
              </Link>
              <Link to="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-surface-100 dark:border-surface-800 bg-white dark:bg-surface-900"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 border-t border-surface-100 dark:border-surface-800 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800"
                >
                  Login
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 lg:pt-32 lg:pb-36">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                <Sparkles size={14} />
                The future of peer-to-peer learning
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-surface-900 dark:text-white leading-tight tracking-tight">
                Learn. Teach.{' '}
                <span className="gradient-text">Connect.</span>{' '}
                Grow Together.
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-surface-600 dark:text-surface-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                SkillSwap Hub connects learners and skilled individuals so everyone can teach what they know and learn what they love.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Explore Skills
                    <ArrowRight size={18} />
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Share Your Skills
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              className="relative hidden lg:block"
            >
              <div className="relative w-full h-[420px]">
                {heroSkills.map((skill, i) => {
                  const positions = [
                    { top: '0%', left: '10%' },
                    { top: '5%', left: '55%' },
                    { top: '35%', left: '0%' },
                    { top: '40%', left: '60%' },
                    { top: '70%', left: '15%' },
                    { top: '65%', left: '50%' },
                  ];
                  return (
                    <motion.div
                      key={skill.name}
                      animate={i % 2 === 0 ? floatAnimation : floatAnimationDelayed}
                      style={positions[i]}
                      className="absolute"
                    >
                      <motion.div
                        variants={scaleIn}
                        initial="hidden"
                        animate="visible"
                        custom={i}
                        className={`bg-gradient-to-br ${skill.color} rounded-2xl px-5 py-3.5 shadow-lg shadow-surface-900/10 flex items-center gap-3 cursor-default`}
                      >
                        <span className="text-2xl">{skill.icon}</span>
                        <span className="text-sm font-semibold text-white whitespace-nowrap">{skill.name}</span>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-white">
              Everything you need to <span className="gradient-text">grow</span>
            </h2>
            <p className="mt-4 text-lg text-surface-600 dark:text-surface-400">
              Powerful features designed to make skill exchange seamless and rewarding.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group bg-white dark:bg-surface-900 rounded-2xl p-7 shadow-sm border border-surface-100 dark:border-surface-800 hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-5`}>
                  <feature.icon size={22} />
                </div>
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-surface-500 dark:text-surface-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-surface-100/50 dark:bg-surface-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-white">
              How SkillSwap Hub <span className="gradient-text">Works</span>
            </h2>
            <p className="mt-4 text-lg text-surface-600 dark:text-surface-400">
              Three simple steps to start your skill exchange journey.
            </p>
          </motion.div>

          <div className="relative">
            <div className="hidden lg:block absolute top-16 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-0.5 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500" />

            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {steps.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  className="relative text-center"
                >
                  <div className="relative inline-flex mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/25">
                      <step.icon size={28} />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-surface-900 dark:bg-white text-white dark:text-surface-900 text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-surface-500 dark:text-surface-400 text-sm leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={scaleIn}
                custom={i}
                className="bg-white dark:bg-surface-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-surface-100 dark:border-surface-800 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
                  <stat.icon size={22} className="text-primary-500" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm text-surface-500 dark:text-surface-400 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 lg:py-28 bg-surface-100/50 dark:bg-surface-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-white">
              What our community <span className="gradient-text">says</span>
            </h2>
            <p className="mt-4 text-lg text-surface-600 dark:text-surface-400">
              Real stories from real learners and teachers.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white dark:bg-surface-900 rounded-2xl p-7 shadow-sm border border-surface-100 dark:border-surface-800 flex flex-col"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star
                      key={si}
                      size={16}
                      className={si < testimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-surface-200 dark:text-surface-700'}
                    />
                  ))}
                </div>
                <p className="text-surface-600 dark:text-surface-300 text-sm leading-relaxed flex-1 mb-6">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-surface-100 dark:border-surface-800">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold">
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-surface-900 dark:text-white">{testimonial.name}</p>
                    <p className="text-xs text-surface-500 dark:text-surface-400">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl p-10 sm:p-16 text-center"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Your next skill is just one connection away.
            </h2>
            <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
              Join thousands of learners and teachers on SkillSwap Hub
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-white/90 shadow-lg w-full sm:w-auto">
                  Start Learning
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto">
                  Become a Mentor
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-900 dark:bg-surface-950 text-surface-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center">
                  <Zap size={20} className="text-white" />
                </div>
                <span className="text-xl font-bold text-white">SkillSwap Hub</span>
              </Link>
              <p className="text-sm leading-relaxed max-w-xs mb-6">
                Empowering people to teach what they know and learn what they love through meaningful peer-to-peer connections.
              </p>
              <div className="flex gap-3">
                {[Code2, MessageSquare, Briefcase, ExternalLink].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-lg bg-surface-800 hover:bg-surface-700 flex items-center justify-center transition-colors"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {[
              {
                title: 'Product',
                links: ['Features', 'Pricing', 'Skill Categories', 'Success Stories'],
              },
              {
                title: 'Community',
                links: ['Blog', 'Forum', 'Events', 'Mentorship'],
              },
              {
                title: 'Company',
                links: ['About', 'Careers', 'Contact', 'Privacy Policy'],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-semibold text-white mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-surface-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-surface-500">
              &copy; {new Date().getFullYear()} SkillSwap Hub. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-xs hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-xs hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-xs hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
