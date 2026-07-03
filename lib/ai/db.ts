import { prisma, isPrismaEnabled, isMockDbEnabled } from '@/lib/prisma';
import * as mockDb from '@/lib/ai/mockDb';
import { AIMode } from '@prisma/client';

const mockAdapter = {
  userConversation: {
    findMany: async () => mockDb.getConversations(),
    findUnique: async ({ where }: { where?: { id?: string } }) =>
      where?.id ? mockDb.getConversation(where.id) : null,
    create: async ({ data }: { data?: { mode?: string; id?: string } }) =>
      mockDb.createConversation((data?.mode as AIMode | undefined) ?? AIMode.GENERAL, data?.id),
    update: async ({ where, data }: { where: { id: string }; data?: { title?: string } }) =>
      mockDb.updateConversationTitle(where.id, data?.title ?? 'New Chat'),
    delete: async ({ where }: { where: { id: string } }) => mockDb.deleteConversation(where.id),
    count: async () => (await mockDb.getConversations()).length,
  },
  message: {
    create: async ({ data }: { data: Parameters<typeof mockDb.createMessage>[0] }) =>
      mockDb.createMessage(data),
    findMany: async ({ where }: { where?: { conversationId?: string } }) =>
      mockDb.findMessages(where?.conversationId ?? ''),
    deleteMany: async ({ where }: { where?: { conversationId?: string } }) => {
      if (where?.conversationId) {
        return mockDb.deleteMessagesByConversation(where.conversationId);
      }

      return 0;
    },
    count: async () => {
      const conversations = await mockDb.getConversations();
      return conversations.reduce((sum, conversation) => sum + conversation.messages.length, 0);
    },
    groupBy: async () => [],
  },
  usageStats: {
    groupBy: async () => [],
  },
};

function getPrismaAdapter() {
  return {
    userConversation: prisma.userConversation,
    message: prisma.message,
    usageStats: prisma.aIUsageStats,
  };
}

export const db = new Proxy(
  {},
  {
    get(_target, prop) {
      if (isMockDbEnabled()) {
        return mockAdapter[prop as keyof typeof mockAdapter];
      }

      if (!isPrismaEnabled()) {
        throw new Error('Database is not configured and USE_MOCK_DB is not enabled.');
      }

      const adapter = getPrismaAdapter();
      return adapter[prop as keyof ReturnType<typeof getPrismaAdapter>];
    },
  }
) as ReturnType<typeof getPrismaAdapter>;

export default db;
