import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getAnalytics } from '../../api/submissions';

function Analytics() {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAnalytics()
      .then((res) => setAnalytics(res.data.analytics))
      .catch(() => setError('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted text-sm">Loading analytics...</p>;
  if (error) return <p className="text-rose text-sm">{error}</p>;

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-[11px] text-muted uppercase tracking-widest mb-1">Overview</p>
        <h1 className="font-display text-3xl text-ink-text">Analytics</h1>
      </div>

      {analytics.length === 0 ? (
        <p className="text-muted text-sm">No assignments yet.</p>
      ) : (
        <>
          <div className="bg-surface border border-line rounded-xl p-6">
            <p className="text-muted text-xs font-mono uppercase tracking-wider mb-4">
              Submission status by assignment
            </p>
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
              <div key={a.assignmentId} className="bg-surface border border-line rounded-xl p-5">
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
                  {a.confirmed} confirmed · {a.pending} pending · {a.totalGroups} total groups
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Analytics;