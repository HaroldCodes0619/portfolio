import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  imageUrl: string;
}

const CERTIFICATES: Certificate[] = [
  {
    id: 'certificate-1',
    title: 'Certificate of Participation',
    issuer: 'Certificate of Participation in the BSIT SEMINAR-WORKSHOP held in april 29, 2026 at Torres Capitol College Inc',
    imageUrl: `${import.meta.env.BASE_URL}assets/img/certificate-1.jpg`,
  },
  {
    id: 'certificate-2',
    title: 'Certificate of Participation',
    issuer: 'For complying the Final Game Defense conducted at Torres Capitol College Inc College library, 2nd floor',
    imageUrl: `${import.meta.env.BASE_URL}assets/img/certificate-2.jpg`,
  },
  {
    id: 'certificate-3',
    title: 'Certificate of Participation',
    issuer: 'Recognition of my active participation during the Devcon Bits of light Roadshow.',
    imageUrl: `${import.meta.env.BASE_URL}assets/img/certificate-3.jpg`,
  },
  {
    id: 'certificate-4',
    title: 'Certificate of Completion',
    issuer: 'For completing the Networking Academy through the Cisco Networking Academy program.',
    imageUrl: `${import.meta.env.BASE_URL}assets/img/certificate-4.jpg`,
  },
];

export const AboutCertificates: React.FC = () => {
  const [previewCertificate, setPreviewCertificate] = useState<Certificate | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const activeCertificate = CERTIFICATES[activeIndex];

  const showCertificate = (index: number, direction: number) => {
    setSlideDirection(direction);
    setActiveIndex((index + CERTIFICATES.length) % CERTIFICATES.length);
  };

  useEffect(() => {
    if (!previewCertificate) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPreviewCertificate(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewCertificate]);

  useEffect(() => {
    if (prefersReducedMotion || isCarouselPaused || previewCertificate) return;

    const timer = window.setInterval(() => {
      setSlideDirection(1);
      setActiveIndex((index) => (index + 1) % CERTIFICATES.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [isCarouselPaused, prefersReducedMotion, previewCertificate]);

  return (
    <section className="about-certificates bd-grid" aria-labelledby="certificates-title">
      <div className="about-certificates__heading">
        <span className="about-certificates__eyebrow">Achievements</span>
        <h3 className="about-certificates__title" id="certificates-title">Certificates</h3>
        <p className="about-certificates__intro">
          These certificates represent my academic journey and technical growth in Information
          Technology. They serve as formal documentation of the specialized IT skills I have
          acquired through coursework, as well as my active engagement, teamwork, and leadership
          in various school programs and events
        </p>
      </div>

      <div
        className="about-certificates__carousel"
        role="region"
        aria-label="Certificates"
        aria-roledescription="carousel"
        onMouseEnter={() => setIsCarouselPaused(true)}
        onMouseLeave={() => setIsCarouselPaused(false)}
        onFocusCapture={() => setIsCarouselPaused(true)}
        onBlurCapture={(event) => {
          if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) {
            setIsCarouselPaused(false);
          }
        }}
      >
        <div className="about-certificates__viewport">
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={activeCertificate.id}
              className="about-certificate-card"
              role="group"
              aria-roledescription="slide"
              aria-label={`${activeIndex + 1} of ${CERTIFICATES.length}`}
              initial={{ opacity: 0, x: slideDirection * 36 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: slideDirection * -36 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.35, ease: 'easeOut' }}
            >
              <button
                className="about-certificate-card__preview"
                type="button"
                onClick={() => setPreviewCertificate(activeCertificate)}
                aria-label={`View ${activeCertificate.title} from ${activeCertificate.issuer}`}
              >
                <span className="about-certificate-card__image">
                  <img src={activeCertificate.imageUrl} alt="" />
                  <span className="about-certificate-card__number">
                    {String(activeIndex + 1).padStart(2, '0')}
                  </span>
                  <span className="about-certificate-card__view-hint">
                    <i className="bx bx-expand-alt" aria-hidden="true" />
                    View certificate
                  </span>
                </span>
              </button>

              <div className="about-certificate-card__details">
                <h4 className="about-certificate-card__title">{activeCertificate.title}</h4>
                <p className="about-certificate-card__issuer">{activeCertificate.issuer}</p>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="about-certificates__controls" aria-label="Certificate carousel controls">
          <button
            className="about-certificates__arrow"
            type="button"
            onClick={() => showCertificate(activeIndex - 1, -1)}
            aria-label="Previous certificate"
          >
            <i className="bx bx-chevron-left" aria-hidden="true" />
          </button>
          <div className="about-certificates__pagination" role="group" aria-label="Choose a certificate">
            {CERTIFICATES.map((certificate, index) => (
              <button
                key={certificate.id}
                className={`about-certificates__dot${index === activeIndex ? ' is-active' : ''}`}
                type="button"
                onClick={() => showCertificate(index, index >= activeIndex ? 1 : -1)}
                aria-label={`Show certificate ${index + 1}`}
                aria-current={index === activeIndex ? 'true' : undefined}
              />
            ))}
          </div>
          <button
            className="about-certificates__arrow"
            type="button"
            onClick={() => showCertificate(activeIndex + 1, 1)}
            aria-label="Next certificate"
          >
            <i className="bx bx-chevron-right" aria-hidden="true" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {previewCertificate && (
          <motion.div
            className="certificate-viewer"
            role="dialog"
            aria-modal="true"
            aria-label={`${previewCertificate.title} from ${previewCertificate.issuer}`}
            onClick={() => setPreviewCertificate(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="certificate-viewer__content"
              onClick={(event) => event.stopPropagation()}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.2 }}
            >
              <button
                className="certificate-viewer__close"
                type="button"
                onClick={() => setPreviewCertificate(null)}
                aria-label="Close certificate preview"
                autoFocus
              >
                <i className="bx bx-x" aria-hidden="true" />
              </button>
              <img
                className="certificate-viewer__image"
                src={previewCertificate.imageUrl}
                alt={`${previewCertificate.title} from ${previewCertificate.issuer}`}
              />
              <div className="certificate-viewer__caption">
                <h4>{previewCertificate.title}</h4>
                <p>{previewCertificate.issuer}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
