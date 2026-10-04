import React, { useState } from 'react';

interface FooterFrameProps {
  onNavigate?: (id: 'home' | 'about' | 'project' | 'contact') => void;
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onOpenShare?: () => void;
  onToast?: (title: string, desc?: string, icon?: string) => void;
}

export const FooterFrame: React.FC<FooterFrameProps> = ({
  onNavigate,
  onOpenPrivacy,
  onOpenTerms,
  onOpenShare,
  onToast,
}) => {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const handleCopy = async (e: React.MouseEvent, text: string, label: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(label);
      onToast?.(`Copied ${label}!`, text, 'bx-check-circle');
      setTimeout(() => setCopiedItem(null), 2200);
    } catch {
      onToast?.('Copy failed', 'Please copy manually', 'bx-error-circle');
    }
  };

  const handleScrollTop = (e: React.MouseEvent) => {
    e.preventDefault();
    const panel = (e.currentTarget as HTMLElement).closest('.section-panel');
    if (panel) {
      panel.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer-frame">
      <div className="footer-frame__container">
        {/* Centered Brand, Description & Socials Block */}
        <div className="footer-frame__brand-center">
          <h2 className="footer-frame__brand">
            JOHNDEV<span className="footer-frame__dot">.</span>
          </h2>
          <p className="footer-frame__desc">
            Building innovative digital solutions that deliver quality, efficiency, and lasting value for modern web and software platforms.
          </p>
          <div className="footer-frame__socials">
            <a
              href="https://www.facebook.com/share/1HSRV3p2Td/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="footer-frame__social-btn"
            >
              <i className="bx bxl-facebook"></i>
            </a>
            <a
              href="https://www.instagram.com/aintyo.harold?stkn=MWY2eG1pMmt6eGw1bg=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="footer-frame__social-btn"
            >
              <i className="bx bxl-instagram"></i>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="footer-frame__social-btn"
            >
              <i className="bx bxl-youtube"></i>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="footer-frame__social-btn"
            >
              <i className="bx bxl-linkedin"></i>
            </a>
            <a
              href="https://github.com/HaroldCodes0619"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="footer-frame__social-btn"
            >
              <i className="bx bxl-github"></i>
            </a>
          </div>
        </div>

        {/* Centered Contact Highlights with Quick Copy & Share */}
        <div className="footer-frame__contacts-center">
          <div className="footer-frame__contact-pill" title="Location">
            <i className="bx bx-map"></i>
            <span>Kitaotao, Bukidnon, Philippines</span>
          </div>

          <div className="footer-frame__contact-pill-group">
            <a href="tel:+639947982698" className="footer-frame__contact-pill">
              <i className="bx bx-phone"></i>
              <span>+63 994 798 2698</span>
            </a>
            <button
              type="button"
              className="footer-frame__mini-copy-btn"
              onClick={(e) => handleCopy(e, '+639947982698', 'Phone Number')}
              title="Copy phone number"
              aria-label="Copy phone number"
            >
              <i className={`bx ${copiedItem === 'Phone Number' ? 'bx-check' : 'bx-copy'}`}></i>
            </button>
          </div>

          <div className="footer-frame__contact-pill-group">
            <a href="mailto:salvanaj75@gmail.com" className="footer-frame__contact-pill">
              <i className="bx bx-envelope"></i>
              <span>salvanaj75@gmail.com</span>
            </a>
            <button
              type="button"
              className="footer-frame__mini-copy-btn"
              onClick={(e) => handleCopy(e, 'salvanaj75@gmail.com', 'Email Address')}
              title="Copy email address"
              aria-label="Copy email address"
            >
              <i className={`bx ${copiedItem === 'Email Address' ? 'bx-check' : 'bx-copy'}`}></i>
            </button>
          </div>

          {/* Quick Share Button in Footer */}
          <button
            type="button"
            className="footer-frame__contact-pill footer-frame__contact-pill--share"
            onClick={onOpenShare}
            title="Share portfolio"
            aria-label="Share portfolio"
          >
            <i className="bx bx-share-alt"></i>
            <span>Share Portfolio</span>
          </button>
        </div>

        {/* Bottom Sub-bar */}
        <div className="footer-frame__bottom">
          <p className="footer-frame__copy">
            &copy; 2026 JOHNDEV | John Harold Salvaña. All Rights Reserved.
          </p>
          <div className="footer-frame__legal">
            <a
              href="#privacy"
              onClick={(e) => {
                e.preventDefault();
                onOpenPrivacy?.();
              }}
              className="footer-frame__legal-link"
            >
              Privacy Policy
            </a>
            <span className="footer-frame__legal-sep">•</span>
            <a
              href="#terms"
              onClick={(e) => {
                e.preventDefault();
                onOpenTerms?.();
              }}
              className="footer-frame__legal-link"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>

      {/* Floating Scroll to Top button */}
      <button
        type="button"
        onClick={handleScrollTop}
        className="footer-frame__scroll-top"
        title="Scroll to Top"
        aria-label="Scroll to top"
      >
        <i className="bx bx-up-arrow-alt"></i>
      </button>
    </footer>
  );
};
