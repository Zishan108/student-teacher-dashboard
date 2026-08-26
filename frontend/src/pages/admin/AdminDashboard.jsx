import { useState } from 'react';
import Layout from '../../components/Layout';
import CreateCourse from './CreateCourse';
import CreateAssignment from './CreateAssignment';
import Assignments from './Assignments';
import Analytics from './Analytics';

const TABS = [
  { id: 'courses', label: 'Courses' },
  { id: 'create', label: 'Create Assignment' },
  { id: 'assignments', label: 'Assignments' },
  { id: 'analytics', label: 'Analytics' },
];

function AdminDashboard() {
  const [tab, setTab] = useState('courses');
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <Layout tabs={TABS} activeTab={tab} onTabChange={setTab} roleLabel="Professor">
      {tab === 'courses' && <CreateCourse />}
      {tab === 'create' && <CreateAssignment onCreated={() => setRefreshKey((k) => k + 1)} />}
      {tab === 'assignments' && <Assignments key={refreshKey} />}
      {tab === 'analytics' && <Analytics key={refreshKey} />}
    </Layout>
  );
}

export default AdminDashboard;