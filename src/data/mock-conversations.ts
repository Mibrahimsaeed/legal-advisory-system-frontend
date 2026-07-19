import type { ChatMessage, Conversation } from '@/providers/conversations-provider';

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

let seedCounter = 0;
function message(role: ChatMessage['role'], text: string, createdAt: number): ChatMessage {
  seedCounter += 1;
  return { id: `seed-${seedCounter}`, role, text, createdAt };
}

/** Demo conversations shown until a backend is connected. */
export function buildSeedConversations(now = Date.now()): Conversation[] {
  return [
    {
      id: 'c-employment-notice',
      title: 'Dismissal without notice',
      topicId: 'employment',
      createdAt: now - 3 * HOUR,
      updatedAt: now - 3 * HOUR + 2 * 60 * 1000,
      messages: [
        message('user', 'Can my employer fire me without notice?', now - 3 * HOUR),
        message(
          'assistant',
          'In most jurisdictions, that depends on your employment contract and local labour law. Immediate dismissal is usually reserved for serious misconduct; otherwise a notice period or payment in lieu is typically required.\n\nKey things to check:\n1. The termination clause in your contract\n2. Your statutory minimum notice period\n3. Whether a valid reason was given in writing\n\nThis is general information, not legal advice — an employment lawyer can assess your specific situation.',
          now - 3 * HOUR + 2 * 60 * 1000,
        ),
      ],
    },
    {
      id: 'c-tenancy-deposit',
      title: 'Landlord keeping my deposit',
      topicId: 'tenancy',
      createdAt: now - DAY,
      updatedAt: now - DAY + 4 * 60 * 1000,
      messages: [
        message('user', 'My landlord wants to keep my full deposit for repainting. Is that allowed?', now - DAY),
        message(
          'assistant',
          'Usually not for ordinary wear and tear. Repainting after several years of normal use is generally the landlord’s cost, while damage beyond normal use can justify deductions.\n\nIt strengthens your position if you have:\n1. A move-in inspection report or photos\n2. Receipts and an itemised list of deductions\n3. Written communication with the landlord\n\nThis is general information, not legal advice — a tenancy board or local lawyer can confirm the rules where you live.',
          now - DAY + 4 * 60 * 1000,
        ),
      ],
    },
    {
      id: 'c-business-freelance',
      title: 'Freelance contract essentials',
      topicId: 'business',
      createdAt: now - 3 * DAY,
      updatedAt: now - 3 * DAY + 5 * 60 * 1000,
      messages: [
        message('user', 'What should a freelance contract include?', now - 3 * DAY),
        message(
          'assistant',
          'A solid freelance agreement usually covers:\n1. Scope of work and deliverables\n2. Payment terms, schedule, and late fees\n3. Intellectual-property ownership and licensing\n4. Revisions, termination, and notice\n5. Confidentiality and liability limits\n\nPutting these in writing before starting work prevents most disputes. This is general information, not legal advice — have a lawyer review high-value contracts.',
          now - 3 * DAY + 5 * 60 * 1000,
        ),
      ],
    },
  ];
}
