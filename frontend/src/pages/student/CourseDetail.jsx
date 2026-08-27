import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';
import { getCourse } from '../../api/courses';
import { getMyGroups } from '../../api/groups';
import { getGroupSubmissions, getMySubmissions, confirmStep1, confirmStep2 } from '../../api/submissions';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import StatusStamp from '../../components/StatusStamp';
import Skeleton from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';
import ConfirmCheckmark from '../../components/ConfirmCheckmark';
import { courseAccent } from '../../lib/courseColors';

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [myGroups, setMyGroups] = useState([]);
  const [groupSubs, setGroupSubs] = useState({});
  const [individualSubs, setIndividualSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCheckmark, setShowCheckmark] = useState(false);

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
    setLoading(true);
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setShowCheckmark(true);
      setTimeout(() => setShowCheckmark(false), 1000);
      toast.success('Submission confirmed');
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to confirm');
    }
  };

  if (loading) {
    return (
      <Layout tabs={[]} activeTab="" onTabChange={() => {}} roleLabel="Student">
        <div className="space-y-8">
          <Skeleton className="h-4 w-28" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-4 w-96 max-w-full" />
          </div>
          <div className="grid gap-3">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout tabs={[]} activeTab="" onTabChange={() => {}} roleLabel="Student">
        <p className="text-muted text-sm">Course not found.</p>
      </Layout>
    );
  }

  const courseAssignments = course.assignments || [];

  return (
    <Layout tabs={[]} activeTab="" onTabChange={() => {}} roleLabel="Student">
      <ConfirmCheckmark show={showCheckmark} />

      <div className="space-y-8">
        <Link
          to="/student"
          className="inline-flex items-center gap-1.5 text-muted text-sm hover:text-ink-text transition"
        >
          <ArrowLeft size={14} /> Back to courses
        </Link>

        <div className="bg-surface border border-line rounded-2xl p-6 sm:p-8 relative overflow-hidden transition-colors duration-300">
  <div className={`absolute top-0 left-0 h-1.5 w-full ${courseAccent(course.id).bar}`} />
  <p className="font-mono text-[11px] text-muted uppercase tracking-widest mb-2">Course</p>
  <h1 className="font-display text-3xl sm:text-4xl text-ink-text mb-2">{course.name}</h1>
  {course.description && (
    <p className="text-muted text-sm max-w-lg">{course.description}</p>
  )}
  <p className="text-muted text-xs font-mono mt-4">
    {courseAssignments.length} assignment{courseAssignments.length !== 1 ? 's' : ''} · {myGroups.length} of your group{myGroups.length !== 1 ? 's' : ''} here
  </p>
</div>

        {courseAssignments.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No assignments yet"
            body="Your professor hasn't posted anything for this course."
          />
        ) : (
          <div className="grid gap-3">
            {courseAssignments.map((a) => {
              let submission = null;
              let isLeader = false;

              if (a.submissionType === 'individual') {
                submission = individualSubs.find((s) => s.assignmentId === a.id);
              } else {
                const group = myGroups[0];
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

                  <div className="w-full bg-surface-high rounded-full h-1.5 mb-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width:
                          submission.status === 'confirmed'
                            ? '100%'
                            : submission.status === 'step1_confirmed'
                            ? '50%'
                            : '0%',
                      }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className={`h-1.5 rounded-full ${
                        submission.status === 'confirmed' ? 'bg-mint' : 'bg-amber'
                      }`}
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-line flex-wrap">
                    
                    <a  href={a.onedriveLink}
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
    </Layout>
  );
}

export default CourseDetail;