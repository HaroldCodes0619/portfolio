import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const smoothEase = [0.22, 1, 0.36, 1] as const;

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="privacy-modal__overlay"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-policy-title"
        >
          <motion.div
            className="privacy-modal__content"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.93, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.93, opacity: 0, y: 20 }}
            transition={{ duration: 0.28, ease: smoothEase }}
          >
            {/* Header */}
            <div className="privacy-modal__header">
              <div className="privacy-modal__header-icon">
                <i className="bx bx-shield-quarter"></i>
              </div>
              <div className="privacy-modal__header-titles">
                <h2 id="privacy-policy-title" className="privacy-modal__title">
                  Privacy Policy
                </h2>
                <span className="privacy-modal__date">Last Updated: October 1, 2026</span>
              </div>
              <button
                className="privacy-modal__close-btn"
                onClick={onClose}
                aria-label="Close Privacy Policy"
              >
                <i className="bx bx-x"></i>
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="privacy-modal__body">
              <p className="privacy-modal__lead">
                Welcome to my digital portfolio. I respect your privacy and am committed to protecting any personal information that may be shared through this website.
              </p>

              <section className="privacy-modal__section">
                <h3 className="privacy-modal__section-title">Information I Collect</h3>
                <p>
                  This portfolio may collect limited information such as your name, email address, or message if you voluntarily provide them through a contact form or other communication feature. I do not intentionally collect sensitive personal information from visitors.
                </p>
              </section>

              <section className="privacy-modal__section">
                <h3 className="privacy-modal__section-title">How I Use Information</h3>
                <p>
                  Any information you provide may be used to respond to your questions or messages, communicate with you when necessary, and improve the content and functionality of this portfolio.
                </p>
              </section>

              <section className="privacy-modal__section">
                <h3 className="privacy-modal__section-title">Information Sharing</h3>
                <p>
                  I will not sell, rent, or intentionally share your personal information with third parties unless it is required by law or you have given permission.
                </p>
              </section>

              <section className="privacy-modal__section">
                <h3 className="privacy-modal__section-title">Cookies and Analytics</h3>
                <p>
                  This portfolio may use cookies or basic analytics tools to understand how visitors use the website and improve its performance. These tools may collect general information such as browser type, device type, and pages visited.
                </p>
              </section>

              <section className="privacy-modal__section">
                <h3 className="privacy-modal__section-title">Third-Party Links</h3>
                <p>
                  This portfolio may contain links to external websites, social media accounts, or other online services. I am not responsible for the privacy practices or content of these third-party websites. Visitors are encouraged to review the privacy policies of those websites.
                </p>
              </section>

              <section className="privacy-modal__section">
                <h3 className="privacy-modal__section-title">Data Security</h3>
                <p>
                  Reasonable measures are taken to protect any information provided through this portfolio. However, no method of transmitting or storing information online can be guaranteed to be completely secure.
                </p>
              </section>

              <section className="privacy-modal__section">
                <h3 className="privacy-modal__section-title">Your Privacy Rights</h3>
                <p>
                  You may contact me if you have questions about your personal information or would like your information corrected or deleted, where applicable.
                </p>
              </section>

              <section className="privacy-modal__section">
                <h3 className="privacy-modal__section-title">Changes to This Privacy Policy</h3>
                <p>
                  This Privacy Policy may be updated from time to time. Any changes will be posted on this page with an updated &ldquo;Last Updated&rdquo; date.
                </p>
              </section>

              <section className="privacy-modal__section privacy-modal__section--contact">
                <h3 className="privacy-modal__section-title">Contact</h3>
                <p>If you have any questions or concerns about this Privacy Policy, you may contact me at:</p>
                <ul className="privacy-modal__contact-list">
                  <li>
                    <i className="bx bxl-facebook"></i>
                    <span>
                      Facebook:{' '}
                      <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="privacy-modal__link"
                      >
                        John Harold Salvaña
                      </a>
                    </span>
                  </li>
                  <li>
                    <i className="bx bx-envelope"></i>
                    <span>
                      Email:{' '}
                      <a href="mailto:salvanaj75@gmail.com" className="privacy-modal__link">
                        salvanaj75@gmail.com
                      </a>
                    </span>
                  </li>
                </ul>
              </section>
            </div>

            {/* Footer action */}
            <div className="privacy-modal__footer">
              <button
                type="button"
                className="button privacy-modal__accept-btn"
                onClick={onClose}
              >
                Close Privacy Policy
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
