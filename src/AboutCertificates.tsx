import React from 'react';
import { motion } from 'motion/react';

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
    issuer: 'Torres Capitol College, Inc. — BSIT Department',
    imageUrl: `${import.meta.env.BASE_URL}assets/img/certificate-1.jpg`,
  },
  {
    id: 'certificate-2',
    title: 'Certificate of Participation',
    issuer: 'DEVCON Bukidnon Chapter',
    imageUrl: `${import.meta.env.BASE_URL}assets/img/certificate-2.jpg`,
  },
  {
    id: 'certificate-3',
    title: 'Certificate of Participation',
    issuer: 'Philippine Countryville College, Inc.',
    imageUrl: `${import.meta.env.BASE_URL}assets/img/certificate-3.jpg`,
  },
];

export const AboutCertificates: React.FC = () => (
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
          <div className="about-certificate-card__image">
            <img src={certificate.imageUrl} alt={`${certificate.title} from ${certificate.issuer}`} />
            <span className="about-certificate-card__number">0{index + 1}</span>
          </div>

          <div className="about-certificate-card__details">
            <h4 className="about-certificate-card__title">{certificate.title}</h4>
            <p className="about-certificate-card__issuer">{certificate.issuer}</p>
          </div>
        </motion.article>
      ))}
    </div>
  </section>
);
