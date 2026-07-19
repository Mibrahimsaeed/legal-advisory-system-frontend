import type { IconName } from '@/components/ui/icon';

export type LegalTopic = {
  id: string;
  title: string;
  icon: IconName;
  blurb: string;
  sampleQuestion: string;
};

export const LegalTopics: LegalTopic[] = [
  {
    id: 'employment',
    title: 'Employment',
    icon: 'briefcase',
    blurb: 'Contracts, dismissal & workplace rights',
    sampleQuestion: 'Can my employer fire me without notice?',
  },
  {
    id: 'tenancy',
    title: 'Tenancy',
    icon: 'key',
    blurb: 'Leases, deposits & eviction rules',
    sampleQuestion: 'Can my landlord raise the rent mid-lease?',
  },
  {
    id: 'family',
    title: 'Family',
    icon: 'family',
    blurb: 'Divorce, custody & inheritance',
    sampleQuestion: 'How is child custody decided after a divorce?',
  },
  {
    id: 'business',
    title: 'Business',
    icon: 'building',
    blurb: 'Company setup, contracts & disputes',
    sampleQuestion: 'What should a freelance contract include?',
  },
  {
    id: 'consumer',
    title: 'Consumer',
    icon: 'cart',
    blurb: 'Refunds, warranties & unfair terms',
    sampleQuestion: 'Am I entitled to a refund for faulty goods?',
  },
  {
    id: 'immigration',
    title: 'Immigration',
    icon: 'globe',
    blurb: 'Visas, residency & citizenship',
    sampleQuestion: 'What are the requirements for permanent residency?',
  },
];

export function getTopic(id: string | undefined): LegalTopic | undefined {
  return LegalTopics.find((topic) => topic.id === id);
}
