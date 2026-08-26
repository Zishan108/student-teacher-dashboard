import { useState } from 'react';
import Layout from '../../components/Layout';
import CourseGrid from './CourseGrid';
import MyGroups from './MyGroups';

const TABS = [
  { id: 'courses', label: 'My Courses' },
  { id: 'groups', label: 'My Groups' },
];

function StudentDashboard() {
  const [tab, setTab] = useState('courses');

  return (
    <Layout tabs={TABS} activeTab={tab} onTabChange={setTab} roleLabel="Student">
      {tab === 'courses' ? <CourseGrid /> : <MyGroups />}
    </Layout>
  );
}

export default StudentDashboard;