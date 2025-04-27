interface Config {
  api: {
    baseUrl: string;
  };
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
  };
  stripe: {
    publicKey: string;
    secretKey: string;
  };
  maps: {
    apiKey: string;
  };
  security: {
    rateLimit: {
      windowMs: number;
      maxRequests: number;
    };
    jwtSecret: string;
    encryptionKey: string;
  };
  monitoring: {
    sentryDsn: string;
    loggingLevel: 'debug' | 'info' | 'warn' | 'error';
  };
}

const config: Config = {
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  },
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  },
  stripe: {
    publicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
    secretKey: import.meta.env.VITE_STRIPE_SECRET_KEY,
  },
  maps: {
    apiKey: import.meta.env.VITE_MAPS_API_KEY,
  },
  security: {
    rateLimit: {
      windowMs: parseInt(import.meta.env.VITE_RATE_LIMIT_WINDOW_MS || '900000', 10),
      maxRequests: parseInt(import.meta.env.VITE_RATE_LIMIT_MAX_REQUESTS || '100', 10),
    },
    jwtSecret: import.meta.env.VITE_JWT_SECRET,
    encryptionKey: import.meta.env.VITE_ENCRYPTION_KEY,
  },
  monitoring: {
    sentryDsn: import.meta.env.VITE_SENTRY_DSN,
    loggingLevel: (import.meta.env.VITE_LOGGING_LEVEL || 'info') as Config['monitoring']['loggingLevel'],
  },
};

export default config; 