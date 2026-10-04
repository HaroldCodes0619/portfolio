import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FooterFrame } from './FooterFrame';
import { PrivacyPolicyModal } from './PrivacyPolicyModal';
import { TermsOfServiceModal } from './TermsOfServiceModal';
import { WaveBackgroundCanvas } from './WaveBackgroundCanvas';
import { Toast, ToastMessage } from './Toast';
import { ShareModal } from './ShareModal';

const MySQLIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M16.54 13.06c-.19-.74-.6-1.4-1.18-1.92.51-.43.91-.98 1.16-1.61.26-.63.34-1.32.25-2-.09-.68-.37-1.33-.8-1.87-.43-.54-.99-.97-1.63-1.24-.64-.28-1.34-.39-2.04-.33-.7.06-1.38.3-1.97.7-.59.39-1.07.93-1.4 1.56-.33.63-.5 1.34-.48 2.06.01.37.08.74.21 1.09-.6-.28-1.27-.4-1.93-.33-1.46.15-2.79.89-3.66 2.05-.87 1.16-1.27 2.62-1.1 4.07.17 1.45.89 2.76 2.03 3.63 1.14.87 2.58 1.25 4.01 1.07 1.43-.18 2.72-.91 3.57-2.03.86-1.12 1.22-2.54 1.03-3.95-.04-.34-.14-.68-.28-1 .49.23 1.03.35 1.58.34.71-.01 1.4-.23 1.99-.62.59-.4 1.04-.95 1.31-1.6.27-.65.34-1.37.22-2.07-.12-.7-.44-1.35-.93-1.87z" />
  </svg>
);

const VSCodeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.94-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" />
  </svg>
);

const FirebaseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M3.89 15.672L6.255.992a.56.56 0 0 1 1.054-.153l2.872 5.378-6.29 9.455zm16.486 3.523L18.42 4.148a.56.56 0 0 0-.987-.272L3.584 19.195l7.734 4.364a1.44 1.44 0 0 0 1.365 0l7.693-4.364zM13.623 8.358l-2.095-4.01a.56.56 0 0 0-.994.014L3.992 16.486l9.631-8.128z" />
  </svg>
);

interface TechItem {
  name: string;
  icon?: string;
  renderIcon?: (className: string) => React.ReactNode;
}

const TECH_STACK: TechItem[] = [
  { name: 'HTML5', icon: 'bx bxl-html5' },
  { name: 'CSS3', icon: 'bx bxl-css3' },
  { name: 'JavaScript', icon: 'bx bxl-javascript' },
  {
    name: 'Firebase',
    icon: 'bx bxl-firebase',
    renderIcon: (className) => <FirebaseIcon className={className} />,
  },
  {
    name: 'MySQL',
    icon: 'bx bxs-data',
    renderIcon: (className) => <MySQLIcon className={className} />,
  },
  {
    name: 'VS Code',
    icon: 'bx bxl-visual-studio',
    renderIcon: (className) => <VSCodeIcon className={className} />,
  },
  { name: 'Git', icon: 'bx bxl-git' },
  { name: 'UI / UX', icon: 'bx bxs-paint' },
];

const GLANCE_SKILLS: TechItem[] = [
  { name: 'Python', icon: 'bx bxl-python' },
  { name: 'JavaScript', icon: 'bx bxl-javascript' },
  { name: 'Java', icon: 'bx bxl-java' },
  { name: 'HTML5', icon: 'bx bxl-html5' },
  { name: 'CSS3', icon: 'bx bxl-css3' },
  {
    name: 'Firebase',
    icon: 'bx bxl-firebase',
    renderIcon: (className) => <FirebaseIcon className={className} />,
  },
  {
    name: 'MySQL',
    icon: 'bx bxs-data',
    renderIcon: (className) => <MySQLIcon className={className} />,
  },
  { name: 'Android', icon: 'bx bxl-android' },
  { name: 'Git', icon: 'bx bxl-git' },
  { name: 'UI / UX', icon: 'bx bxs-paint' },
];

const ROLES = [
  'Frontend Developer',
  'HTML / CSS / JavaScript',
  'Mobile & Web Apps',
  'Web Designer',
  'UI / UX Designer',
] as const;

const SECTIONS = ['home', 'about', 'project', 'contact'] as const;
type SectionName = (typeof SECTIONS)[number];

// Motion animation variants for graceful reveal
const smoothEase = [0.22, 1, 0.36, 1] as const;

const sectionTitleVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: smoothEase },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: smoothEase },
  },
};

const imageRevealVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.65, ease: smoothEase },
  },
};

const sectionPanelVariants = {
  initial: {
    opacity: 0,
    y: 16,
    scale: 0.992,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.38,
      ease: smoothEase,
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.995,
    transition: {
      duration: 0.2,
      ease: smoothEase,
    },
  },
};

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionName>('home');
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (title: string, description?: string, icon?: string) => {
    const id = Date.now().toString();
    setToast({ id, title, description, icon });
    setTimeout(() => {
      setToast((cur) => (cur?.id === id ? null : cur));
    }, 2800);
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('salvanaj75@gmail.com');
      showToast('Copied to Clipboard!', 'salvanaj75@gmail.com', 'bx-check');
    } catch {
      showToast('Copy failed', 'salvanaj75@gmail.com', 'bx-error-circle');
    }
  };

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText('+639947982698');
      showToast('Copied to Clipboard!', '+63 994 798 2698', 'bx-check');
    } catch {
      showToast('Copy failed', '+63 994 798 2698', 'bx-error-circle');
    }
  };

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bedimcode-theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Typewriter effect state for cycling through roles
  const [roleIndex, setRoleIndex] = useState(0);
  const [currentRoleText, setCurrentRoleText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullRole = ROLES[roleIndex];
    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (currentRoleText.length < currentFullRole.length) {
        timer = setTimeout(() => {
          setCurrentRoleText(currentFullRole.slice(0, currentRoleText.length + 1));
        }, 100);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 1800);
      }
    } else {
      if (currentRoleText.length > 0) {
        timer = setTimeout(() => {
          setCurrentRoleText(currentFullRole.slice(0, currentRoleText.length - 1));
        }, 50);
      } else {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % ROLES.length);
      }
    }

    return () => clearTimeout(timer);
  }, [currentRoleText, isDeleting, roleIndex]);

  // Form state
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Home profile image is strictly preserved and excluded from about replacements
  const homeBlobImage = `${import.meta.env.BASE_URL}assets/img/perfil.png`;

  // About profile photo state (strictly isolated to the About section only)
  const aboutFileInputRef = useRef<HTMLInputElement>(null);
  const [aboutProfileImage, setAboutProfileImage] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('johndev_profile_about');
      if (saved) return saved;
    }
    return `${import.meta.env.BASE_URL}assets/img/about.jpg`;
  });

  const saveAboutPhoto = (dataUrl: string) => {
    setAboutProfileImage(dataUrl);
    try {
      localStorage.setItem('johndev_profile_about', dataUrl);
      fetch('/api/upload-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeFilledBase64: dataUrl }),
      }).catch(() => {});
    } catch (_) {}
  };

  // Seamless drag-drop and clipboard paste listener specifically for the About photo
  useEffect(() => {
    // If a custom about photo is in localStorage, ensure it's synced to disk
    if (typeof window !== 'undefined') {
      const savedAbout = localStorage.getItem('johndev_profile_about');
      if (savedAbout) {
        fetch('/api/upload-avatar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ themeFilledBase64: savedAbout }),
        }).catch(() => {});
      }
    }

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const res = event.target?.result as string;
              if (res) saveAboutPhoto(res);
            };
            reader.readAsDataURL(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  // Auto-detect and respond dynamically to system prefers-color-scheme
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };
    mediaQuery.addEventListener?.('change', handleSystemThemeChange);
    return () => {
      mediaQuery.removeEventListener?.('change', handleSystemThemeChange);
    };
  }, []);

  // Sync dark theme class on body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('bedimcode-theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('bedimcode-theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Handle contact submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setFormSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
  };

  // Smooth appearance transition when clicking any section
  const navigateToSection = (e: React.MouseEvent, id: SectionName) => {
    e.preventDefault();
    setMenuOpen(false);
    setActiveSection(id);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleNavigate = (id: SectionName) => {
    setActiveSection(id);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeSection]);

  return (
    <div className="portfolio-app-root">
      {/* High-Resolution Procedural Abstract Wireframe Wave Landscape Background */}
      <WaveBackgroundCanvas isDarkMode={isDarkMode} />

      {/*===== HEADER =====*/}
      <header className="l-header">
        <nav className="nav bd-grid">
          <div>
            <a
              href="#home"
              onClick={(e) => navigateToSection(e, 'home')}
              className="nav__logo"
            >
              JOHNDEV
            </a>
          </div>

          <div className={`nav__menu ${menuOpen ? 'show' : ''}`} id="nav-menu">
            <ul className="nav__list">
              <li className="nav__item">
                <a
                  href="#home"
                  onClick={(e) => navigateToSection(e, 'home')}
                  className={`nav__link ${activeSection === 'home' ? 'active-link' : ''}`}
                >
                  Home
                </a>
              </li>
              <li className="nav__item">
                <a
                  href="#about"
                  onClick={(e) => navigateToSection(e, 'about')}
                  className={`nav__link ${activeSection === 'about' ? 'active-link' : ''}`}
                >
                  About
                </a>
              </li>
              <li className="nav__item">
                <a
                  href="#project"
                  onClick={(e) => navigateToSection(e, 'project')}
                  className={`nav__link ${activeSection === 'project' ? 'active-link' : ''}`}
                >
                  Project
                </a>
              </li>
              <li className="nav__item">
                <a
                  href="#contact"
                  onClick={(e) => navigateToSection(e, 'contact')}
                  className={`nav__link ${activeSection === 'contact' ? 'active-link' : ''}`}
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div className="nav__actions">
            {/* Email quick action */}
            <motion.a
              href="mailto:salvanaj75@gmail.com"
              className="nav__action-btn"
              title="Send email: salvanaj75@gmail.com"
              aria-label="Send email to salvanaj75@gmail.com"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="bx bx-envelope"></i>
            </motion.a>

            {/* Quick Copy Email action */}
            <motion.button
              type="button"
              className="nav__action-btn"
              onClick={handleCopyEmail}
              title="Copy Email: salvanaj75@gmail.com"
              aria-label="Copy email address"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="bx bx-copy"></i>
            </motion.button>

            {/* Quick Share Portfolio action */}
            <motion.button
              type="button"
              className="nav__action-btn nav__action-btn--share"
              onClick={() => setShareModalOpen(true)}
              title="Share Portfolio"
              aria-label="Share portfolio"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="bx bx-share-alt"></i>
            </motion.button>

            {/* Facebook quick action */}
            <motion.a
              href="https://www.facebook.com/share/1HSRV3p2Td/"
              target="_blank"
              rel="noopener noreferrer"
              className="nav__action-btn"
              title="Facebook Profile"
              aria-label="Visit Facebook Profile"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="bx bxl-facebook"></i>
            </motion.a>

            {/* Instagram quick action */}
            <motion.a
              href="https://www.instagram.com/aintyo.harold?stkn=MWY2eG1pMmt6eGw1bg=="
              target="_blank"
              rel="noopener noreferrer"
              className="nav__action-btn"
              title="Instagram Profile"
              aria-label="Visit Instagram Profile"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="bx bxl-instagram"></i>
            </motion.a>

            {/* GitHub quick action */}
            <motion.a
              href="https://github.com/HaroldCodes0619"
              target="_blank"
              rel="noopener noreferrer"
              className="nav__action-btn"
              title="GitHub Profile"
              aria-label="Visit GitHub Profile"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="bx bxl-github"></i>
            </motion.a>

            {/* Dark Mode Toggle Button */}
            <motion.button
              type="button"
              className="theme-toggle-btn"
              onClick={toggleDarkMode}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.i
                  key={isDarkMode ? 'sun' : 'moon'}
                  className={`bx ${isDarkMode ? 'bx-sun' : 'bx-moon'}`}
                  initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.2 }}
                />
              </AnimatePresence>
            </motion.button>

            {/* Mobile menu toggle */}
            <div
              className="nav__toggle"
              id="nav-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation"
              role="button"
              tabIndex={0}
            >
              <i className={`bx ${menuOpen ? 'bx-x' : 'bx-menu'}`}></i>
            </div>
          </div>
        </nav>
      </header>

      {/*===== MAIN SECTION CONTAINER (SMOOTH IN-PLACE APPEAR ANIMATION) =====*/}
      <main className="l-main section-main-container">
        <AnimatePresence mode="wait">
          {activeSection === 'home' && (
            <motion.section
              key="home"
              className="home section-panel"
              id="home"
              variants={sectionPanelVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
            <div className="home__grid bd-grid">
              <motion.div
                className="home__data"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                {/* Profile Picture at the top of the name */}
                <motion.div
                  className="home__profile-avatar"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, rotate: 2, y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg
                    className="home__profile-blob"
                    viewBox="0 0 479 467"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                  >
                    <mask id="mask-profile-top" style={{ maskType: 'alpha' }}>
                      <path d="M9.19024 145.964C34.0253 76.5814 114.865 54.7299 184.111 29.4823C245.804 6.98884 311.86 -14.9503 370.735 14.143C431.207 44.026 467.948 107.508 477.191 174.311C485.897 237.229 454.931 294.377 416.506 344.954C373.74 401.245 326.068 462.801 255.442 466.189C179.416 469.835 111.552 422.137 65.1576 361.805C17.4835 299.81 -17.1617 219.583 9.19024 145.964Z" />
                    </mask>
                    <g mask="url(#mask-profile-top)">
                      <path d="M9.19024 145.964C34.0253 76.5814 114.865 54.7299 184.111 29.4823C245.804 6.98884 311.86 -14.9503 370.735 14.143C431.207 44.026 467.948 107.508 477.191 174.311C485.897 237.229 454.931 294.377 416.506 344.954C373.74 401.245 326.068 462.801 255.442 466.189C179.416 469.835 111.552 422.137 65.1576 361.805C17.4835 299.81 -17.1617 219.583 9.19024 145.964Z" />
                      <image className="home__blob-img" x="50" y="60" href={homeBlobImage} />
                    </g>
                  </svg>
                </motion.div>

                <motion.h1
                  className="home__title"
                  variants={itemVariants}
                >
                  <span className="home__title-color">
                    <span className="home__title-first">John Harold</span>{' '}
                    <span className="home__title-last">Salvaña</span>
                  </span>
                  <br />
                  <span className="home__role-wrapper">
                    <span className="typewriter-text">{currentRoleText}</span>
                    <span className="typewriter-cursor">|</span>
                  </span>
                </motion.h1>

                <motion.div className="home__buttons" variants={itemVariants}>
                  <motion.a
                    href="#contact"
                    onClick={(e) => navigateToSection(e, 'contact')}
                    className="button"
                    whileHover={{ y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    Contact
                  </motion.a>
                </motion.div>

                {/* Social icons below buttons, horizontally aligned */}
                <motion.div
                  className="home__social"
                  variants={itemVariants}
                >
                  <motion.a
                    href="mailto:salvanaj75@gmail.com"
                    aria-label="Send Email to John Harold Salvaña"
                    title="Email: salvanaj75@gmail.com"
                    className="home__social-icon"
                    whileHover={{ scale: 1.2, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <i className="bx bx-envelope"></i>
                  </motion.a>
                  <motion.a
                    href="https://www.facebook.com/share/1HSRV3p2Td/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook Profile"
                    title="Facebook Profile"
                    className="home__social-icon"
                    whileHover={{ scale: 1.2, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <i className="bx bxl-facebook"></i>
                  </motion.a>
                  <motion.a
                    href="https://www.instagram.com/aintyo.harold?stkn=MWY2eG1pMmt6eGw1bg=="
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram Profile"
                    title="Instagram Profile"
                    className="home__social-icon"
                    whileHover={{ scale: 1.2, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <i className="bx bxl-instagram"></i>
                  </motion.a>
                  <motion.a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn Profile"
                    className="home__social-icon"
                    whileHover={{ scale: 1.2, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <i className="bx bxl-linkedin"></i>
                  </motion.a>
                  <motion.a
                    href="https://behance.net"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Behance Portfolio"
                    className="home__social-icon"
                    whileHover={{ scale: 1.2, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <i className="bx bxl-behance"></i>
                  </motion.a>
                  <motion.a
                    href="https://github.com/HaroldCodes0619"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub Profile"
                    title="GitHub: HaroldCodes0619"
                    className="home__social-icon"
                    whileHover={{ scale: 1.2, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <i className="bx bxl-github"></i>
                  </motion.a>
                </motion.div>
              </motion.div>

              {/* Tech Stack Glance Card in the right corner */}
              <motion.div
                className="home__glance-wrapper"
                initial="hidden"
                animate="visible"
                variants={itemVariants}
              >
                <div className="tech-glance__card">
                  <div className="tech-glance__header">
                    <h2 className="tech-glance__portfolio-heading font-bold">
                      My Digital Portfolio
                    </h2>
                    <span className="tech-glance__title">Used tools/languages</span>
                  </div>

                  <div className="tech-glance__icons">
                    {GLANCE_SKILLS.map((skill) => (
                      <div
                        key={skill.name}
                        className="tech-glance__icon-item"
                        title={skill.name}
                      >
                        {skill.renderIcon ? (
                          skill.renderIcon('tech-glance__svg')
                        ) : (
                          <i className={`${skill.icon} tech-glance__icon`}></i>
                        )}
                        <span className="tech-glance__tooltip">{skill.name}</span>
                      </div>
                    ))}
                  </div>

                  <p className="tech-glance__text">
                    I develop web, mobile, and desktop applications, specializing in front-end and back-end development, responsive interfaces, and scalable solutions.
                  </p>

                  <div className="tech-glance__glow" aria-hidden="true" />
                </div>
              </motion.div>
            </div>
            <FooterFrame
              onNavigate={handleNavigate}
              onOpenPrivacy={() => setPrivacyModalOpen(true)}
              onOpenTerms={() => setTermsModalOpen(true)}
              onOpenShare={() => setShareModalOpen(true)}
              onToast={showToast}
            />
          </motion.section>
        )}

        {/*===== ABOUT PANEL =====*/}
        {activeSection === 'about' && (
          <motion.section
            key="about"
            className="about section section-panel"
            id="about"
            variants={sectionPanelVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.h2
              className="section-title"
              initial="hidden"
              animate={activeSection === 'about' ? 'visible' : 'hidden'}
              variants={sectionTitleVariants}
            >
              About
            </motion.h2>

            <div className="about__container bd-grid">
              <motion.div
                className="about__img"
                initial="hidden"
                animate={activeSection === 'about' ? 'visible' : 'hidden'}
                variants={imageRevealVariants}
                whileHover={{ scale: 1.02, rotate: -1.6, y: -6 }}
                onClick={() => aboutFileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      const res = ev.target?.result as string;
                      if (res) saveAboutPhoto(res);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              >
                <img
                  src={aboutProfileImage}
                  alt="John Harold Salvaña - About Photo"
                  referrerPolicy="no-referrer"
                />
                <input
                  ref={aboutFileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const res = ev.target?.result as string;
                        if (res) saveAboutPhoto(res);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </motion.div>

              <motion.div
                initial="hidden"
                animate={activeSection === 'about' ? 'visible' : 'hidden'}
                variants={containerVariants}
              >
                <motion.h2
                  className="about__subtitle font-bold"
                  variants={itemVariants}
                >
                  John Harold Salvaña
                </motion.h2>
                <motion.p
                  className="about__text"
                  variants={itemVariants}
                >
                  My path as a humble coder began with a quiet fascination for how simple lines of text
                  could solve real world problems, teaching me early on to value continuous learning over
                  ego. Currently expanding my technical foundation as a student at{' '}
                  <span className="about__highlight">TCC Torres Capitol College</span>, I focus on
                  transforming complex challenges into clean, accessible solutions. Today, I have evolved
                  from a curious beginner into a grounded, capable developer who builds practical digital
                  experiences including this very website always driven by the understanding that every
                  project is simply another opportunity to grow.
                </motion.p>

                {/* Languages & Technologies */}
                <motion.div className="about__tech-stack" variants={itemVariants}>
                  <span className="about__tech-title">Languages & Technologies</span>
                  <div className="about__tech-grid">
                    {TECH_STACK.map((tech) => (
                      <motion.div
                        key={tech.name}
                        className="about__tech-item"
                        whileHover={{ y: -3, scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        {tech.renderIcon ? (
                          tech.renderIcon('about__tech-svg')
                        ) : (
                          <i className={`${tech.icon} about__tech-icon`}></i>
                        )}
                        <span className="about__tech-name">{tech.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </div>

            <FooterFrame
              onNavigate={handleNavigate}
              onOpenPrivacy={() => setPrivacyModalOpen(true)}
              onOpenTerms={() => setTermsModalOpen(true)}
              onOpenShare={() => setShareModalOpen(true)}
              onToast={showToast}
            />
          </motion.section>
        )}

        {/*===== PROJECT PANEL =====*/}
        {activeSection === 'project' && (
          <motion.section
            key="project"
            className="work section section-panel"
            id="project"
            variants={sectionPanelVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.h2
              className="section-title"
              initial="hidden"
              animate={activeSection === 'project' ? 'visible' : 'hidden'}
              variants={sectionTitleVariants}
            >
              Project
            </motion.h2>

            <motion.div
              className="project__container bd-grid"
              initial="hidden"
              animate={activeSection === 'project' ? 'visible' : 'hidden'}
              variants={containerVariants}
            >
              {/* Project 1: SUI Move Code Camp */}
              <motion.div
                className="tech-glance__card project__card"
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
              >
                {/* DEVCON Project Banner Image */}
                <div className="project__image-container">
                  <a
                    href="https://devconsui-move-code-camp2026-level1-salva-a-1mkh-lkqw9gzji.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project__image-link"
                    title="Open SUI Devcon Move Code Camp Project"
                  >
                    <img
                      src={`${import.meta.env.BASE_URL}assets/img/devcon.png`}
                      alt="DEVCON - SUI Move Code Camp"
                      className="project__image"
                    />
                    <div className="project__image-overlay">
                      <span className="project__image-overlay-text">
                        <i className="bx bx-link-external"></i> Live App
                      </span>
                    </div>
                  </a>
                </div>

                <div className="project__body">
                  <div className="project__info">
                    <div className="tech-glance__header" style={{ marginBottom: '0.4rem' }}>
                      <h3 className="project__title font-bold">
                        SUI Move Code Camp
                      </h3>
                    </div>

                    <p className="project__sentence">
                      <a
                        href="https://devconsui-move-code-camp2026-level1-salva-a-1mkh-lkqw9gzji.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project__sentence-link"
                        title="Open SUI Devcon Project"
                      >
                        Developed and delivered an impactful project as part of SUI Devcon
                      </a>
                    </p>
                  </div>

                  <div className="project__actions">
                    <motion.a
                      href="https://devconsui-move-code-camp2026-level1-salva-a-1mkh-lkqw9gzji.vercel.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button project__btn"
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span>Visit Live Project</span>
                      <i className="bx bx-link-external"></i>
                    </motion.a>

                    <a
                      href="https://devconsui-move-code-camp2026-level1-salva-a-1mkh-lkqw9gzji.vercel.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project__link-url"
                      title="https://devconsui-move-code-camp2026-level1-salva-a-1mkh-lkqw9gzji.vercel.app"
                    >
                      <i className="bx bx-globe"></i>
                      <span>devconsui-move-code-camp2026-level1-salva-a-1mkh-lkqw9gzji.vercel.app</span>
                    </a>
                  </div>
                </div>

                <div className="tech-glance__glow" aria-hidden="true" />
              </motion.div>

              {/* Project 2: AI Defense Coach */}
              <motion.div
                className="tech-glance__card project__card"
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
              >
                {/* AI Defense Coach Shield Banner Image */}
                <div className="project__image-container">
                  <a
                    href="https://ai-mock-interview-oced6n8yj-johnharold06.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project__image-link"
                    title="Open AI Defense Coach Platform"
                  >
                    <img
                      src={`${import.meta.env.BASE_URL}assets/img/ai_defense_coach.png`}
                      alt="AI Defense Coach Emblem"
                      className="project__image"
                    />
                    <div className="project__image-overlay">
                      <span className="project__image-overlay-text">
                        <i className="bx bx-link-external"></i> Live App
                      </span>
                    </div>
                  </a>
                </div>

                <div className="project__body">
                  <div className="project__info">
                    <div className="tech-glance__header" style={{ marginBottom: '0.4rem' }}>
                      <h3 className="project__title font-bold">
                        AI Defense Coach
                      </h3>
                    </div>

                    <p className="project__sentence">
                      <a
                        href="https://ai-mock-interview-oced6n8yj-johnharold06.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project__sentence-link"
                        title="Open AI Defense Coach"
                      >
                        AI Defense Coach, an AI platform that turns uploaded documents into voice-driven mock interviews with automated grading.
                      </a>
                    </p>
                  </div>

                  <div className="project__actions">
                    <motion.a
                      href="https://ai-mock-interview-oced6n8yj-johnharold06.vercel.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button project__btn"
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span>Visit Live Project</span>
                      <i className="bx bx-link-external"></i>
                    </motion.a>

                    <a
                      href="https://ai-mock-interview-oced6n8yj-johnharold06.vercel.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project__link-url"
                      title="https://ai-mock-interview-oced6n8yj-johnharold06.vercel.app"
                    >
                      <i className="bx bx-globe"></i>
                      <span>ai-mock-interview-oced6n8yj-johnharold06.vercel.app</span>
                    </a>
                  </div>
                </div>

                <div className="tech-glance__glow" aria-hidden="true" />
              </motion.div>
            </motion.div>
            <FooterFrame
              onNavigate={handleNavigate}
              onOpenPrivacy={() => setPrivacyModalOpen(true)}
              onOpenTerms={() => setTermsModalOpen(true)}
              onOpenShare={() => setShareModalOpen(true)}
              onToast={showToast}
            />
          </motion.section>
        )}

        {/*===== CONTACT PANEL =====*/}
        {activeSection === 'contact' && (
          <motion.section
            key="contact"
            className="contact section section-panel"
            id="contact"
            variants={sectionPanelVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.h2
              className="section-title"
              initial="hidden"
              animate={activeSection === 'contact' ? 'visible' : 'hidden'}
              variants={sectionTitleVariants}
            >
              Contact
            </motion.h2>

            <div className="contact__container bd-grid">
              <motion.div
                className="contact__intro"
                initial="hidden"
                animate={activeSection === 'contact' ? 'visible' : 'hidden'}
                variants={sectionTitleVariants}
              >
                <h3 className="contact__intro-title">Let's Build Something Together</h3>
                <p className="contact__intro-desc">
                  Have a project in mind, need a developer, or want to discuss ideas? Drop me a message and I'll get back to you shortly.
                </p>

                {/* Quick Copy & Share Actions */}
                <div className="contact__quick-bar">
                  <button
                    type="button"
                    className="contact__quick-btn"
                    onClick={handleCopyEmail}
                    title="Click to copy email address"
                  >
                    <i className="bx bx-envelope"></i>
                    <span>salvanaj75@gmail.com</span>
                    <i className="bx bx-copy contact__quick-copy-icon"></i>
                  </button>

                  <button
                    type="button"
                    className="contact__quick-btn"
                    onClick={handleCopyPhone}
                    title="Click to copy phone number"
                  >
                    <i className="bx bx-phone"></i>
                    <span>+63 994 798 2698</span>
                    <i className="bx bx-copy contact__quick-copy-icon"></i>
                  </button>

                  <button
                    type="button"
                    className="contact__quick-btn contact__quick-btn--share"
                    onClick={() => setShareModalOpen(true)}
                    title="Share portfolio link"
                  >
                    <i className="bx bx-share-alt"></i>
                    <span>Share Portfolio</span>
                  </button>
                </div>
              </motion.div>

              <motion.div
                className="contact__card-wrapper"
                initial="hidden"
                animate={activeSection === 'contact' ? 'visible' : 'hidden'}
                variants={containerVariants}
              >
                <div className="contact__card tech-glance__card">
                  <div className="tech-glance__header">
                    <span className="tech-glance__title">GET IN TOUCH</span>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="contact__form">
                    <AnimatePresence>
                      {formSubmitted && (
                        <motion.div
                          className="contact__success"
                          initial={{ opacity: 0, y: -12, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.96 }}
                          transition={{ duration: 0.25 }}
                        >
                          <i className="bx bx-check-circle" style={{ fontSize: '1.35rem', color: '#10b981' }}></i>
                          <div>
                            <strong>Message Sent!</strong> Thanks for reaching out. John Harold will get back to you soon.
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="contact__fields-grid">
                      <div className="contact__field">
                        <label className="contact__label" htmlFor="contact-name">Name</label>
                        <div className="contact__input-wrapper">
                          <i className="bx bx-user contact__field-icon"></i>
                          <input
                            id="contact-name"
                            type="text"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="contact__input"
                          />
                        </div>
                      </div>

                      <div className="contact__field">
                        <label className="contact__label" htmlFor="contact-email">Email</label>
                        <div className="contact__input-wrapper">
                          <i className="bx bx-envelope contact__field-icon"></i>
                          <input
                            id="contact-email"
                            type="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            className="contact__input"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="contact__field">
                      <label className="contact__label" htmlFor="contact-message">Message</label>
                      <div className="contact__input-wrapper">
                        <i className="bx bx-message-detail contact__field-icon contact__field-icon--textarea"></i>
                        <textarea
                          id="contact-message"
                          rows={4}
                          placeholder="Tell me about your project or inquiry..."
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          required
                          className="contact__input contact__textarea"
                        ></textarea>
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      className="contact__submit-btn"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span>Send Message</span>
                      <i className="bx bx-send"></i>
                    </motion.button>
                  </form>

                  {/* Corner ambient glow identical to Home card */}
                  <div className="tech-glance__glow" aria-hidden="true" />
                </div>
              </motion.div>
            </div>
            <FooterFrame
              onNavigate={handleNavigate}
              onOpenPrivacy={() => setPrivacyModalOpen(true)}
              onOpenTerms={() => setTermsModalOpen(true)}
              onOpenShare={() => setShareModalOpen(true)}
              onToast={showToast}
            />
          </motion.section>
        )}
      </AnimatePresence>
    </main>

      {/*===== PRIVACY POLICY MODAL =====*/}
      <PrivacyPolicyModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />

      {/*===== TERMS OF SERVICE MODAL =====*/}
      <TermsOfServiceModal
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
      />

      {/*===== SHARE PORTFOLIO MODAL =====*/}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        onToast={showToast}
      />

      {/*===== TOAST NOTIFICATION =====*/}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
