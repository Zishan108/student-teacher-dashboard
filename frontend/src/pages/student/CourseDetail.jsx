import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';
import { getCourse } from '../../api/courses';
import { getMyGroups } from '../../api/groups';
import { getGroupSubmissions, getMySubmissions, confirmStep1, confirmStep2 } from '../../api/submissions';
import { useAuth } from '../../context/AuthContext';
import StatusStamp from '../../components/StatusStamp';
import Skeleton from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [myGroups, setMyGroups] = useState([]);
  const [groupSubs, setGroupSubs] = useState({});
  const [individualSubs, setIndividualSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      const courseRes = await getCourse(id);
      setCourse(courseRes.data.course);

      const groupsRes = await getMyGroups();
      const relevantGroups = groupsRes.data.groups.filter((g) => g.courseId === Number(id));
      setMyGroups(relevantGroups);

      const subsMap = {};
      for (const g of relevantGroups) {
        const subsRes = await getGroupSubmissions(g.id);
        subsMap[g.id] = subsRes.data.submissions;
      }
      setGroupSubs(subsMap);

      const mineRes = await getMySubmissions();
      setIndividualSubs(mineRes.data.submissions);
    } catch {
      toast.error('Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [id]);

  const handleStep1 = async (submissionId) => {
    try {
      await confirmStep1(submissionId);
      toast.success('Step 1 confirmed');
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to confirm');
    }
  };

  const handleStep2 = async (submissionId) => {
    try {
      await confirmStep2(submissionId);
      toast.success('Submission confirmed');
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to confirm');
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-28 w-full" />
      </div>
    );
  }

  if (!course) return <p className="text-muted text-sm">Course not found.</p>;

  const courseAssignments = course.assignments || [];

  return (
    <div className="space-y-8">
      <Link to="/student" className="inline-flex items-center gap-1.5 text-muted text-sm hover:text-ink-text transition">
        <ArrowLeft size={14} /> Back to courses
      </Link>

      <div>
        <p className="font-mono text-[11px] text-muted uppercase tracking-widest mb-1">Course</p>
        <h1 className="font-display text-3xl text-ink-text">{course.name}</h1>
        {course.description && <p className="text-muted text-sm mt-2 max-w-lg">{course.description}</p>}
      </div>

      {courseAssignments.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No assignments yet" body="Your professor hasn't posted anything for this course." />
      ) : (
        <div className="grid gap-3">
          {courseAssignments.map((a) => {
            let submission = null;
            let isLeader = false;

            if (a.submissionType === 'individual') {
              submission = individualSubs.find((s) => s.assignmentId === a.id);
            } else {
              const group = myGroups[0]; // assume one group per course for simplicity
              if (group) {
                submission = (groupSubs[group.id] || []).find((s) => s.assignmentId === a.id);
                isLeader = group.leader?.id === user?.id;
              }
            }

            if (!submission) return null;

            const canAct = a.submissionType === 'individual' || isLeader;

            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface border border-line rounded-xl p-5 transition-colors duration-300"
              >
                <div className="flex justify-between items-start gap-4 mb-3">
                  <div>
                    <h4 className="text-ink-text font-medium">{a.title}</h4>
                    {a.description && <p className="text-muted text-sm mt-1">{a.description}</p>}
                    <p className="text-muted text-xs mt-2 font-mono">
                      Due {new Date(a.dueDate).toLocaleDateString()} ·{' '}
                      {a.submissionType === 'individual' ? 'Individual' : 'Group'} submission
                    </p>
                  </div>
                  <StatusStamp status={submission.status} />
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-line flex-wrap">
                  
                    <a href={a.onedriveLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gold text-sm hover:text-gold-soft hover:underline"
                  >
                    Open submission link ↗
                  </a>

                  <div className="flex-1" />

                  {!canAct && (
                    <span className="text-muted text-xs font-mono uppercase tracking-wider">
                      Only your group leader can confirm
                    </span>
                  )}

                  {canAct && submission.status === 'pending' && (
                    <button
                      onClick={() => handleStep1(submission.id)}
                      className="bg-amber/20 text-amber border border-amber/30 text-sm px-3 py-1.5 rounded-lg hover:bg-amber/30 transition"
                    >
                      Yes, I have submitted
                    </button>
                  )}

                  {canAct && submission.status === 'step1_confirmed' && (
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
      )}
    </div>
  );
}

export default CourseDetail;