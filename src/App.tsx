import { useEffect, useMemo, useState } from 'react';
import { User } from 'firebase/auth';
import {
  ActiveRoute,
  Article,
  CategoryId,
  EPaperEdition,
} from './types/newspaper';
import {
  CloudSyncState,
  newspaperDataService,
} from './services/firebaseConfig';
import { filterArticles } from './utils/seoAndNewsLogic';
import { SEOHead } from './components/SEOHead';
import { HeaderMasthead } from './components/HeaderMasthead';
import { HomePortalView } from './components/HomePortalView';
import { SingleArticleView } from './components/SingleArticleView';
import { EPaperPortalView } from './components/EPaperPortalView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { TrustComplianceView } from './components/TrustComplianceView';
import { Footer } from './components/Footer';

function parseRouteFromUrl(): ActiveRoute {
  if (typeof window === 'undefined') {
    return { view: 'home', category: 'all' };
  }
  const path = window.location.pathname.toLowerCase();
  const params = new URLSearchParams(window.location.search);

  const articleSlug = params.get('article');
  if (articleSlug) {
    return { view: 'article', slug: articleSlug };
  }

  const trustPage = params.get('trust') as
    | 'about'
    | 'editorial-policy'
    | 'corrections-policy'
    | 'privacy-terms'
    | 'contact-grievance'
    | null;
  if (trustPage) {
    return { view: 'trust', page: trustPage };
  }

  const viewParam = params.get('view');
  if (viewParam === 'epaper' || path === '/epaper') {
    return { view: 'epaper', editionId: params.get('edition') || undefined };
  }
  if (viewParam === 'admin' || path === '/admin') {
    return { view: 'admin' };
  }

  const categoryParam = params.get('category') as CategoryId | null;
  if (categoryParam) {
    return { view: 'home', category: categoryParam };
  }

  return { view: 'home', category: 'all' };
}

export default function App() {
  const [articles, setArticles] = useState<Article[]>(() =>
    newspaperDataService.getArticles()
  );
  const [epaperEditions, setEpaperEditions] = useState<EPaperEdition[]>(() =>
    newspaperDataService.getEPaperEditions()
  );
  const [isAdminAuth, setIsAdminAuth] = useState<boolean>(() =>
    newspaperDataService.isAdminAuthenticated()
  );
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [cloudSyncState, setCloudSyncState] =
    useState<CloudSyncState>('connecting');
  const [cloudErrorMsg, setCloudErrorMsg] = useState<string | undefined>(
    undefined
  );

  const [route, setRoute] = useState<ActiveRoute>(() => parseRouteFromUrl());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [fontSizeScale, setFontSizeScale] = useState<'sm' | 'base' | 'lg'>('base');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Subscribe to live Firebase Auth & Firestore real-time collections on mount
  useEffect(() => {
    newspaperDataService.validateCloudConnection();

    const unsubAuth = newspaperDataService.subscribeAuth((user) => {
      setFirebaseUser(user);
      if (user) {
        setIsAdminAuth(true);
      }
    });

    const unsubArticles = newspaperDataService.subscribeArticles(
      (liveArticles, syncState, errMsg) => {
        setArticles(liveArticles);
        setCloudSyncState(syncState);
        setCloudErrorMsg(errMsg);
      }
    );

    const unsubEPaper = newspaperDataService.subscribeEPaperEditions(
      (liveEditions) => {
        setEpaperEditions(liveEditions);
      }
    );

    return () => {
      unsubAuth();
      unsubArticles();
      unsubEPaper();
    };
  }, []);

  useEffect(() => {
    const onPopState = () => {
      setRoute(parseRouteFromUrl());
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const rootEl = document.documentElement;
    if (darkMode) {
      rootEl.classList.add('dark');
    } else {
      rootEl.classList.remove('dark');
    }
  }, [darkMode]);

  const handleNavigate = (nextRoute: ActiveRoute) => {
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const url = new URL(window.location.href);
      url.pathname = '/';
      url.search = '';
      if (nextRoute.view === 'article') {
        url.searchParams.set('article', nextRoute.slug);
      } else if (nextRoute.view === 'epaper') {
        url.searchParams.set('view', 'epaper');
        if (nextRoute.editionId) {
          url.searchParams.set('edition', nextRoute.editionId);
        }
      } else if (nextRoute.view === 'admin') {
        url.searchParams.set('view', 'admin');
      } else if (nextRoute.view === 'trust') {
        url.searchParams.set('trust', nextRoute.page);
      } else if (nextRoute.view === 'home' && nextRoute.category !== 'all') {
        url.searchParams.set('category', nextRoute.category);
      }
      window.history.pushState({}, '', url.toString());
    } catch {
      // Ignore history errors in sandboxed iframes
    }
  };

  const handleSaveArticles = (updated: Article[]) => {
    setArticles(updated);
    newspaperDataService.saveLocalArticles(updated);
  };

  const handleResetArticles = async () => {
    const defaults = await newspaperDataService.resetDefaultArticles();
    setArticles(defaults);
  };

  const handleSaveEPaperEditions = (updated: EPaperEdition[]) => {
    setEpaperEditions(updated);
    newspaperDataService.saveLocalEPaperEditions(updated);
  };

  const handleAdminAuthChange = (authenticated: boolean) => {
    setIsAdminAuth(authenticated);
    newspaperDataService.setAdminAuthenticated(authenticated);
  };

  const breakingArticles = useMemo(
    () => articles.filter((a) => a.isBreaking),
    [articles]
  );

  const selectedCategory: CategoryId =
    route.view === 'home' ? route.category : 'all';

  const filteredArticles = useMemo(
    () => filterArticles(articles, selectedCategory, searchQuery),
    [articles, selectedCategory, searchQuery]
  );

  const activeArticle = useMemo(() => {
    if (route.view !== 'article') return null;
    return (
      articles.find((a) => a.slug === route.slug) || articles[0] || null
    );
  }, [route, articles]);

  const fontSizeClass =
    fontSizeScale === 'sm'
      ? 'text-[14px]'
      : fontSizeScale === 'lg'
      ? 'text-[18px]'
      : 'text-[16px]';

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#FBF9F5] dark:bg-stone-950 text-[#1C1917] dark:text-stone-100 transition-colors ${fontSizeClass}`}
    >
      {/* Dynamic Google Search & Google News SEO Head + JSON-LD Schema Engine */}
      <SEOHead route={route} activeArticle={activeArticle} />

      {/* Top Utility Bar, Classic Broadsheet Masthead, Breaking Ticker & Sticky Nav */}
      <HeaderMasthead
        route={route}
        onNavigate={handleNavigate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        fontSizeScale={fontSizeScale}
        onFontSizeChange={setFontSizeScale}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((d) => !d)}
        breakingArticles={breakingArticles}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {route.view === 'home' && (
          <HomePortalView
            articles={filteredArticles}
            allArticles={articles}
            selectedCategory={route.category}
            searchQuery={searchQuery}
            onClearFilters={() => {
              setSearchQuery('');
              handleNavigate({ view: 'home', category: 'all' });
            }}
            onNavigate={handleNavigate}
            latestEPaper={epaperEditions[0]}
          />
        )}

        {route.view === 'article' && activeArticle && (
          <SingleArticleView
            article={activeArticle}
            relatedArticles={articles.filter((a) => a.id !== activeArticle.id)}
            onNavigate={handleNavigate}
          />
        )}

        {route.view === 'epaper' && (
          <EPaperPortalView
            editions={epaperEditions}
            initialEditionId={route.editionId}
            onNavigate={handleNavigate}
          />
        )}

        {route.view === 'admin' && (
          <AdminDashboardView
            articles={articles}
            onSaveArticles={handleSaveArticles}
            onResetArticles={handleResetArticles}
            epaperEditions={epaperEditions}
            onSaveEPaperEditions={handleSaveEPaperEditions}
            isAuthenticated={isAdminAuth}
            onAuthChange={handleAdminAuthChange}
            onNavigate={handleNavigate}
            cloudSyncState={cloudSyncState}
            cloudErrorMsg={cloudErrorMsg}
            firebaseUser={firebaseUser}
          />
        )}

        {route.view === 'trust' && (
          <TrustComplianceView
            page={route.page}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Newspaper Footer with Mandatory Google News Trust Links & Admin Login */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
