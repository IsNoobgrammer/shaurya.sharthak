export type ProjectCategory = 'Research' | 'Infrastructure' | 'Datasets' | 'Tokenizers' | 'Security' | 'Tools';

export interface Project {
  id: string;
  title: string;
  description: string;
  details?: string;
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
    details:
      'Built from scratch to solve a concrete problem: fine-tuning 7B–14B models on zero budget. The pipeline runs on Google TPU v2-8 pods via the TRC program and uses PyTorch/XLA with GSPMD (General Sharded Parallel Mode) for model parallelism. The custom memory-efficient attention implementation is XLA-graph-compatible — no custom CUDA kernels, no tracing issues. Achieved a 35% reduction in HBM usage compared to baseline Megatron-style approaches, making it feasible to run full-parameter SFT runs that would otherwise OOM. The real win is that this unlocks free large-model training for researchers without institutional compute.',
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
    details:
      'The HuggingFace Trainer is fundamentally CUDA-first and breaks in non-trivial ways on XLA. XLA-Trainer fixes this by reimplementing the training loop with proper XLA static graph semantics. Supports gradient accumulation (tricky on TPU due to step-level compilation), mixed precision (bfloat16 native on TPU), and GSPMD-based model/data parallelism. The goal was a clean interface: swap out `Trainer` for `XLATrainer` and everything else stays the same. Used internally for BiBo model training runs.',
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
    details:
      'Flash Attention was a CUDA breakthrough — but it simply does not exist for XLA. Google\'s own Splash Attention has severe usability constraints. This implementation achieves similar memory savings through XLA-native chunked attention with careful operator ordering to avoid graph recompilation. The key insight: XLA\'s compiler is extremely sensitive to control flow and dynamic shapes, so the attention kernel is written entirely in terms of static ops. Tested on TPU v2-8 and v3-8 with models up to 7B parameters.',
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
    details:
      'Standard optimizers like AdamW work well but leave performance on the table for LLM training. This library implements entropy-aware optimizer variants that adapt learning rate scaling based on gradient entropy — useful for training instability situations common in MoE and cross-lingual models. Pure PyTorch means no Triton, no CUDA extensions, works on CPU/GPU/TPU. Designed as a research sandbox: easy to modify and experiment with optimizer math without build complexity.',
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
    details:
      'TokenAdapt solves the tokenizer mismatch problem: when you want to take a model trained on tokenizer A and make it work well with tokenizer B (e.g., adding Hindi support to a Qwen model). Naive embedding initialization gives terrible zero-shot performance. TokenAdapt uses heuristic subword composition — mapping new tokens to weighted combinations of old token embeddings — combined with a supertoken learning phase that trains compact multi-token representations. This achieves ~2x better zero-shot perplexity ratio compared to random initialization. Published on arXiv, 4 citations so far. The framework is model-agnostic: works with any HuggingFace-compatible architecture.',
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
    details:
      'Standard BPE tokenizers create uneven token boundaries — especially harmful for morphologically rich languages like Hindi where a single semantic unit might be split into 3–5 subwords. SuperTokenizer introduces probabilistic chunking: chunk boundaries are sampled from a Gaussian distribution over length, creating multi-token "super" units that the model learns holistic representations for. This reduces effective sequence length and improves cross-lingual transfer by aligning representation granularity across languages. The QTK-81K and Adi-Bun-128K tokenizers are both trained using this scheme.',
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
    details:
      'Built for ResoluteAI\'s production document QA system. The pipeline layers four retrieval signals: TF-IDF for exact term matching, BM25 for statistical relevance, FAISS vector search for semantic similarity, and Neo4j graph traversal for entity-linked documents. Redis acts as a KV cache for hot document chunks, dramatically cutting latency on repeated queries. The 45% hit-rate improvement over the previous single-retriever system came primarily from the graph layer catching entity co-references that dense retrieval missed entirely. Handles multi-hop questions by chaining graph hops before the final LLM generation step.',
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
    details:
      'Phi-4 with its 100K vocabulary tokenizes Hindi at roughly 4 tokens per Hindi word — a compression disaster for an already resource-constrained setup. QTK-81K was trained on a curated Hindi corpus with aggressive deduplication and domain balancing (news, literature, conversational, technical). At 81K vocab, it achieves ~1 token per Hindi word for common vocabulary, making fine-tuning on Hindi data roughly 4x more compute-efficient. Used as the base tokenizer for the BiBo and Qwentify3 model series.',
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
    details:
      'The flagship tokenizer for Tinycompany\'s model line. 128K vocabulary covers English, Hindi, Hinglish, and key technical domains (code, math, science). Trained using the SuperTokenizer probabilistic chunking scheme for better morphological coverage. Cross-lingual optimization ensures that semantically equivalent Hindi/English phrases map to similarly structured token sequences — which matters significantly for multilingual SFT training. Adi-Bun-128K is a drop-in replacement for Qwen2.5\'s tokenizer in the Tinycompany stack.',
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
    details:
      'Most LLMs hallucinate an answer when a query is ambiguous rather than asking for clarification. This dataset directly targets that failure mode: 51K rows of ambiguous user queries paired with model responses that ask targeted clarifying questions instead of guessing. Coverage spans English, Hindi, and Hinglish — making it one of the only such datasets for Indic-language clarification behavior. Generated with careful prompt engineering and filtered for quality. 9 community likes, used as a component in BiBo\'s SFT mix.',
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
    details:
      'Mathematical reasoning in small models requires high-quality pretraining data, not just SFT. This corpus aggregates 3.5M rows from competition math, textbook derivations, and step-by-step solutions — then applies perplexity filtering and format normalization to remove low-quality or inconsistently formatted examples. At 7.55 GB, it\'s large enough to meaningfully shift math capability in a continual pretraining run. Powers math reasoning in the BiBo model series.',
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
    details:
      'A structured medical dataset mapping symptom clusters to probable diagnoses in a conversational query→response format. 493K rows covering hundreds of conditions with symptom descriptions, differential considerations, and final diagnosis. Designed for fine-tuning LLMs on medical diagnostic reasoning — not for production medical use, but as a training signal for systems that need domain familiarity. 14 likes and 53 downloads indicate meaningful community adoption.',
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
    details:
      'Building Hindi-native language models requires large, clean Hindi pretraining corpora — which barely exist in HuggingFace-ready form. This dataset provides 5 million deduplicated Hindi sentences drawn from news, web crawls, and literature sources. Deduplication was performed using MinHash-LSH (see the MinHash-LSH-DeDup tool) at Jaccard similarity threshold 0.8, removing roughly 30% of raw data as near-duplicates. Used as the pretraining base for Hindi-native experiments in the Tinycompany stack.',
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
    details:
      'The flagship SFT dataset for Tinycompany\'s BiBo model series. 3.94M rows spanning multilingual instruction following (EN/Hindi/Hinglish), code, math, reasoning, clarification, and general knowledge domains. Assembled from dozens of source datasets with careful mixing ratios tuned to avoid capability collapse in any single domain. At 15.8 GB it\'s one of the larger open multilingual SFT datasets available. The "godly mix" name reflects the kitchen-sink philosophy: cover everything well, let the model figure out the rest.',
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
    details:
      'Chain-of-thought distillation from large reasoning models has become a standard technique, but the source datasets are often polluted with extremely long reasoning chains that are impractical to train on at small scale. This dataset filters glaiveai/reasoning-v1-20m down to examples with CoT chains under 2048 tokens — keeping the reasoning quality while making the training compute tractable. 8.6M rows, 51 GB. The short-chain constraint actually improves training stability and reduces the risk of the model learning to "ramble" in CoT mode.',
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
    details:
      'A personal project born from the portfolio\'s Gita-inspired design philosophy. The Bhagavad Gita contains complex philosophical arguments — karma, dharma, self, duty — that require multi-step reasoning to interpret. This dataset applies CoT formatting to Gita verses and their philosophical implications, in both Hindi and Hinglish. It serves dual purposes: a small but high-quality reasoning dataset, and a proof-of-concept that culturally-specific knowledge can be encoded in modern LLM training formats without losing depth.',
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
    details:
      'GPQA (Graduate-Level Google-Proof Q&A) is a benchmark of expert-level science questions that require genuine reasoning, not fact retrieval. This dataset runs the full GPQA benchmark through Gemini-2.0-Thinking and captures the extended reasoning chains — then manually verifies and quality-rates the outputs (average score 8.05/10). 64.65% accuracy on a benchmark that stumps most frontier models. 354 community downloads suggests this is being used actively for O1-style training. The verified-and-rated format makes it immediately usable as preference data.',
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
    details:
      'Exact deduplication at billion-row scale is computationally intractable. MinHash-LSH approximates Jaccard similarity with tunable accuracy and runs in near-linear time through locality-sensitive hashing. This implementation is specifically optimized for text datasets with batched processing, memory-mapped storage, and configurable band/row parameters for precision/recall tradeoffs. Used directly to produce Hindi-base-dedup-5M — reduced a raw 7M row corpus to 5M through aggressive near-duplicate removal at 0.8 Jaccard threshold.',
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
    details:
      'This is where the GitHub profile started. 2022, before ML was the plan. AnimePahe had no batch download functionality — annoying if you wanted to grab an entire season. Built a Python scraper with session handling, rate limiting, and batch queue management. It worked well enough that people kept finding it and starring it. Five stars and six forks four years later is a small number, but this was the first time code I wrote solved a problem for someone else. That felt significant at the time.',
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
    details:
      'Conducted black-box and grey-box penetration tests for three mid-to-large enterprise web applications in the fintech and logistics space — systems collectively handling over 2 million transactions. Using Burp Suite Pro with OWASP testing methodology, identified critical SQL injection vulnerabilities (including blind time-based), reflected and stored XSS, and IDOR flaws that allowed unauthorized access to other users\' transaction records. Full responsible disclosure reports delivered to client security teams, all critical findings patched within 30 days. The IDOR findings were the most impactful — transaction-level access control failures at this scale have real financial and regulatory consequences.',
    tags: ['Cybersec', 'OWASP', 'Burp Suite', 'Pentest', 'SQL Injection'],
    category: 'Security',
    platform: 'github',
    url: 'https://github.com/IsNoobgrammer',
  },
];
