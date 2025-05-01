// sessionManager.js

export const userSessions: Map<string, any> = new Map ();
const SESSION_TIMEOUT = 5 * 60 * 1000;

export const createSession = (senderNumber: string) => {
  userSessions.set(senderNumber, { step: 1 });
};

export const updateSessionStep = (senderNumber: string, step: any) => {
  const session = userSessions.get(senderNumber);
  if (session) {
    session.step = step;
  }
};

export const resetSession = (senderNumber: string) => {
  userSessions.delete(senderNumber);
};

const clearInactiveSessions = () => {
  const now = Date.now ();
  userSessions.forEach ((session: { lastInteraction: number; }, senderNumber: string) => {
    if (now - session.lastInteraction > SESSION_TIMEOUT) {
      console.log (`⏳ Resetando sessão para ${senderNumber} por inatividade`);
      resetSession (senderNumber);
    }
  });
};

setInterval (clearInactiveSessions, 60 * 1000);


export const getSession = (senderNumber: string) => userSessions.get(senderNumber);
