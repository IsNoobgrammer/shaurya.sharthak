import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const stats = [
  { value: '234', label: 'GitHub Stars', amber: true, suffix: '⭐' },
  { value: '4', label: 'Citations', amber: false, suffix: '' },
  { value: '155+', label: 'HF Models', amber: false, suffix: '' },
  { value: '54', label: 'Datasets', amber: false, suffix: '' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="about" className="section" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">About</h2>
          <p className="section-subtitle">The journey so far — and how it got weird.</p>
        </motion.div>

        <div className="about-grid">
          {/* Story */}
          <motion.div
            className="about-text"
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p>
              It started with <strong>anime downloaders</strong> on GitHub in September 2022.
              Genuinely — that was the first commit. By 2025, the same account had a{' '}
              <strong>first-author paper on arXiv</strong>, 155+ models on HuggingFace, and training
              infrastructure used by hundreds of researchers globally. Nobody planned any of this.
            </p>
            <p>
              I'm a <strong>Jawahar Navodaya Vidyalaya</strong> alumnus — India's residential school
              for gifted kids selected by national exam. That background gave me one core skill
              that <strong>Skill and Grit can make snails run</strong>. No GPU
              cluster, no lab, no supervisor. Just free TPUs, open-source tooling, and an
              unhealthy amount of caffeine.
            </p>
            <p>
              I founded <strong>Tinycompany-AI</strong> to build efficient multilingual models without
              the usual resource overhead. The research spans{' '}
              <strong>tokenizer transplantation</strong> (swapping vocabularies between models
              post-training), <strong>Indic NLP</strong> (Hindi, Hinglish, code-switching),
              <strong>RLHF/GRPO alignment</strong> and <strong>LLM Pre-Training</strong>  pipelines on TPU. The thesis is: you need compute to do frontier research — <strong>you need better algorithms to get those free compute.</strong>
            </p>
            <p>
              Before all of this, I was doing <strong>cybersecurity</strong> — penetration testing
              for MNCs, finding <strong>BOLA, IDORs and Broken Access Control</strong>  in systems handling
              millions of transactions. That adversarial lens still shapes how I think about model
              robustness, alignment, and red-teaming.
            </p>
            <p>
              Currently: running entropy minimization ablations , exploring whether
              modern RLHF recipes sacrifice too much{' '}
              <strong>model steerability</strong> for surface-level alignment. Also maintaining 54
              public datasets — because good data is still the moat that nobody talks about enough.
            </p>
            <p style={{ opacity: 0.65, fontSize: '0.82rem', fontStyle: 'italic' }}>
              Python automation → Cybersec →  ML infra → Published researcher.<br />
              The pipeline nobody expected.
            </p>
          </motion.div>

          {/* Stats grid */}
          <div className="stats-grid">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="glass-card stat-card"
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
              >
                <span
                  className="stat-number"
                  style={
                    stat.amber
                      ? {
                        background: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }
                      : undefined
                  }
                >
                  {stat.value}
                </span>
                <span className="stat-label">
                  {stat.suffix} {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
