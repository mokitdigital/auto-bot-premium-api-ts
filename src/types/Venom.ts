export interface Result {
  me: {
    id: {
      server: string;
      user: string;
      _serialized: string;
    };
    displayName: string | null;
    verifiedName: string;
    searchName: string | null;
    pushname: string | null;
    notifyName: string | null;
    isBusiness: boolean;
    formattedUser: string | null;
    tag: string;
    eurl: string;
    previewEurl: string;
    fullDirectPath: string;
    previewDirectPath: string;
    filehash: string;
    stale: boolean;
    eurlStale: boolean;
    timestamp: number;
    hostRetryCount: number;
    lastHostUsed: {
      hostname: string;
      ips: string[];
      type: string;
      class: string;
      downloadBuckets: string[];
      $1: object;
      $2: object;
      fallback: object;
      selectedBucket: number;
    };
    dataSource: string;
    description: string;
    categories: object[];
    profileOptions: {
      commerceExperience: string;
      cartEnabled: boolean;
    };
    email: string;
    website: object[];
    latitude: number;
    longitude: number;
    businessHours: {
      config: object;
      timezone: string;
    };
    address: string;
    fbPage: object;
    igProfessional: object;
    isProfileLinked: boolean;
    isProfileLocked: boolean;
    coverPhoto: string | null;
    automatedType: string;
    welcomeMsgProtocolMode: string;
    prompts: string | null;
    commandsDescription: string | null;
    commands: string | null;
  };
  to: {
    fromMe: boolean;
    remote: {
      server: string;
      user: string;
      _serialized: string;
    };
    id: string;
    _serialized: string;
  };
  erro: boolean;
  text: string;
  status: { messageSendResult: string };
}