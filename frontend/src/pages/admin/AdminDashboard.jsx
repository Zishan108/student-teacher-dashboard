import { useState } from 'react';
import Layout from '../../components/Layout';
import CreateAssignment from './CreateAssignment';
import Assignments from './Assignments';
import Analytics from './Analytics';

const TABS = [
  { id: 'create', label: 'Create Assignment' },
  { id: 'assignments', label: 'Assignments' },
  { id: 'analytics', label: 'Analytics' },
];

function AdminDashboard() {
  const [tab, setTab] = useState('create');
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <Layout tabs={TABS} activeTab={tab} onTabChange={setTab} roleLabel="Professor">
      {tab === 'create' && <CreateAssignment onCreated={() => setRefreshKey((k) => k + 1)} />}
      {tab === 'assignments' && <Assignments key={refreshKey} />}
      {tab === 'analytics' && <Analytics key={refreshKey} />}
    </Layout>
  );
}

export default AdminDashboard;