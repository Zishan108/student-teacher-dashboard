import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { getMyGroups, createGroup, addGroupMember, removeGroupMember } from '../../api/groups';
import { useAuth } from '../../context/AuthContext';
import Skeleton from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';

function MyGroups() {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [removeTarget, setRemoveTarget] = useState(null); // { groupId, userId, name }

  const fetchGroups = async () => {
    try {
      const res = await getMyGroups();
      setGroups(res.data.groups);
    } catch {
      toast.error('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    try {
      await createGroup(newGroupName);
      toast.success('Group created');
      setNewGroupName('');
      fetchGroups();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create group');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!memberEmail.trim() || !selectedGroupId) return;
    try {
      await addGroupMember(selectedGroupId, memberEmail);
      toast.success('Member added');
      setMemberEmail('');
      setSelectedGroupId(null);
      fetchGroups();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add member');
    }
  };

  const confirmRemoveMember = async () => {
    if (!removeTarget) return;
    try {
      await removeGroupMember(removeTarget.groupId, removeTarget.userId);
      toast.success(`Removed ${removeTarget.name}`);
      setRemoveTarget(null);
      fetchGroups();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to remove member');
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <p className="font-mono text-[11px] text-muted uppercase tracking-widest mb-1">Registry</p>
          <h1 className="font-display text-3xl text-ink-text">My Groups</h1>
        </div>
        <Skeleton className="h-11 w-full" />
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
        <p className="font-mono text-[11px] text-muted uppercase tracking-widest mb-1">Registry</p>
        <h1 className="font-display text-3xl text-ink-text">My Groups</h1>
      </div>

      <form onSubmit={handleCreateGroup} className="flex gap-2">
        <input
          type="text"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          placeholder="New group name"
          className="flex-1 px-4 py-2.5 rounded-lg bg-surface text-ink-text border border-line focus:outline-none focus:border-gold transition"
        />
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="bg-gold hover:bg-gold-soft text-ink px-5 py-2.5 rounded-lg text-sm font-semibold transition"
        >
          Create
        </motion.button>
      </form>

      {groups.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No groups yet"
          body="Create a group above, or ask a teammate to add you by email."
        />
      ) : (
        <div className="grid gap-3">
          {groups.map((group, i) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="bg-surface border border-line rounded-xl p-5 transition-colors duration-300"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-ink-text font-medium">{group.name}</h3>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {group.members?.map((m) => (
                      <span
                        key={m.id}
                        className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2 py-1 rounded-full border border-line text-muted"
                      >
                        {m.name}
                        {m.id !== user?.id && (
                          <button
                            onClick={() =>
                              setRemoveTarget({ groupId: group.id, userId: m.id, name: m.name })
                            }
                            className="hover:text-rose transition"
                            aria-label={`Remove ${m.name}`}
                          >
                            <X size={11} />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedGroupId(group.id)}
                  className="text-gold text-xs font-mono uppercase tracking-wider shrink-0 hover:text-gold-soft"
                >
                  + Add
                </button>
              </div>

              <AnimatePresence>
                {selectedGroupId === group.id && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleAddMember}
                    className="flex gap-2 mt-4 pt-4 border-t border-line overflow-hidden"
                  >
                    <input
                      type="email"
                      value={memberEmail}
                      onChange={(e) => setMemberEmail(e.target.value)}
                      placeholder="Member's email"
                      className="flex-1 px-3 py-2 rounded-lg bg-surface-high text-ink-text text-sm border border-line focus:outline-none focus:border-gold transition"
                    />
                    <button
                      type="submit"
                      className="bg-mint/20 text-mint border border-mint/30 px-3 py-2 rounded-lg text-sm hover:bg-mint/30 transition"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedGroupId(null)}
                      className="text-muted text-sm px-2"
                    >
                      Cancel
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!removeTarget}
        title="Remove member?"
        body={`${removeTarget?.name} will lose access to this group's assignments.`}
        confirmLabel="Remove"
        danger
        onConfirm={confirmRemoveMember}
        onCancel={() => setRemoveTarget(null)}
      />
    </div>
  );
}

export default MyGroups;