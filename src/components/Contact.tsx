import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link2, Code2, GraduationCap, FileText, Bot, Mail } from 'lucide-react';

import { socials, email } from '../data/socials';
import Magnetic from './Magnetic';

type IconComponent = React.FC<{ size?: number; className?: string }>;

const iconMap: Record<string, IconComponent> = {
  Code2,
  Link2,
  GraduationCap,
  FileText,
  Bot,
};



export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="contact" className="section" style={{ background: 'color-mix(in srgb, var(--bg-secondary) 88%, transparent)' }} ref={ref}>
      <div className="container">
        <motion.div
          className="contact-content"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Get in Touch</h2>
          <p className="section-subtitle" style={{ marginBottom: '1rem' }}>
            Looking for research internships and ML engineering roles.
          </p>
          <p className="contact-text">
            Let's build something meaningful.
          </p>

          <div className="social-links">
            {socials.map((s, i) => {
              const Icon: IconComponent = iconMap[s.icon] ?? (Mail as IconComponent);

              return (
                <motion.a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  id={`social-${s.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.1 + i * 0.06 }}
                >
                  <Icon size={15} />
                  {s.label}
                </motion.a>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
            style={{ display: 'inline-block' }}
          >
            <Magnetic strength={0.45}>
              <a
                href={`mailto:${email}`}
                className="btn btn-primary"
                id="contact-email-btn"
                style={{ display: 'inline-flex', gap: '0.5rem' }}
              >
                <Mail size={16} />
                Say Hello →
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
