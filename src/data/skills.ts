export interface SkillCategory {
  id: string;
  icon: string;
  title: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'research-nlp',
    icon: 'Brain',
    title: 'Research & NLP',
    skills: [
      'Tokenizer Design',
      'Multilingual NLP',
      'RLHF / GRPO',
      'Supertoken Learning',
      'Cross-lingual Transfer',
      'Indic Language NLP',
      'LLM Fine-tuning',
      'arXiv Research',
    ],
  },
  {
    id: 'training-infra',
    icon: 'Zap',
    title: 'Training Infrastructure',
    skills: [
      'PyTorch/XLA (TPU v2-8)',
      'GSPMD Model Parallelism',
      'Memory-efficient Attention',
      'Distributed Training',
      'JAX/Flax',
      'Mixed Precision Training',
      'Gradient Checkpointing',
    ],
  },
  {
    id: 'frameworks',
    icon: 'Code2',
    title: 'Frameworks',
    skills: [
      'PyTorch (Expert)',
      'HuggingFace Transformers',
      'Datasets + PEFT',
      'LangChain',
      'React + TypeScript',
      'FastAPI',
      'Unsloth',
    ],
  },
  {
    id: 'data-databases',
    icon: 'Database',
    title: 'Data & Databases',
    skills: [
      'FAISS / Vector DBs',
      'PostgreSQL',
      'MongoDB',
      'HuggingFace Hub',
      'Graph DBs',
      'Data Pipelines',
      'Pandas / NumPy',
    ],
  },
  {
    id: 'devops-security',
    icon: 'Shield',
    title: 'DevOps & Security',
    skills: [
      'Docker',
      'Linux (Advanced)',
      'Git / GitHub',
      'OWASP Top 10',
      'Penetration Testing',
      'Web Application Security',
      'CI/CD Pipelines',
    ],
  },
  {
    id: 'languages',
    icon: 'Terminal',
    title: 'Languages',
    skills: ['Python (Expert)', 'TypeScript', 'JavaScript', 'Bash', 'SQL', 'C (basics)'],
  },
];
