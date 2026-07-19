import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';

import { buildSeedConversations } from '@/data/mock-conversations';

export type ChatRole = 'user' | 'assistant';

export type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  createdAt: number;
};

export type Conversation = {
  id: string;
  title: string;
  topicId?: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
};

type ConversationsContextValue = {
  /** Sorted by most recently updated. */
  conversations: Conversation[];
  getConversation: (id: string) => Conversation | undefined;
  /** Creates a conversation from the first user message and returns its id. */
  startConversation: (firstMessage: string, topicId?: string) => string;
  sendMessage: (conversationId: string, text: string) => void;
  /** Conversation id the mock assistant is currently "typing" in, if any. */
  typingIn: string | null;
  clearAll: () => void;
};

const ConversationsContext = createContext<ConversationsContextValue | undefined>(undefined);

function makeId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function makeTitle(text: string) {
  const clean = text.trim().replace(/\s+/g, ' ');
  return clean.length > 42 ? `${clean.slice(0, 42).trimEnd()}…` : clean;
}

const REPLY_TEMPLATES = [
  'That’s a common question, and the answer usually depends on your jurisdiction and the exact wording of any agreement involved.\n\nIn general terms:\n1. Start by reviewing any written contract or notice you received\n2. Check the statutory rules that apply where you live\n3. Keep dated records of every relevant communication\n\nThis is general information, not legal advice — for a decision with real consequences, consult a licensed lawyer.',
  'Here’s the general picture. The law in this area sets minimum protections, and contracts can add to — but usually not remove — those rights.\n\nWhat matters most:\n1. What was agreed in writing\n2. The timelines and notice requirements that apply\n3. Whether you’ve documented the key events\n\nTreat this as orientation rather than legal advice; a local lawyer can confirm how the rules apply to your case.',
  'Good question — outcomes here turn on the specific facts, but the framework is fairly consistent.\n\nTypically you’d look at:\n1. The relevant statute or regulation in your region\n2. Any deadlines for objecting or filing a claim\n3. Evidence: contracts, receipts, photos, and messages\n\nThis is general information, not legal advice. If the stakes are significant, a consultation with a qualified lawyer is worth it.',
];

let replyCursor = 0;
function generateMockReply(): string {
  const reply = REPLY_TEMPLATES[replyCursor % REPLY_TEMPLATES.length];
  replyCursor += 1;
  return reply;
}

const TYPING_DELAY_MS = 1800;

/**
 * In-memory conversation store. Simulates an assistant reply after a short
 * "typing" delay so the chat UX (typing indicator, entrance animations)
 * can be exercised before the real API is wired up.
 */
export function ConversationsProvider({ children }: PropsWithChildren) {
  const [conversations, setConversations] = useState<Conversation[]>(() => buildSeedConversations());
  const [typingIn, setTypingIn] = useState<string | null>(null);
  const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (replyTimer.current) clearTimeout(replyTimer.current);
    };
  }, []);

  const appendMessage = useCallback((conversationId: string, chatMessage: ChatMessage) => {
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              updatedAt: chatMessage.createdAt,
              messages: [...conversation.messages, chatMessage],
            }
          : conversation,
      ),
    );
  }, []);

  const scheduleReply = useCallback(
    (conversationId: string) => {
      if (replyTimer.current) clearTimeout(replyTimer.current);
      setTypingIn(conversationId);
      replyTimer.current = setTimeout(() => {
        appendMessage(conversationId, {
          id: makeId('m'),
          role: 'assistant',
          text: generateMockReply(),
          createdAt: Date.now(),
        });
        setTypingIn(null);
      }, TYPING_DELAY_MS);
    },
    [appendMessage],
  );

  const startConversation = useCallback(
    (firstMessage: string, topicId?: string) => {
      const now = Date.now();
      const id = makeId('c');
      const conversation: Conversation = {
        id,
        title: makeTitle(firstMessage),
        topicId,
        createdAt: now,
        updatedAt: now,
        messages: [{ id: makeId('m'), role: 'user', text: firstMessage.trim(), createdAt: now }],
      };
      setConversations((current) => [conversation, ...current]);
      scheduleReply(id);
      return id;
    },
    [scheduleReply],
  );

  const sendMessage = useCallback(
    (conversationId: string, text: string) => {
      appendMessage(conversationId, {
        id: makeId('m'),
        role: 'user',
        text: text.trim(),
        createdAt: Date.now(),
      });
      scheduleReply(conversationId);
    },
    [appendMessage, scheduleReply],
  );

  const clearAll = useCallback(() => {
    if (replyTimer.current) clearTimeout(replyTimer.current);
    setTypingIn(null);
    setConversations([]);
  }, []);

  const value = useMemo<ConversationsContextValue>(() => {
    const sorted = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt);
    return {
      conversations: sorted,
      getConversation: (id) => conversations.find((conversation) => conversation.id === id),
      startConversation,
      sendMessage,
      typingIn,
      clearAll,
    };
  }, [conversations, startConversation, sendMessage, typingIn, clearAll]);

  return <ConversationsContext.Provider value={value}>{children}</ConversationsContext.Provider>;
}

export function useConversations(): ConversationsContextValue {
  const context = useContext(ConversationsContext);
  if (!context) {
    throw new Error('useConversations must be used inside ConversationsProvider');
  }
  return context;
}
