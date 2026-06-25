export type SourceAuthority =
  | 'official-docs'
  | 'standard'
  | 'academic'
  | 'vendor-docs'
  | 'reference'
  | 'community';

type SourceMeta = {
  label: string;
  authority: SourceAuthority;
};

const officialHosts = [
  'docs.python.org',
  'developer.mozilla.org',
  'go.dev',
  'nodejs.org',
  'react.dev',
  'kubernetes.io',
  'docs.docker.com',
  'docs.github.com',
  'developers.openai.com',
  'docs.aws.amazon.com',
  'learn.microsoft.com',
  'cloud.google.com',
  'developers.cloudflare.com',
  'docs.oracle.com',
  'docs.nvidia.com',
  'rocm.docs.amd.com',
  'llvm.org',
  'gcc.gnu.org',
  'webassembly.org',
  'numpy.org',
  'pandas.pydata.org',
  'scikit-learn.org',
  'pytorch.org',
  'tensorflow.org',
  'docs.getdbt.com',
  'airflow.apache.org',
  'spark.apache.org',
  'prometheus.io',
  'opentelemetry.io',
  'redis.io',
  'postgresql.org',
  'dev.mysql.com',
  'rabbitmq.com',
  'docs.nats.io',
  'zookeeper.apache.org',
  'etcd.io',
  'hadoop.apache.org',
  'neo4j.com',
  'networkx.org',
  'fenicsproject.org',
  'www.code-aster.org',
];

const vendorHosts = [
  'elastic.co',
  'algolia.com',
  'meilisearch.com',
  'solr.apache.org',
  'grafana.com',
  'camunda.io',
  'temporal.io',
  'confluent.io',
  'huggingface.co',
  'docs.vllm.ai',
  'comsol.com',
  'ansys.com',
  'abaqus-docs.mit.edu',
];

const standardHosts = [
  'rfc-editor.org',
  'ietf.org',
  'w3.org',
  'oasis-open.org',
  'nist.gov',
  'csrc.nist.gov',
  'sre.google',
];

const academicHosts = [
  'arxiv.org',
  'icaci.org',
  'acm.org',
  'ieee.org',
  'springer.com',
  'sciencedirect.com',
  'nafems.org',
];

function hostMatches(hostname: string, candidates: string[]) {
  return candidates.some((candidate) => hostname === candidate || hostname.endsWith(`.${candidate}`));
}

export function classifySource(url?: string): SourceMeta {
  if (!url) return { label: 'No source', authority: 'reference' };

  try {
    const { hostname } = new URL(url);
    const host = hostname.replace(/^www\./, '');

    if (hostMatches(host, standardHosts)) return { label: 'Standard', authority: 'standard' };
    if (hostMatches(host, academicHosts)) return { label: 'Academic', authority: 'academic' };
    if (hostMatches(host, officialHosts)) return { label: 'Official docs', authority: 'official-docs' };
    if (hostMatches(host, vendorHosts)) return { label: 'Vendor docs', authority: 'vendor-docs' };
    if (hostMatches(host, ['wikipedia.org', 'cp-algorithms.com'])) return { label: 'Reference', authority: 'reference' };
    if (hostMatches(host, ['github.com', 'opensource.guide'])) return { label: 'Community', authority: 'community' };

    return { label: 'Reference', authority: 'reference' };
  } catch {
    return { label: 'Reference', authority: 'reference' };
  }
}
