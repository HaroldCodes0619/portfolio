import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

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
];

export const AboutCertificates: React.FC = () => {
  const [previewCertificate, setPreviewCertificate] = useState<Certificate | null>(null);

  useEffect(() => {
    if (!previewCertificate) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPreviewCertificate(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewCertificate]);

  return (
    <section className="about-certificates bd-grid" aria-labelledby="certificates-title">
      <div className="about-certificates__heading">
        <span className="about-certificates__eyebrow">Achievements</span>
        <h3 className="about-certificates__title" id="certificates-title">Certificates</h3>
      </div>

      <div className="about-certificates__grid">
        {CERTIFICATES.map((certificate, index) => (
          <motion.article
            key={certificate.id}
            className="about-certificate-card"
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <button
              className="about-certificate-card__preview"
              type="button"
              onClick={() => setPreviewCertificate(certificate)}
              aria-label={`View ${certificate.title} from ${certificate.issuer}`}
            >
              <span className="about-certificate-card__image">
                <img src={certificate.imageUrl} alt="" />
                <span className="about-certificate-card__number">0{index + 1}</span>
                <span className="about-certificate-card__view-hint">
                  <i className="bx bx-expand-alt" aria-hidden="true" />
                  View certificate
                </span>
              </span>
            </button>

            <div className="about-certificate-card__details">
              <h4 className="about-certificate-card__title">{certificate.title}</h4>
              <p className="about-certificate-card__issuer">{certificate.issuer}</p>
            </div>
          </motion.article>
        ))}
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
