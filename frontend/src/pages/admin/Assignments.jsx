import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAssignments, editAssignment, deleteAssignment } from '../../api/assignments';
import { getAssignmentSubmissions } from '../../api/submissions';
import StatusStamp from '../../components/StatusStamp';
import Skeleton from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', dueDate: '', onedriveLink: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchAssignments = async () => {
    try {
      const res = await getAssignments();
      setAssignments(res.data.assignments);
    } catch {
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const toggleExpand = async (id) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    setEditingId(null);
    const res = await getAssignmentSubmissions(id);
    setSubmissions(res.data.submissions);
  };

  const startEdit = (a) => {
    setEditingId(a.id);
    setExpandedId(null);
    setEditForm({
      title: a.title,
      description: a.description || '',
      dueDate: a.dueDate ? a.dueDate.slice(0, 10) : '',
      onedriveLink: a.onedriveLink,
    });
  };

  const handleEditSubmit = async (e, id) => {
    e.preventDefault();
    try {
      await editAssignment(id, editForm);
      toast.success('Assignment updated');
      setEditingId(null);
      fetchAssignments();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update assignment');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteAssignment(deleteTarget.id);
      toast.success('Assignment deleted');
      setDeleteTarget(null);
      fetchAssignments();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete assignment');
    }
  };

  const inputClass =
    'w-full px-3 py-2 rounded-lg bg-surface-high text-ink-text border border-line focus:outline-none focus:border-gold transition text-sm';

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <p className="font-mono text-[11px] text-muted uppercase tracking-widest mb-1">Ledger</p>
          <h1 className="font-display text-3xl text-ink-text">Assignments</h1>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-[11px] text-muted uppercase tracking-widest mb-1">Ledger</p>
        <h1 className="font-display text-3xl text-ink-text">Assignments</h1>
      </div>

      {assignments.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No assignments yet"
          body="Create your first assignment from the Create Assignment tab."
        />
      ) : (
        <div className="grid gap-3">
          {assignments.map((a) => (
            <div
              key={a.id}
              className="bg-surface border border-line rounded-xl p-5 transition-colors duration-300"
            >
              <div className="flex justify-between items-start gap-4 flex-wrap">
                <div>
                  <h3 className="text-ink-text font-medium">{a.title}</h3>
                  {a.description && <p className="text-muted text-sm mt-1">{a.description}</p>}
                  <p className="text-muted text-xs mt-2 font-mono">
                    Due{' '}
                    {new Date(a.dueDate).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                    {' · '}
                    Target: {a.target === 'group' ? 'Specific groups' : 'All groups'}
                  </p>
                </div>
                <div className="flex gap-3 shrink-0">
                  <button
                    onClick={() => startEdit(a)}
                    className="text-gold text-xs font-mono uppercase tracking-wider hover:text-gold-soft"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggleExpand(a.id)}
                    className="text-mint text-xs font-mono uppercase tracking-wider hover:opacity-80"
                  >
                    {expandedId === a.id ? 'Hide' : 'Submissions'}
                  </button>
                  <button
                    onClick={() => setDeleteTarget(a)}
                    className="text-rose text-xs font-mono uppercase tracking-wider hover:opacity-80"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {editingId === a.id && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={(e) => handleEditSubmit(e, a.id)}
                    className="mt-4 pt-4 border-t border-line space-y-3 overflow-hidden"
                  >
                    <input
                      className={inputClass}
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      placeholder="Title"
                      required
                    />
                    <textarea
                      className={inputClass}
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      placeholder="Description"
                      rows={2}
                    />
                    <input
                      type="date"
                      className={`${inputClass} [color-scheme:dark]`}
                      value={editForm.dueDate}
                      onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                      required
                    />
                    <input
                      type="url"
                      className={inputClass}
                      value={editForm.onedriveLink}
                      onChange={(e) => setEditForm({ ...editForm, onedriveLink: e.target.value })}
                      placeholder="OneDrive link"
                      required
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-gold hover:bg-gold-soft text-ink text-sm font-semibold px-4 py-2 rounded-lg transition"
                      >
                        Save changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="text-muted text-sm px-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {expandedId === a.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-line space-y-3 overflow-hidden"
                  >
                    {submissions.length === 0 && (
                      <p className="text-muted text-sm">No groups tracked for this assignment.</p>
                    )}
                    {submissions.map((s) => (
                      <div key={s.id} className="bg-surface-high rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-ink-text text-sm font-medium">{s.Group?.name}</span>
                          <StatusStamp status={s.status} />
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {s.Group?.members?.map((m) => (
                            <span
                              key={m.id}
                              className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${
                                s.confirmer?.id === m.id
                                  ? 'border-mint/40 text-mint bg-mint/10'
                                  : 'border-line text-muted'
                              }`}
                            >
                              {m.name}
                              {s.confirmer?.id === m.id && ' ✓ confirmed'}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete assignment?"
        body={`"${deleteTarget?.title}" and all its submission records will be permanently removed.`}
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default Assignments;