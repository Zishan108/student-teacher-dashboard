import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getTaughtCourses, getCourseAnalytics } from '../../api/courses';
import Skeleton from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';

function Analytics() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [analytics, setAnalytics] = useState([]);
  const [studentCount, setStudentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  useEffect(() => {
    getTaughtCourses()
      .then((res) => {
        setCourses(res.data.courses);
        if (res.data.courses.length > 0) {
          setSelectedCourseId(String(res.data.courses[0].id));
        }
      })
      .catch(() => toast.error('Failed to load courses'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedCourseId) return;
    setLoadingAnalytics(true);
    getCourseAnalytics(selectedCourseId)
      .then((res) => {
        setAnalytics(res.data.analytics);
        setStudentCount(res.data.studentCount);
      })
      .catch(() => toast.error('Failed to load analytics'))
      .finally(() => setLoadingAnalytics(false));
  }, [selectedCourseId]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <p className="font-mono text-[11px] text-muted uppercase tracking-widest mb-1">Overview</p>
          <h1 className="font-display text-3xl text-ink-text">Analytics</h1>
        </div>
        <Skeleton className="h-11 w-64" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-[11px] text-muted uppercase tracking-widest mb-1">Overview</p>
        <h1 className="font-display text-3xl text-ink-text">Analytics</h1>
      </div>

      {courses.length === 0 ? (
        <EmptyState icon={BarChart3} title="No courses yet" body="Create a course to see analytics here." />
      ) : (
        <>
          <div className="flex gap-2 flex-wrap">
  {courses.map((c) => (
    <button
      key={c.id}
      onClick={() => setSelectedCourseId(String(c.id))}
      className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
        String(selectedCourseId) === String(c.id)
          ? 'bg-gold text-ink border-gold'
          : 'bg-surface text-muted border-line hover:text-ink-text'
      }`}
    >
      {c.name}
    </button>
  ))}
</div>

          {loadingAnalytics ? (
            <Skeleton className="h-72 w-full" />
          ) : analytics.length === 0 ? (
            <EmptyState
              icon={BarChart3}
              title="No assignments in this course yet"
              body="Analytics appear once you post assignments here."
            />
          ) : (
            <>
              <div className="bg-surface border border-line rounded-xl p-6 transition-colors duration-300">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-muted text-xs font-mono uppercase tracking-wider">
                    Submission status by assignment
                  </p>
                  <p className="text-muted text-xs font-mono">{studentCount} student(s) enrolled</p>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={analytics.map((a) => ({
                      name: a.title.length > 14 ? a.title.slice(0, 14) + '…' : a.title,
                      Confirmed: a.confirmed,
                      Pending: a.pending,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#26304C" />
                    <XAxis dataKey="name" stroke="#8A93AC" fontSize={11} />
                    <YAxis stroke="#8A93AC" fontSize={11} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1B2540',
                        border: '1px solid #26304C',
                        borderRadius: '8px',
                        fontSize: '13px',
                      }}
                      labelStyle={{ color: '#EDF1F7' }}
                    />
                    <Bar dataKey="Confirmed" fill="#3DDC97" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="Pending" fill="#8A93AC" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid gap-3">
                {analytics.map((a) => (
                  <div
                    key={a.assignmentId}
                    className="bg-surface border border-line rounded-xl p-5 transition-colors duration-300"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-ink-text font-medium">{a.title}</h4>
                      <span className="text-mint font-mono text-sm">{a.completionRate}%</span>
                    </div>
                    <div className="w-full bg-surface-high rounded-full h-1.5">
                      <div
                        className="bg-mint h-1.5 rounded-full transition-all"
                        style={{ width: `${a.completionRate}%` }}
                      />
                    </div>
                    <p className="text-muted text-xs mt-2 font-mono">
                      {a.confirmed} confirmed · {a.pending} pending · {a.totalTracked} tracked ·{' '}
                      {a.submissionType === 'individual' ? 'Individual' : 'Group'}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Analytics;