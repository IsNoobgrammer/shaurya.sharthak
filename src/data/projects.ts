export type ProjectCategory = 'Research' | 'Infrastructure' | 'Datasets' | 'Tokenizers' | 'Security' | 'Tools';

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category: ProjectCategory;
  stars?: number;
  forks?: number;
  platform: 'github' | 'huggingface';
  url: string;
  featured?: boolean;
}

export const projects: Project[] = [
  // ── Infrastructure ───────────────────────────────────────────
  {
    id: 'tpu-alignment',
    title: 'TPU Training Infrastructure',
    description:
      'End-to-end PyTorch/XLA training pipeline on Google TPU v2-8 pods. GSPMD model parallelism, custom memory-efficient attention, 35% HBM reduction. Enables 7B–14B model fine-tuning for free.',
    tags: ['PyTorch/XLA', 'TPU', 'GSPMD', 'Python', 'Distributed'],
    category: 'Infrastructure',
    stars: 234,
    forks: 27,
    platform: 'github',
    url: 'https://github.com/Locutusque/TPU-Alignment',
    featured: true,
  },
  {
    id: 'xla-trainer',
    title: 'XLA-Trainer',
    description:
      'Full training framework for TPU/XLA with custom GSPMD sharding, gradient accumulation, and mixed precision. Drop-in replacement for HuggingFace Trainer on Google TPUs.',
    tags: ['PyTorch/XLA', 'TPU', 'Trainer', 'Python'],
    category: 'Infrastructure',
    stars: 5,
    platform: 'github',
    url: 'https://github.com/IsNoobgrammer/XLA-Trainer',
  },
  {
    id: 'optimized-attention',
    title: 'Optimized Attention for TPU/XLA',
    description:
      'Drop-in Flash/Splash Attention equivalent for TPU/XLA. XLA graph-compatible, no custom CUDA kernels needed. Works with any PyTorch/XLA training loop.',
    tags: ['Flash Attention', 'XLA', 'TPU', 'Python', 'Kernels'],
    category: 'Infrastructure',
    platform: 'github',
    url: 'https://github.com/IsNoobgrammer/Optimized-Attention-Torch-XLA',
  },
  {
    id: 'pure-pytorch-optimizers',
    title: 'Pure PyTorch Optimizers',
    description:
      'Drop-in custom optimizers for PyTorch training pipelines. Implements novel optimization strategies including entropy-aware variants. Plug into any training loop with zero dependencies.',
    tags: ['PyTorch', 'Optimizers', 'Training', 'Python', 'Drop-in'],
    category: 'Infrastructure',
    platform: 'github',
    url: 'https://github.com/IsNoobgrammer',
  },
  // ── Research ─────────────────────────────────────────────────
  {
    id: 'tokenadapt',
    title: 'TokenAdapt',
    description:
      'Model-agnostic tokenizer transplant framework. ~2x improvement in zero-shot perplexity ratio via heuristic adaptation and supertoken learning. Lead author, arXiv published, 4 citations.',
    tags: ['NLP', 'Tokenizer', 'arXiv', 'Python', 'HuggingFace'],
    category: 'Research',
    stars: 14,
    forks: 5,
    platform: 'github',
    url: 'https://github.com/Tinycompany-AI/tokenadapt',
    featured: true,
  },
  {
    id: 'supertokenizer',
    title: 'SuperTokenizer',
    description:
      'Novel supertoken learning scheme. Probabilistic chunking with Gaussian distribution over chunk lengths — reduces sequence fragmentation and improves compression for cross-lingual transfer.',
    tags: ['Supertoken', 'Cross-lingual', 'NLP', 'Python', 'BPE'],
    category: 'Research',
    stars: 13,
    forks: 2,
    platform: 'github',
    url: 'https://github.com/Tinycompany-AI/SuperTokenizer',
  },
  {
    id: 'hybrid-rag',
    title: 'Hybrid RAG Pipeline',
    description:
      'Production-grade retrieval-augmented generation. TF-IDF + BM25 + vector similarity + Neo4j GraphDB + Redis KV cache → 45% hit-rate improvement at ResoluteAI.',
    tags: ['RAG', 'LangChain', 'FAISS', 'Neo4j', 'Redis'],
    category: 'Research',
    platform: 'github',
    url: 'https://github.com/IsNoobgrammer',
  },
  // ── Tokenizers ────────────────────────────────────────────────
  {
    id: 'qtk-81k',
    title: 'QTK-81K Tokenizer',
    description:
      '4x better Hindi tokenization than Phi-4 (100k vocab). Custom 81K BPE tokenizer trained on curated Indic corpus. Used in BiBo and Qwentify3 model series.',
    tags: ['Tokenizer', 'BPE', 'Hindi', 'Indic NLP', '81K vocab'],
    category: 'Tokenizers',
    platform: 'huggingface',
    url: 'https://huggingface.co/fhai50032/QTK-81K',
  },
  {
    id: 'adi-bun-128k',
    title: 'Adi-Bun-128K SuperToken Tokenizer',
    description:
      '128K vocabulary SuperToken tokenizer for the Tinycompany BiBo/Qwentify3 model series. Trained with probabilistic chunking and cross-lingual optimization.',
    tags: ['Tokenizer', 'SuperToken', 'Tinycompany', '128K vocab'],
    category: 'Tokenizers',
    platform: 'huggingface',
    url: 'https://huggingface.co/tinycompany/Adi-Bun-128K',
  },
  // ── Datasets ──────────────────────────────────────────────────
  {
    id: 'be-more-specific',
    title: 'Be-More-Specific-USER',
    description:
      '51K-row trilingual (EN/Hindi/Hinglish) dataset teaching LLMs to ask clarifying questions instead of hallucinating. First-of-its-kind clarification training dataset. 9 likes.',
    tags: ['Dataset', 'RLHF', 'Instruction Tuning', 'Hinglish', '51K rows'],
    category: 'Datasets',
    platform: 'huggingface',
    url: 'https://huggingface.co/datasets/fhai50032/Be-More-Specific-USER',
    featured: true,
  },
  {
    id: 'hq-math-pretrain',
    title: 'HQ-Math-Pretrain-3.5M',
    description:
      '3.5M row, 7.55 GB quality-filtered mathematical pretraining corpus. Powers math reasoning in Tinycompany BiBo models. 3 likes, 2 community discussions.',
    tags: ['Dataset', 'Math', 'Pretraining', '3.5M rows', '7.5 GB'],
    category: 'Datasets',
    platform: 'huggingface',
    url: 'https://huggingface.co/datasets/fhai50032/HQ-Math-Pretrain-3.5M',
  },
  {
    id: 'symptoms-disease',
    title: 'SymptomsDisease246k',
    description:
      '493K row symptoms-to-disease mapping dataset. Used to train downstream medical AI models. 14 likes, 53 downloads. Covers diagnostic query→response format.',
    tags: ['Dataset', 'Medical', '493K rows', 'Healthcare AI'],
    category: 'Datasets',
    platform: 'huggingface',
    url: 'https://huggingface.co/datasets/fhai50032/SymptomsDisease246k',
  },
  {
    id: 'hindi-base-dedup',
    title: 'Hindi-base-dedup-5M',
    description:
      '5 million deduplicated Hindi sentences for LLM pretraining. Massive Indic corpus for building Hindi-native language models from scratch.',
    tags: ['Dataset', 'Hindi', '5M rows', 'Indic NLP', 'Dedup'],
    category: 'Datasets',
    platform: 'huggingface',
    url: 'https://huggingface.co/datasets/fhai50032/Hindi-base-dedup-5M',
  },
  {
    id: 'instruct-godly-mix',
    title: 'Instruct-Godly-Mix (3.9M)',
    description:
      '3.94M row, 15.8 GB comprehensive instruction dataset. Flagship training mix for BiBo models. Multilingual, multi-domain. The kitchen sink of SFT data.',
    tags: ['Dataset', 'SFT', '3.9M rows', '15.8 GB', 'Multilingual'],
    category: 'Datasets',
    platform: 'huggingface',
    url: 'https://huggingface.co/datasets/tinycompany/Instruct-Godly-Mix',
  },
  {
    id: 'cot-r1-distill',
    title: 'Tiny-Short-R1-CoT-Distill (8.6M)',
    description:
      '8.6M row, 51 GB CoT distillation dataset. Filtered from glaiveai/reasoning-v1-20m for short chains (<2048 tokens). Powers reasoning in BiBo models. 3 likes.',
    tags: ['Dataset', 'CoT', '8.6M rows', '51 GB', 'Reasoning'],
    category: 'Datasets',
    platform: 'huggingface',
    url: 'https://huggingface.co/datasets/tinycompany/Tiny-Short-R1-CoT-Distill-HF-ChatML',
  },
  {
    id: 'gita-cot',
    title: 'Bhagavad Gita CoT Datasets',
    description:
      'Chain-of-thought reasoning applied to Bhagavad Gita philosophical concepts — in Hindi and Hinglish. Bridges ancient Sanskrit philosophy with modern LLM training techniques.',
    tags: ['Dataset', 'Hindi CoT', 'Hinglish', 'Philosophy', 'Gita'],
    category: 'Datasets',
    platform: 'huggingface',
    url: 'https://huggingface.co/datasets/fhai50032/Hindi-CoT-Gita',
  },
  {
    id: 'gpqa-thinking',
    title: 'GPQA-Verified-Thinking-O1',
    description:
      'GPQA benchmark solved with Gemini-2.0-Thinking. 64.65% accuracy, answers verified+rated (avg 8.05). Scientific reasoning chains for O1-style training. 354 downloads.',
    tags: ['Dataset', 'GPQA', 'O1-style', 'Reasoning', '354 downloads'],
    category: 'Datasets',
    platform: 'huggingface',
    url: 'https://huggingface.co/datasets/fhai50032/GPQA-Verified-Thinking-O1-Rated',
  },
  // ── Tools ─────────────────────────────────────────────────────
  {
    id: 'minhash-dedup',
    title: 'MinHash-LSH-DeDup',
    description:
      'Batched MinHash-LSH deduplication for large-scale datasets. Near-linear time complexity for billion-row corpora. Used to clean 5M+ row Hindi pretraining corpus.',
    tags: ['MinHash', 'LSH', 'Deduplication', 'Python', 'Big Data'],
    category: 'Tools',
    platform: 'github',
    url: 'https://github.com/IsNoobgrammer/MinHash-LSH-DeDup',
  },
  {
    id: 'anime-downloader',
    title: 'AnimeDownloader',
    description:
      'The origin. AnimePahe batch downloader that started the GitHub journey in 2022. Still gets occasional stars. Python + scraping — before "AI" was the goal.',
    tags: ['Python', 'Scraping', 'Automation', 'Origin Story'],
    category: 'Tools',
    stars: 5,
    forks: 6,
    platform: 'github',
    url: 'https://github.com/IsNoobgrammer/AnimeDownloader',
  },
  // ── Security ─────────────────────────────────────────────────
  {
    id: 'security-assessment',
    title: 'MNC Security Assessment',
    description:
      'Penetration testing for 3+ MNC web applications. Identified SQL injection, XSS, IDOR vulnerabilities in systems handling 2M+ transactions. Burp Suite + OWASP methodology.',
    tags: ['Cybersec', 'OWASP', 'Burp Suite', 'Pentest', 'SQL Injection'],
    category: 'Security',
    platform: 'github',
    url: 'https://github.com/IsNoobgrammer',
  },
];
