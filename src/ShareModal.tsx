import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast: (title: string, desc?: string, icon?: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, onToast }) => {
  const [copied, setCopied] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPortfolioUrl(window.location.origin);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(portfolioUrl || window.location.href);
      setCopied(true);
      onToast('Link Copied!', 'Portfolio link copied to clipboard', 'bx-check');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      onToast('Copy failed', 'Please copy the link manually', 'bx-error-circle');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'John Harold Salvaña | JOHNDEV Portfolio',
          text: 'Explore John Harold Salvaña’s digital portfolio, frontend projects, and tech skills!',
          url: portfolioUrl || window.location.href,
        });
        onToast('Shared Successfully', 'Thank you for sharing!', 'bx-share-alt');
        onClose();
      } catch (err) {
        // User canceled or failed
      }
    }
  };

  const shareText = encodeURIComponent(
    'Check out John Harold Salvaña’s web development portfolio - JOHNDEV:'
  );
  const shareUrl = encodeURIComponent(portfolioUrl || 'https://johndev.app');

  const shareChannels = [
    {
      name: 'LinkedIn',
      icon: 'bxl-linkedin',
      color: '#0a66c2',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    },
    {
      name: 'Twitter / X',
      icon: 'bxl-twitter',
      color: '#1da1f2',
      href: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`,
    },
    {
      name: 'Facebook',
      icon: 'bxl-facebook',
      color: '#1877f2',
      href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    },
    {
      name: 'WhatsApp',
      icon: 'bxl-whatsapp',
      color: '#25d366',
      href: `https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`,
    },
    {
      name: 'Telegram',
      icon: 'bxl-telegram',
      color: '#229ed9',
      href: `https://t.me/share/url?url=${shareUrl}&text=${shareText}`,
    },
    {
      name: 'Email',
      icon: 'bx-envelope',
      color: '#ea4335',
      href: `mailto:?subject=${encodeURIComponent(
        'John Harold Salvaña Portfolio - JOHNDEV'
      )}&body=${shareText}%20${shareUrl}`,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="share-modal-root" role="dialog" aria-modal="true" aria-label="Share Portfolio">
          <motion.div
            className="share-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.div
            className="share-modal-card"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="share-modal-header">
              <div className="share-modal-header-icon">
                <i className="bx bx-share-alt"></i>
              </div>
              <div className="share-modal-header-text">
                <h3 className="share-modal-title">Share Portfolio</h3>
                <p className="share-modal-subtitle">Spread the word or share with recruiters & clients</p>
              </div>
              <button
                type="button"
                className="share-modal-close"
                onClick={onClose}
                aria-label="Close share dialog"
              >
                <i className="bx bx-x"></i>
              </button>
            </div>

            {/* Quick URL Copy Bar */}
            <div className="share-modal-copy-box">
              <div className="share-modal-link-preview">
                <i className="bx bx-link"></i>
                <input
                  type="text"
                  readOnly
                  value={portfolioUrl || 'https://johndev.app'}
                  className="share-modal-link-input"
                  aria-label="Portfolio URL"
                />
              </div>
              <button
                type="button"
                className={`share-modal-copy-btn ${copied ? 'share-modal-copy-btn--copied' : ''}`}
                onClick={handleCopyLink}
              >
                <i className={`bx ${copied ? 'bx-check' : 'bx-copy'}`}></i>
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            {/* Social Share Grid */}
            <div className="share-modal-channels-title">Share via</div>
            <div className="share-modal-grid">
              {shareChannels.map((ch) => (
                <a
                  key={ch.name}
                  href={ch.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-modal-channel-btn"
                  onClick={() => {
                    onToast('Redirecting...', `Opening ${ch.name}`, 'bx-link-external');
                  }}
                >
                  <div
                    className="share-modal-channel-icon"
                    style={{ backgroundColor: `${ch.color}15`, color: ch.color }}
                  >
                    <i className={`bx ${ch.icon}`}></i>
                  </div>
                  <span className="share-modal-channel-name">{ch.name}</span>
                </a>
              ))}
            </div>

            {/* Mobile / Device Native Share option if supported */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <div className="share-modal-native-box">
                <button
                  type="button"
                  className="share-modal-native-btn"
                  onClick={handleNativeShare}
                >
                  <i className="bx bx-devices"></i>
                  <span>Use Device Share Sheet</span>
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
