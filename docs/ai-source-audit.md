# AI Source Audit

Last reviewed: 2026-06-25

The AI/model topics are useful but fast-moving. Treat this page as the maintenance trail for entries that should stay tied to primary or near-primary sources.

## Reviewed Areas

- AI / LLM Systems: OpenAI developer docs for retrieval, function calling, structured outputs, text generation, fine-tuning, and evals; NIST AI RMF for human-review/risk framing.
- Search / Retrieval: Lucene, Solr, Elasticsearch, and hybrid-search references for lexical search, index freshness, relevance evaluation, vector retrieval, hybrid retrieval, and reranking.
- Vector Search / Embeddings: official docs for FAISS, pgvector, Qdrant, Chroma, Weaviate, and Milvus; added index/retrieval decision guidance for exact scan, HNSW, IVFFlat, metadata filtering, chunking evals, and hybrid retrieval evals.
- LLM Memory / Context Systems: OpenAI text/retrieval docs plus LangGraph, Qdrant, Neo4j, and Pinecone references for short-term context, summaries, vector memory, graph memory, lifecycle/forgetting, provenance, and user-editable profile memory.
- Model Adaptation: Hugging Face PEFT docs for LoRA and quantization/QLoRA; Hugging Face Transformers training docs for full fine-tuning.
- Generative Media: Hugging Face Diffusers docs for diffusion pipelines, LoRA training, ControlNet, and inpainting.
- Vision / World Representation Models: Meta AI V-JEPA and V-JEPA 2 posts; VL-JEPA primary arXiv entry.
- AI / App Deployment & Serving: OpenAI developer overview for managed model APIs and vLLM docs for self-hosted inference.

## Maintenance Notes

- Prefer current official docs URLs over older redirecting links.
- Keep V-JEPA, V-JEPA 2, and VL-JEPA labeled as research/emerging unless production-ready tooling becomes standard.
- Keep LoRA/QLoRA described as adaptation techniques, not model families.
- Re-audit AI/model wording before using this catalog as authoritative deployment guidance.
- Treat RAG, memory, and agent guidance as decision support only; production choices should be validated against task-specific evals, privacy requirements, and cost/latency measurements.
