import { useState, useEffect } from 'react';
import { getAssignments } from '../../api/assignments';
import { getMyGroups } from '../../api/groups';
import { getGroupSubmissions, confirmStep1, confirmStep2 } from '../../api/submissions';
import StatusStamp from '../../components/StatusStamp';
import { motion } from 'framer-motion';

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [groups, setGroups] = useState([]);
  const [submissionsByGroup, setSubmissionsByGroup] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const assignmentsRes = await getAssignments();
      const groupsRes = await getMyGroups();

      setAssignments(assignmentsRes.data.assignments);
      setGroups(groupsRes.data.groups);

      const subsMap = {};
      for (const group of groupsRes.data.groups) {
        const subsRes = await getGroupSubmissions(group.id);
        subsMap[group.id] = subsRes.data.submissions;
      }
      setSubmissionsByGroup(subsMap);
    } catch {
      setError('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const findSubmission = (groupId, assignmentId) => {
    const subs = submissionsByGroup[groupId] || [];
    return subs.find((s) => s.assignmentId === assignmentId);
  };

  const handleStep1 = async (submissionId) => {
    try {
      await confirmStep1(submissionId);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to confirm step 1');
    }
  };

  const handleStep2 = async (submissionId) => {
    try {
      await confirmStep2(submissionId);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to confirm submission');
    }
  };

  if (loading) return <p className="text-muted text-sm">Loading assignments...</p>;

  if (groups.length === 0) {
    return (
      <div>
        <p className="font-mono text-[11px] text-muted uppercase tracking-widest mb-1">Registry</p>
        <h1 className="font-display text-3xl text-ink-text mb-4">Assignments</h1>
        <p className="text-muted text-sm">Join or create a group first to see assignments.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-[11px] text-muted uppercase tracking-widest mb-1">Registry</p>
        <h1 className="font-display text-3xl text-ink-text">Assignments</h1>
      </div>

      {error && (
        <div className="bg-rose/10 border border-rose/30 text-rose text-sm rounded-lg p-3">
          {error}
        </div>
      )}

      {assignments.length === 0 && (
        <p className="text-muted text-sm">No assignments posted yet.</p>
      )}

      {groups.map((group) => (
        <div key={group.id}>
          <p className="text-muted text-xs font-mono uppercase tracking-wider mb-3">
            Group — {group.name}
          </p>
          <div className="grid gap-3">
            {assignments.map((assignment) => {
              const submission = findSubmission(group.id, assignment.id);
              if (!submission) return null;

              return (
                <motion.div
                    key={assignment.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="bg-surface border border-line rounded-xl p-5 transition-colors duration-300"
                >
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <div>
                      <h4 className="text-ink-text font-medium">{assignment.title}</h4>
                      {assignment.description && (
                        <p className="text-muted text-sm mt-1">{assignment.description}</p>
                      )}
                      <p className="text-muted text-xs mt-2 font-mono">
                        Due {new Date(assignment.dueDate).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <StatusStamp status={submission.status} />
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-line">
                    
                    <a href={assignment.onedriveLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gold text-sm hover:text-gold-soft hover:underline"
                    >
                      Open submission link ↗
                    </a>

                    <div className="flex-1" />

                    {submission.status === 'pending' && (
                      <button
                        onClick={() => handleStep1(submission.id)}
                        className="bg-amber/20 text-amber border border-amber/30 text-sm px-3 py-1.5 rounded-lg hover:bg-amber/30 transition"
                      >
                        Yes, I have submitted
                      </button>
                    )}

                    {submission.status === 'step1_confirmed' && (
                      <button
                        onClick={() => handleStep2(submission.id)}
                        className="bg-mint/20 text-mint border border-mint/30 text-sm px-3 py-1.5 rounded-lg hover:bg-mint/30 transition"
                      >
                        Confirm final submission
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Assignments;