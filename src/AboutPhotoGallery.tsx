import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
}

const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'photo-1',
    title: 'Bits of Light Roadshow',
    imageUrl: `${import.meta.env.BASE_URL}assets/img/photo-1.jpg`,
  },
  {
    id: 'photo-2',
    title: 'Broadcasting Presentation at DXGT Studio',
    imageUrl: `${import.meta.env.BASE_URL}assets/img/photo-2.jpg`,
  },
  {
    id: 'photo-3',
    title: 'DXGT Studio Tour Second floor at TCC',
    imageUrl: `${import.meta.env.BASE_URL}assets/img/photo-3.jpg`,
  },
  {
    id: 'photo-4',
    title: 'DXGT Studio Tour Second floor at TCC',
    imageUrl: `${import.meta.env.BASE_URL}assets/img/photo-4.jpg`,
  },
];

export const AboutPhotoGallery: React.FC = () => {
  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);

  return (
    <div className="about-gallery">
      {/* Clean Gallery Header */}
      <div className="about-gallery__header about-gallery__header--plain">
        <div className="about-gallery__headings">
          <h3 className="about-gallery__title">Moments & Highlights</h3>
          <p className="about-gallery__subtitle">
            A visual snapshot of my developer workspace, campus activities, and tech experiences.
          </p>
        </div>
      </div>

      {/* Plain Gallery Grid */}
      <div className="about-gallery__container about-gallery__container--grid">
        <AnimatePresence mode="popLayout">
          {DEFAULT_GALLERY_ITEMS.map((item, idx) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="about-gallery__card"
              onClick={() => setPreviewItem(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setPreviewItem(item);
              }}
            >
              {/* Image Frame */}
              <div className="about-gallery__image-box">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="about-gallery__img"
                  loading="lazy"
                />

                {/* Subtle Hover Action Overlay */}
                <div className="about-gallery__card-overlay">
                  <div className="about-gallery__card-actions">
                    <button
                      type="button"
                      className="about-gallery__action-btn"
                      onClick={() => setPreviewItem(item)}
                      title="View photo"
                      aria-label="View photo"
                    >
                      <i className="bx bx-expand-alt"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="about-gallery__card-content">
                <h4 className="about-gallery__card-title">{item.title}</h4>
                <div className="about-gallery__card-footer">
                  <span className="about-gallery__view-link">
                    View <i className="bx bx-right-arrow-alt"></i>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Photo preview */}
      <AnimatePresence>
        {previewItem && (
          <div className="about-gallery-modal-root" role="dialog" aria-modal="true">
            <motion.div
              className="about-gallery-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewItem(null)}
            />

            <motion.div
              className="about-gallery-viewer-card"
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            >
              {/* Header */}
              <div className="about-gallery-viewer-header">
                <h3 className="about-gallery-viewer-title">{previewItem.title}</h3>
                <button
                  type="button"
                  className="about-gallery-modal-close"
                  onClick={() => setPreviewItem(null)}
                  aria-label="Close preview"
                >
                  <i className="bx bx-x"></i>
                </button>
              </div>

              {/* Central Expanded Image */}
              <div className="about-gallery-viewer-img-wrap">
                <img
                  src={previewItem.imageUrl}
                  alt={previewItem.title}
                  className="about-gallery-viewer-img"
                />
              </div>

              {/* Action Bar */}
              <div className="about-gallery-viewer-footer">
                <div className="about-gallery-viewer-actions">
                  <a
                    href={previewItem.imageUrl}
                    download={`gallery-${previewItem.id}.jpg`}
                    className="about-gallery-viewer-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="bx bx-download"></i>
                    <span>Download</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
