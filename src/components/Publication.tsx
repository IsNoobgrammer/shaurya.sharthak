import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ExternalLink, FileText, Star, Quote } from 'lucide-react';

export default function Publication() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="publication" className="section" style={{ background: 'var(--bg-secondary)' }} ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Publication</h2>
          <p className="section-subtitle">Peer-recognized research.</p>
        </motion.div>

        <motion.div
          className="glass-card publication-card"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <span className="pub-badge">
            <FileText size={12} />
            arXiv:2505.09738 · cs.CL
          </span>

          <h3 className="pub-title">
            Achieving Tokenizer Flexibility in Language Models through Heuristic Adaptation and
            Supertoken Learning
          </h3>

          <p className="pub-authors">
            <strong>Shaurya Sharthak</strong>, Vinayak Pahalwan, Adithya Kamath, Adarsh
            Shirawalmath
          </p>

          <div className="pub-highlight">
            <Quote size={14} />
            <span>
              ~2x improvement in zero-shot perplexity ratio vs. ReTok and TransTokenizer baselines.
            </span>
          </div>

          <p className="pub-description">
            Model-agnostic framework for transplanting tokenizers between language models without
            full retraining. Combines heuristic token mapping with a novel supertoken learning
            scheme to preserve downstream performance across zero-shot settings.
          </p>

          <div className="pub-metrics">
            <span className="pub-metric">
              <Star size={12} style={{ color: '#F59E0B' }} />
              <strong>4</strong>&nbsp;Citations
            </span>
            <span className="pub-metric">
              <Star size={12} style={{ color: '#F59E0B' }} />
              <strong>14</strong>&nbsp;GitHub Stars
            </span>
            <span className="pub-metric">May 2025</span>
          </div>

          <div className="pub-links">
            <a
              href="https://arxiv.org/abs/2505.09738"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              id="pub-read-paper"
            >
              <ExternalLink size={14} />
              Read Paper
            </a>
            <a
              href="https://github.com/IsNoobgrammer/TokenAdapt"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              id="pub-view-code"
            >
              <ExternalLink size={14} />
              View Code
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
