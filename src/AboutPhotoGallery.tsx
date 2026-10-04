import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
}

const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'photo-1',
    title: 'Development Workstation',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80',
    description: 'My workstation setup optimized for responsive web development, testing, and continuous learning.',
  },
  {
    id: 'photo-2',
    title: 'Torres Capitol College (TCC) Lab',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80',
    description: 'Collaborative coding sessions, hands-on software labs, and lectures at TCC campus.',
  },
  {
    id: 'photo-3',
    title: 'Tech Hackathon & Sprint',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80',
    description: 'Intensive team sprints building practical software solutions within tight deadlines.',
  },
  {
    id: 'photo-4',
    title: 'Developer Seminars & Events',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80',
    description: 'Participating in IT seminars, modern web conferences, and peer tech presentations.',
  },
];

interface AboutPhotoGalleryProps {
  onToast?: (title: string, desc?: string, icon?: string) => void;
}

export const AboutPhotoGallery: React.FC<AboutPhotoGalleryProps> = ({ onToast }) => {
  const [items, setItems] = useState<GalleryItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('johndev_photo_gallery');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // If saved items contained the reverted it-week items, filter them out
          const cleaned = parsed.filter(
            (p: any) => p.id !== 'it-week-2025' && p.id !== 'it-week-2026'
          );
          if (cleaned.length > 0) {
            return cleaned;
          }
        } catch (_) {}
      }
    }
    return DEFAULT_GALLERY_ITEMS;
  });

  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);
  const [activeUploadId, setActiveUploadId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveItems = (updated: GalleryItem[]) => {
    setItems(updated);
    try {
      localStorage.setItem('johndev_photo_gallery', JSON.stringify(updated));
    } catch (_) {}
  };

  // Trigger file replacement for an existing item
  const handleTriggerReplace = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveUploadId(id);
    fileInputRef.current?.click();
  };

  // Handle file selected from disk
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeUploadId) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target?.result as string;
        if (base64) {
          const updated = items.map((item) =>
            item.id === activeUploadId ? { ...item, imageUrl: base64 } : item
          );
          saveItems(updated);
          onToast?.('Photo Updated!', 'Image updated successfully.', 'bx-check');
          if (previewItem && previewItem.id === activeUploadId) {
            setPreviewItem({ ...previewItem, imageUrl: base64 });
          }
        }
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
    setActiveUploadId(null);
  };

  // Drag & drop replacement directly onto a card
  const handleDropOnCard = (id: string, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target?.result as string;
        if (base64) {
          const updated = items.map((item) =>
            item.id === id ? { ...item, imageUrl: base64 } : item
          );
          saveItems(updated);
          onToast?.('Photo Updated!', 'Image replaced successfully.', 'bx-check');
          if (previewItem && previewItem.id === id) {
            setPreviewItem({ ...previewItem, imageUrl: base64 });
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="about-gallery">
      {/* Hidden file input for card replacement */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Clean Gallery Header */}
      <div className="about-gallery__header about-gallery__header--plain">
        <div className="about-gallery__headings">
          <span className="about-gallery__badge">
            <i className="bx bx-camera"></i> GALLERY
          </span>
          <h3 className="about-gallery__title">Moments & Highlights</h3>
          <p className="about-gallery__subtitle">
            A visual snapshot of my developer workspace, campus activities, and tech experiences.
          </p>
        </div>
      </div>

      {/* Plain Gallery Grid */}
      <div className="about-gallery__container about-gallery__container--grid">
        <AnimatePresence mode="popLayout">
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="about-gallery__card"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDropOnCard(item.id, e)}
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
                  <div
                    className="about-gallery__card-actions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      className="about-gallery__action-btn"
                      onClick={(e) => handleTriggerReplace(item.id, e)}
                      title="Replace this photo"
                      aria-label="Replace photo"
                    >
                      <i className="bx bx-camera"></i>
                      <span>Replace</span>
                    </button>
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
                {item.description && (
                  <p className="about-gallery__card-desc">{item.description}</p>
                )}
                <div className="about-gallery__card-footer">
                  <span className="about-gallery__drag-hint">
                    <i className="bx bx-upload"></i> Drag & drop to replace
                  </span>
                  <span className="about-gallery__view-link">
                    View <i className="bx bx-right-arrow-alt"></i>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ======================================================================
          PREVIEW MODAL (Viewing & Replacing individual card)
         ====================================================================== */}
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

              {/* Description & Action Bar */}
              <div className="about-gallery-viewer-footer">
                <p className="about-gallery-viewer-desc">
                  {previewItem.description || 'Captured moment in John Harold’s tech journey.'}
                </p>

                <div className="about-gallery-viewer-actions">
                  <button
                    type="button"
                    className="about-gallery-viewer-btn"
                    onClick={(e) => handleTriggerReplace(previewItem.id, e)}
                  >
                    <i className="bx bx-camera"></i>
                    <span>Replace Photo</span>
                  </button>

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
