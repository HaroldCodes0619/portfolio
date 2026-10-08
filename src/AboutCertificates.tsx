import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  imageUrl: string;
}

interface AboutCertificatesProps {
  onToast?: (title: string, description?: string, icon?: string) => void;
}

const STORAGE_KEY = 'johndev_certificates';
const FEATURED_CERTIFICATE_IMAGE = `${import.meta.env.BASE_URL}assets/img/certificate-1.jpg`;

const DEFAULT_CERTIFICATES: Certificate[] = [
  {
    id: 'certificate-1',
    title: 'Certificate of Participation',
    issuer: 'Torres Capitol College, Inc. — BSIT Department',
    imageUrl: FEATURED_CERTIFICATE_IMAGE,
  },
  { id: 'certificate-2', title: '', issuer: '', imageUrl: '' },
  { id: 'certificate-3', title: '', issuer: '', imageUrl: '' },
];

const loadCertificates = (): Certificate[] => {
  if (typeof window === 'undefined') return DEFAULT_CERTIFICATES;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_CERTIFICATES;

    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed) || parsed.length !== DEFAULT_CERTIFICATES.length) {
      throw new Error('Saved certificates must contain exactly three entries.');
    }

    return DEFAULT_CERTIFICATES.map((certificate, index) => {
      const item = parsed[index];
      if (
        typeof item !== 'object' ||
        item === null ||
        !('title' in item) ||
        !('issuer' in item) ||
        !('imageUrl' in item) ||
        typeof item.title !== 'string' ||
        typeof item.issuer !== 'string' ||
        typeof item.imageUrl !== 'string'
      ) {
        throw new Error('Saved certificate data is invalid.');
      }

      return {
        ...certificate,
        title: item.title || certificate.title,
        issuer: item.issuer || certificate.issuer,
        imageUrl: item.imageUrl || certificate.imageUrl,
      };
    });
  } catch (error) {
    console.error('Unable to load saved certificates.', error);
    return DEFAULT_CERTIFICATES;
  }
};

export const AboutCertificates: React.FC<AboutCertificatesProps> = ({ onToast }) => {
  const [certificates, setCertificates] = useState(loadCertificates);
  const certificatesRef = useRef(certificates);

  const saveCertificates = (updated: Certificate[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error('Unable to save certificates.', error);
      onToast?.('Certificates not saved', 'Browser storage is unavailable or full.', 'bx-error-circle');
      return false;
    }
  };

  const updateCertificate = (id: string, changes: Partial<Certificate>, save = false) => {
    const updated = certificatesRef.current.map((certificate) =>
      certificate.id === id ? { ...certificate, ...changes } : certificate
    );
    certificatesRef.current = updated;
    setCertificates(updated);
    return save ? saveCertificates(updated) : true;
  };

  return (
    <section className="about-certificates bd-grid" aria-labelledby="certificates-title">
      <div className="about-certificates__heading">
        <span className="about-certificates__eyebrow">Achievements</span>
        <h3 className="about-certificates__title" id="certificates-title">Certificates</h3>
        <p className="about-certificates__intro">
          Add your certificates and the organizations that awarded them.
        </p>
      </div>

      <div className="about-certificates__grid">
        {certificates.map((certificate, index) => (
          <CertificateCard
            key={certificate.id}
            certificate={certificate}
            number={index + 1}
            onChange={updateCertificate}
            onToast={onToast}
          />
        ))}
      </div>
    </section>
  );
};

interface CertificateCardProps {
  certificate: Certificate;
  number: number;
  onChange: (id: string, changes: Partial<Certificate>, save?: boolean) => boolean;
  onToast?: AboutCertificatesProps['onToast'];
}

const CertificateCard: React.FC<CertificateCardProps> = ({
  certificate,
  number,
  onChange,
  onToast,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onToast?.('Unsupported file', 'Choose a certificate image file.', 'bx-error-circle');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result;
      if (typeof imageUrl !== 'string') {
        onToast?.('Upload failed', 'The certificate image could not be read.', 'bx-error-circle');
        return;
      }

      const saved = onChange(certificate.id, { imageUrl }, true);
      if (saved) {
        onToast?.('Certificate added', 'Your certificate image has been saved.', 'bx-check');
      }
    };
    reader.onerror = () => {
      onToast?.('Upload failed', 'The certificate image could not be read.', 'bx-error-circle');
    };
    reader.readAsDataURL(file);
  };

  return (
    <motion.article
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
        {certificate.imageUrl ? (
          <img src={certificate.imageUrl} alt={certificate.title || `Certificate ${number}`} />
        ) : (
          <div className="about-certificate-card__placeholder" aria-hidden="true">
            <i className="bx bx-award" />
            <span>Certificate {number}</span>
          </div>
        )}
        <input
          ref={fileInputRef}
          className="about-certificate-card__file-input"
          type="file"
          accept="image/*"
          aria-label={`Upload certificate ${number} image`}
          onChange={handleFileChange}
        />
        <button
          className="about-certificate-card__upload"
          type="button"
          onClick={() => fileInputRef.current?.click()}
        >
          <i className="bx bx-upload" aria-hidden="true" />
          {certificate.imageUrl ? 'Replace image' : 'Add image'}
        </button>
      </div>

      <div className="about-certificate-card__details">
        <label>
          <span>Certificate title</span>
          <input
            type="text"
            value={certificate.title}
            placeholder={`Certificate ${number}`}
            onChange={(event) => onChange(certificate.id, { title: event.target.value })}
            onBlur={() => onChange(certificate.id, {}, true)}
          />
        </label>
        <label>
          <span>Issuing organization</span>
          <input
            type="text"
            value={certificate.issuer}
            placeholder="Organization name"
            onChange={(event) => onChange(certificate.id, { issuer: event.target.value })}
            onBlur={() => onChange(certificate.id, {}, true)}
          />
        </label>
      </div>
    </motion.article>
  );
};
