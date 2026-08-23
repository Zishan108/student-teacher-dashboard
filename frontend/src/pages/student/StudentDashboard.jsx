import { useState } from 'react';
import Layout from '../../components/Layout';
import MyGroups from './MyGroups';
import Assignments from './Assignments';

const TABS = [
  { id: 'assignments', label: 'Assignments' },
  { id: 'groups', label: 'My Groups' },
];

function StudentDashboard() {
  const [tab, setTab] = useState('assignments');

  return (
    <Layout tabs={TABS} activeTab={tab} onTabChange={setTab} roleLabel="Student">
      {tab === 'assignments' ? <Assignments /> : <MyGroups />}
    </Layout>
  );
}

export default StudentDashboard;