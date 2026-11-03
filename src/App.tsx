import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { AuthModals } from './components/auth/AuthModals';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { OverviewPage } from './pages/OverviewPage';
import { DatasetPage } from './pages/DatasetPage';
import { EdaPage } from './pages/EdaPage';
import { TrainingPage } from './pages/TrainingPage';
import { EvaluationPage } from './pages/EvaluationPage';
import { PredictionPage } from './pages/PredictionPage';
import { RiskPage } from './pages/RiskPage';
import { ClusteringPage } from './pages/ClusteringPage';
import { XaiPage } from './pages/XaiPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { RecordsPage } from './pages/RecordsPage';
import { ReportsPage } from './pages/ReportsPage';
import { TestingPage } from './pages/TestingPage';

const AppContent: React.FC = () => {
  const { currentPage } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderActivePage = () => {
    switch (currentPage) {
      case 'overview':
        return <OverviewPage />;
      case 'dataset':
        return <DatasetPage />;
      case 'eda':
        return <EdaPage />;
      case 'training':
        return <TrainingPage />;
      case 'evaluation':
        return <EvaluationPage />;
      case 'prediction':
        return <PredictionPage />;
      case 'risk':
        return <RiskPage />;
      case 'clustering':
        return <ClusteringPage />;
      case 'xai':
        return <XaiPage />;
      case 'recommendations':
        return <RecommendationsPage />;
      case 'records':
        return <RecordsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'testing':
        return <TestingPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#10091F] bg-purple-radial text-[#F5F3FF] flex flex-col font-sans transition-colors duration-200">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header sidebarCollapsed={sidebarCollapsed} />

        <main
          className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 ${
            sidebarCollapsed ? 'ml-20' : 'ml-72'
          }`}
        >
          <div className="max-w-7xl mx-auto w-full">
            {renderActivePage()}
          </div>
        </main>
      </div>
      <AuthModals />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}
