import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Brain, Zap, Code2, Database, Shield, Terminal } from 'lucide-react';
import { skillCategories } from '../data/skills';

type IconComponent = React.FC<{ size?: number; className?: string }>;

const iconMap: Record<string, IconComponent> = {
  Brain,
  Zap,
  Code2,
  Database,
  Shield,
  Terminal,
};

// A flat, punchy set of keywords for the scrolling marquee band.
const marqueeItems = [
  'PyTorch/XLA', 'TPU v2-8', 'GSPMD', 'JAX/Flax', 'RLHF / GRPO', 'Tokenizer Design',
  'Supertoken Learning', 'Indic NLP', 'HuggingFace', 'Unsloth', 'FAISS', 'LangChain',
  'Distributed Training', 'Mixed Precision', 'FastAPI', 'React + TS', 'Docker',
  'OWASP Top 10', 'Pen Testing', 'PostgreSQL', 'Pandas / NumPy',
];

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="skills" className="section" style={{ background: 'color-mix(in srgb, var(--bg-secondary) 88%, transparent)' }} ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Skills</h2>
          <p className="section-subtitle">The toolkit.</p>
        </motion.div>

        {/* Auto-scrolling tech marquee */}
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span className="marquee-chip" key={i}>
                <span className="dot" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="skills-grid">
          {skillCategories.map((cat, i) => {
            const Icon: IconComponent = iconMap[cat.icon] ?? (Terminal as IconComponent);
            return (
              <motion.div
                key={cat.id}
                className="glass-card skill-category"
                data-tilt
                data-spotlight
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: i * 0.07 }}
              >
                <div className="skill-category-header">
                  <Icon size={18} className="skill-category-icon" />
                  <h3 className="skill-category-title">{cat.title}</h3>
                </div>
                <div className="skill-list">
                  {cat.skills.map((skill) => (
                    <span key={skill} className="skill-item">
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
