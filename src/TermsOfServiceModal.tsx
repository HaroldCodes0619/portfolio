import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const smoothEase = [0.22, 1, 0.36, 1] as const;

export const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({ isOpen, onClose }) => {
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
          aria-labelledby="terms-of-service-title"
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
                <i className="bx bx-file-blank"></i>
              </div>
              <div className="privacy-modal__header-titles">
                <h2 id="terms-of-service-title" className="privacy-modal__title">
                  Terms of Service
                </h2>
                <span className="privacy-modal__date">Last Updated: October 1, 2026</span>
              </div>
              <button
                className="privacy-modal__close-btn"
                onClick={onClose}
                aria-label="Close Terms of Service"
              >
                <i className="bx bx-x"></i>
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="privacy-modal__body">
              <p className="privacy-modal__lead">
                Welcome to my digital portfolio. By accessing and using this website, you agree to follow these Terms of Service. If you do not agree with these terms, please refrain from using the website.
              </p>

              <section className="privacy-modal__section">
                <h3 className="privacy-modal__section-title">Use of the Website</h3>
                <p>
                  This digital portfolio is intended to showcase my personal information, skills, projects, achievements, and other academic or professional work. You may view and use the website for personal and informational purposes.
                </p>
              </section>

              <section className="privacy-modal__section">
                <h3 className="privacy-modal__section-title">Content Ownership</h3>
                <p>
                  Unless otherwise stated, the content displayed on this portfolio, including text, images, designs, projects, and other materials, belongs to me or is used with appropriate permission or attribution. Content may not be copied, reproduced, or redistributed without permission.
                </p>
              </section>

              <section className="privacy-modal__section">
                <h3 className="privacy-modal__section-title">Acceptable Use</h3>
                <p>
                  Visitors are expected to use this website responsibly and lawfully. You must not use the website to harm others, attempt to gain unauthorized access, distribute harmful content, or interfere with the website&apos;s operation.
                </p>
              </section>

              <section className="privacy-modal__section">
                <h3 className="privacy-modal__section-title">External Links</h3>
                <p>
                  This portfolio may include links to third-party websites and social media platforms. These websites are not controlled by me, and I am not responsible for their content, services, or policies.
                </p>
              </section>

              <section className="privacy-modal__section">
                <h3 className="privacy-modal__section-title">Accuracy of Information</h3>
                <p>
                  I make reasonable efforts to keep the information on this portfolio accurate and updated. However, some information may change over time, and I cannot guarantee that all content will always be complete or error-free.
                </p>
              </section>

              <section className="privacy-modal__section">
                <h3 className="privacy-modal__section-title">Website Availability</h3>
                <p>
                  I may update, modify, suspend, or remove parts of the portfolio at any time without prior notice. I cannot guarantee that the website will always be available or free from technical issues.
                </p>
              </section>

              <section className="privacy-modal__section">
                <h3 className="privacy-modal__section-title">Limitation of Liability</h3>
                <p>
                  This portfolio is provided for general informational and educational purposes. I am not responsible for any loss, damage, or inconvenience resulting from the use of or inability to use this website.
                </p>
              </section>

              <section className="privacy-modal__section">
                <h3 className="privacy-modal__section-title">Changes to These Terms</h3>
                <p>
                  These Terms of Service may be updated from time to time. Any changes will be posted on this page with an updated &ldquo;Last Updated&rdquo; date.
                </p>
              </section>

              <section className="privacy-modal__section privacy-modal__section--contact">
                <h3 className="privacy-modal__section-title">Contact</h3>
                <p>If you have any questions regarding these Terms of Service, you may contact me at:</p>
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
                Close Terms of Service
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
