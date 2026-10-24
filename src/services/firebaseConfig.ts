/**
 * LIVE FIREBASE FIRESTORE, AUTH, STORAGE & ANALYTICS SERVICE
 * Project: parivartan-ka-daur-b5461
 *
 * Connects the application to live Firebase Cloud Firestore and Firebase Authentication
 * while maintaining instant localStorage caching/fallback so the newspaper portal works
 * seamlessly even if offline or before Firestore rules are opened.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  writeBatch,
  getDocFromServer,
} from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { Article, EPaperEdition, GrievanceSubmission } from '../types/newspaper';
import { INITIAL_ARTICLES, INITIAL_EPAPER_EDITIONS } from '../data/initialArticles';

export interface FirebaseCredentialsConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export const firebaseConfig: FirebaseCredentialsConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyB0BQwM430HkjjBajxwcaLM6blUYgaS-ng',
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'parivartan-ka-daur-b5461.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'parivartan-ka-daur-b5461',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    'parivartan-ka-daur-b5461.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '260542622532',
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID || '1:260542622532:web:2973e28f9aca5ff2e98511',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-91JQ2H4L8F',
};

// Initialize Firebase App singleton
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Initialize Analytics safely in browser environments
if (typeof window !== 'undefined') {
  isAnalyticsSupported()
    .then((supported) => {
      if (supported) {
        getAnalytics(app);
      }
    })
    .catch(() => {
      // Ignore analytics blockers in headless/privacy browsers
    });
}

export function isFirebaseConfigured(): boolean {
  return (
    Boolean(firebaseConfig.apiKey) &&
    firebaseConfig.apiKey !== 'YOUR_FIREBASE_API_KEY' &&
    !firebaseConfig.apiKey.startsWith('YOUR_')
  );
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function formatFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): FirestoreErrorInfo {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
    },
  };
  console.warn('Firestore Operation Diagnostic:', JSON.stringify(errInfo));
  return errInfo;
}

const STORAGE_KEYS = {
  ARTICLES: 'pkd_cms_articles_v1',
  EPAPER_EDITIONS: 'pkd_cms_epaper_editions_v1',
  GRIEVANCES: 'pkd_cms_grievances_v1',
  ADMIN_SESSION: 'pkd_cms_admin_session_v1',
};

const COLLECTIONS = {
  ARTICLES: 'articles',
  EPAPER_EDITIONS: 'epaper_editions',
  GRIEVANCES: 'grievances',
};

/**
 * Helper to remove undefined fields before writing to Firestore (Firestore rejects `undefined` values).
 */
function sanitizeForFirestore<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export type CloudSyncState = 'connecting' | 'connected' | 'permission-warning' | 'offline-cache';

export const newspaperDataService = {
  /**
   * Tests live connection to Firestore on boot.
   */
  async validateCloudConnection(): Promise<{ ok: boolean; message: string }> {
    try {
      await getDocFromServer(doc(db, '_health_check', 'ping'));
      return { ok: true, message: `Connected to Firestore (${firebaseConfig.projectId})` };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      if (msg.includes('Missing or insufficient permissions')) {
        // Permission denied still proves the client reached the live Firestore server!
        return {
          ok: true,
          message: `Connected to Firestore (${firebaseConfig.projectId}) — Rules active`,
        };
      }
      return { ok: false, message: msg };
    }
  },

  /**
   * Local cache getters for instant zero-latency first paint.
   */
  getArticles(): Article[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ARTICLES);
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(INITIAL_ARTICLES));
        return INITIAL_ARTICLES;
      }
      const parsed = JSON.parse(raw) as Article[];
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_ARTICLES;
    } catch {
      return INITIAL_ARTICLES;
    }
  },

  saveLocalArticles(articles: Article[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
    } catch (err) {
      console.error('Failed to persist articles to localStorage:', err);
    }
  },

  /**
   * Subscribes to real-time updates from Cloud Firestore `articles` collection.
   * Seeds initial articles automatically if the cloud collection is empty.
   */
  subscribeArticles(
    onUpdate: (articles: Article[], syncState: CloudSyncState, errorMsg?: string) => void
  ): () => void {
    const colRef = collection(db, COLLECTIONS.ARTICLES);
    let seededAttempted = false;

    const unsubscribe = onSnapshot(
      colRef,
      async (snapshot) => {
        if (snapshot.empty && !seededAttempted) {
          seededAttempted = true;
          try {
            const initial = this.getArticles();
            await this.syncAllArticlesToCloud(initial);
            onUpdate(initial, 'connected');
          } catch (seedErr) {
            const info = formatFirestoreError(seedErr, OperationType.WRITE, COLLECTIONS.ARTICLES);
            onUpdate(this.getArticles(), 'permission-warning', info.error);
          }
          return;
        }

        if (!snapshot.empty) {
          const cloudArticles = snapshot.docs
            .map((d) => d.data() as Article)
            .sort(
              (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
            );
          this.saveLocalArticles(cloudArticles);
          onUpdate(cloudArticles, 'connected');
        } else {
          onUpdate(this.getArticles(), 'connected');
        }
      },
      (error) => {
        const info = formatFirestoreError(error, OperationType.LIST, COLLECTIONS.ARTICLES);
        const isPerm = info.error.toLowerCase().includes('permission');
        onUpdate(
          this.getArticles(),
          isPerm ? 'permission-warning' : 'offline-cache',
          info.error
        );
      }
    );

    return unsubscribe;
  },

  /**
   * Saves a single article to Firestore + local cache.
   */
  async upsertArticleToCloud(article: Article, allArticles: Article[]): Promise<void> {
    this.saveLocalArticles(allArticles);
    try {
      const cleanArticle = sanitizeForFirestore(article);
      await setDoc(doc(db, COLLECTIONS.ARTICLES, article.id), cleanArticle, { merge: true });
    } catch (error) {
      formatFirestoreError(error, OperationType.WRITE, `${COLLECTIONS.ARTICLES}/${article.id}`);
      throw error;
    }
  },

  /**
   * Deletes a single article from Firestore + local cache.
   */
  async deleteArticleFromCloud(articleId: string, remainingArticles: Article[]): Promise<void> {
    this.saveLocalArticles(remainingArticles);
    try {
      await deleteDoc(doc(db, COLLECTIONS.ARTICLES, articleId));
    } catch (error) {
      formatFirestoreError(error, OperationType.DELETE, `${COLLECTIONS.ARTICLES}/${articleId}`);
      throw error;
    }
  },

  /**
   * Syncs an entire array of articles to Cloud Firestore using a batch write.
   */
  async syncAllArticlesToCloud(articles: Article[]): Promise<void> {
    this.saveLocalArticles(articles);
    try {
      const batch = writeBatch(db);
      for (const art of articles) {
        const ref = doc(db, COLLECTIONS.ARTICLES, art.id);
        batch.set(ref, sanitizeForFirestore(art), { merge: true });
      }
      await batch.commit();
    } catch (error) {
      formatFirestoreError(error, OperationType.WRITE, COLLECTIONS.ARTICLES);
      throw error;
    }
  },

  async resetDefaultArticles(): Promise<Article[]> {
    this.saveLocalArticles(INITIAL_ARTICLES);
    try {
      const existingDocs = await getDocs(collection(db, COLLECTIONS.ARTICLES));
      const batch = writeBatch(db);
      existingDocs.docs.forEach((d) => batch.delete(d.ref));
      INITIAL_ARTICLES.forEach((art) => {
        batch.set(doc(db, COLLECTIONS.ARTICLES, art.id), sanitizeForFirestore(art));
      });
      await batch.commit();
    } catch (error) {
      formatFirestoreError(error, OperationType.WRITE, COLLECTIONS.ARTICLES);
    }
    return INITIAL_ARTICLES;
  },

  /**
   * E-Paper Editions Local & Cloud Firestore Methods
   */
  getEPaperEditions(): EPaperEdition[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.EPAPER_EDITIONS);
      if (!raw) {
        localStorage.setItem(
          STORAGE_KEYS.EPAPER_EDITIONS,
          JSON.stringify(INITIAL_EPAPER_EDITIONS)
        );
        return INITIAL_EPAPER_EDITIONS;
      }
      const parsed = JSON.parse(raw) as EPaperEdition[];
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_EPAPER_EDITIONS;
    } catch {
      return INITIAL_EPAPER_EDITIONS;
    }
  },

  saveLocalEPaperEditions(editions: EPaperEdition[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.EPAPER_EDITIONS, JSON.stringify(editions));
    } catch (err) {
      console.error('Failed to persist E-Paper editions locally:', err);
    }
  },

  subscribeEPaperEditions(
    onUpdate: (editions: EPaperEdition[], syncState: CloudSyncState) => void
  ): () => void {
    const colRef = collection(db, COLLECTIONS.EPAPER_EDITIONS);
    let seededAttempted = false;

    const unsubscribe = onSnapshot(
      colRef,
      async (snapshot) => {
        if (snapshot.empty && !seededAttempted) {
          seededAttempted = true;
          try {
            const initial = this.getEPaperEditions();
            await this.syncAllEPaperEditionsToCloud(initial);
            onUpdate(initial, 'connected');
          } catch {
            onUpdate(this.getEPaperEditions(), 'permission-warning');
          }
          return;
        }

        if (!snapshot.empty) {
          const cloudEditions = snapshot.docs
            .map((d) => d.data() as EPaperEdition)
            .sort((a, b) => b.issueDate.localeCompare(a.issueDate));
          this.saveLocalEPaperEditions(cloudEditions);
          onUpdate(cloudEditions, 'connected');
        } else {
          onUpdate(this.getEPaperEditions(), 'connected');
        }
      },
      (error) => {
        formatFirestoreError(error, OperationType.LIST, COLLECTIONS.EPAPER_EDITIONS);
        onUpdate(this.getEPaperEditions(), 'offline-cache');
      }
    );

    return unsubscribe;
  },

  async syncAllEPaperEditionsToCloud(editions: EPaperEdition[]): Promise<void> {
    this.saveLocalEPaperEditions(editions);
    try {
      const batch = writeBatch(db);
      for (const ed of editions) {
        const ref = doc(db, COLLECTIONS.EPAPER_EDITIONS, ed.id);
        batch.set(ref, sanitizeForFirestore(ed), { merge: true });
      }
      await batch.commit();
    } catch (error) {
      formatFirestoreError(error, OperationType.WRITE, COLLECTIONS.EPAPER_EDITIONS);
      throw error;
    }
  },

  async upsertEPaperEditionToCloud(
    edition: EPaperEdition,
    allEditions: EPaperEdition[]
  ): Promise<void> {
    this.saveLocalEPaperEditions(allEditions);
    try {
      await setDoc(
        doc(db, COLLECTIONS.EPAPER_EDITIONS, edition.id),
        sanitizeForFirestore(edition),
        { merge: true }
      );
    } catch (error) {
      formatFirestoreError(
        error,
        OperationType.WRITE,
        `${COLLECTIONS.EPAPER_EDITIONS}/${edition.id}`
      );
      throw error;
    }
  },

  /**
   * Reader Grievance & News-Tip Submissions (Cloud Firestore + Local)
   */
  getGrievances(): GrievanceSubmission[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.GRIEVANCES);
      if (!raw) return [];
      return JSON.parse(raw) as GrievanceSubmission[];
    } catch {
      return [];
    }
  },

  async submitGrievance(
    submission: Omit<GrievanceSubmission, 'id' | 'createdAt' | 'status'>
  ): Promise<GrievanceSubmission> {
    const current = this.getGrievances();
    const record: GrievanceSubmission = {
      ...submission,
      id: `PKD-GRV-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      status: 'received',
    };
    const updated = [record, ...current];
    try {
      localStorage.setItem(STORAGE_KEYS.GRIEVANCES, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save grievance locally:', err);
    }

    try {
      await setDoc(
        doc(db, COLLECTIONS.GRIEVANCES, record.id),
        sanitizeForFirestore(record)
      );
    } catch (error) {
      formatFirestoreError(error, OperationType.CREATE, `${COLLECTIONS.GRIEVANCES}/${record.id}`);
    }

    return record;
  },

  /**
   * Firebase Authentication & Session Helpers
   */
  subscribeAuth(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  },

  async signInWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    this.setAdminAuthenticated(true);
    return result.user;
  },

  async signInOrRegisterAdminEmail(email: string, password: string): Promise<User> {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      this.setAdminAuthenticated(true);
      return res.user;
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || '';
      if (
        code === 'auth/user-not-found' ||
        code === 'auth/invalid-credential'
      ) {
        // Attempt to create the admin account if it doesn't exist yet
        const created = await createUserWithEmailAndPassword(auth, email, password);
        this.setAdminAuthenticated(true);
        return created.user;
      }
      throw err;
    }
  },

  async signOutAdmin(): Promise<void> {
    this.setAdminAuthenticated(false);
    try {
      await signOut(auth);
    } catch {
      // Ignore signout error
    }
  },

  isAdminAuthenticated(): boolean {
    try {
      return (
        Boolean(auth.currentUser) ||
        localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'authenticated'
      );
    } catch {
      return false;
    }
  },

  setAdminAuthenticated(authenticated: boolean): void {
    try {
      if (authenticated) {
        localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'authenticated');
      } else {
        localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
      }
    } catch {
      // Ignore storage error
    }
  },
};
