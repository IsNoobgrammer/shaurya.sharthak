export interface Social {
  id: string;
  label: string;
  url: string;
  icon: string;
}

export const socials: Social[] = [
  {
    id: 'github',
    label: 'GitHub',
    url: 'https://github.com/IsNoobgrammer',
    icon: 'Code2',
  },
  {
    id: 'huggingface',
    label: 'HuggingFace',
    url: 'https://huggingface.co/fhai50032',
    icon: 'Bot',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    url: 'https://linkedin.com/in/shaurya-sharthak',
    icon: 'Link2',
  },
  {
    id: 'twitter',
    label: 'Twitter / X',
    url: 'https://x.com/ShauryaSharthak',
    icon: 'Link2',
  },
  {
    id: 'scholar',
    label: 'Scholar',
    url: 'https://scholar.google.com/citations?user=gw_oeN4AAAAJ',
    icon: 'GraduationCap',
  },
  {
    id: 'arxiv',
    label: 'arXiv',
    url: 'https://arxiv.org/search/cs?searchtype=author&query=Sharthak,+S',
    icon: 'FileText',
  },
  {
    id: 'tinycompany',
    label: 'Tinycompany-AI',
    url: 'https://github.com/Tinycompany-AI',
    icon: 'Code2',
  },
];

export const email = 'shauryajnvkkr@gmail.com';

export const resumeRoles = [
  { label: 'AI/ML Engineer', file: '/resumes/Shaurya_AI_ML_Resume.pdf' },
  { label: 'Data Scientist', file: '/resumes/Shaurya_Data_Scientist_Resume.pdf' },
  { label: 'NLP Research Scientist', file: '/resumes/Shaurya_Researcher_Resume.pdf' },
  { label: 'Python SWE', file: '/resumes/Shaurya_SWE_Resume.pdf' },
  { label: 'Cybersecurity', file: '/resumes/Shaurya_CyberSec_Resume.pdf' },
];
