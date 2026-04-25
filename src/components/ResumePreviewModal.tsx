import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';

// pdf.js worker — use CDN to avoid bundling issues
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface ResumePreviewModalProps {
  open: boolean;
  file: string;
  label: string;
  downloadName?: string;
  onClose: () => void;
}

export default function ResumePreviewModal({ open, file, label, downloadName, onClose }: ResumePreviewModalProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [containerWidth, setContainerWidth] = useState(800);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Lock scroll + Escape key
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    setPageNumber(1);
    setLoading(true);
    setError(false);
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handler);
    };
  }, [open, onClose]);

  // Measure container width for responsive rendering
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(false);
  };

  const onDocumentLoadError = () => {
    setLoading(false);
    setError(true);
  };

  const prevPage = () => setPageNumber((p) => Math.max(1, p - 1));
  const nextPage = () => setPageNumber((p) => Math.min(numPages, p + 1));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="resume-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            className="resume-modal"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
          >
            {/* ── Top chrome bar ── */}
            <div className="resume-modal-header">
              <div className="resume-modal-header-left">
                <FileText size={15} style={{ color: 'var(--text-accent)' }} />
                <span className="resume-modal-title">{label}</span>
                <span className="resume-modal-badge">Preview</span>
              </div>
              <div className="resume-modal-header-actions">
                {/* Page navigation */}
                {numPages > 1 && (
                  <div className="resume-modal-pagination">
                    <button
                      className="resume-modal-page-btn"
                      onClick={prevPage}
                      disabled={pageNumber <= 1}
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <span className="resume-modal-page-info">
                      {pageNumber} / {numPages}
                    </span>
                    <button
                      className="resume-modal-page-btn"
                      onClick={nextPage}
                      disabled={pageNumber >= numPages}
                      aria-label="Next page"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                )}

                <a
                  href={file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resume-modal-action-btn"
                  title="Open in new tab"
                >
                  <ExternalLink size={14} />
                </a>
                <a
                  href={file}
                  download={downloadName || true}
                  className="resume-modal-action-btn resume-modal-download"
                  title="Download"
                >
                  <Download size={14} />
                  <span>Download</span>
                </a>
                <button
                  className="resume-modal-close"
                  onClick={onClose}
                  title="Close (Esc)"
                  aria-label="Close preview"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* ── PDF Canvas ── */}
            <div className="resume-modal-body" ref={containerRef}>
              {loading && (
                <div className="resume-modal-loading">
                  <div className="resume-modal-spinner" />
                  <span>Loading PDF…</span>
                </div>
              )}

              {error && (
                <div className="resume-modal-error">
                  <FileText size={40} style={{ color: 'var(--text-accent)', opacity: 0.4 }} />
                  <p>Could not load PDF preview.</p>
                  <a href={file} download={downloadName || true} className="btn btn-secondary" style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}>
                    <Download size={14} /> Download instead
                  </a>
                </div>
              )}

              {!error && (
                <Document
                  file={file}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading={null}
                  className="resume-modal-document"
                >
                  <Page
                    pageNumber={pageNumber}
                    width={Math.min(containerWidth - 48, 780)}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                    loading={null}
                    className="resume-modal-page"
                  />
                </Document>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
