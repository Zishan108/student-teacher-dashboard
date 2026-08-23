import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMyGroups, createGroup, addGroupMember } from '../../api/groups';

function MyGroups() {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchGroups = async () => {
    try {
      const res = await getMyGroups();
      setGroups(res.data.groups);
    } catch {
      setError('Failed to load groups');
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
      setNewGroupName('');
      fetchGroups();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create group');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!memberEmail.trim() || !selectedGroupId) return;
    try {
      await addGroupMember(selectedGroupId, memberEmail);
      setMemberEmail('');
      setSelectedGroupId(null);
      fetchGroups();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add member');
    }
  };

  if (loading) return <p className="text-muted text-sm">Loading groups...</p>;

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-[11px] text-muted uppercase tracking-widest mb-1">Registry</p>
        <h1 className="font-display text-3xl text-ink-text">My Groups</h1>
      </div>

      {error && (
        <div className="bg-rose/10 border border-rose/30 text-rose text-sm rounded-lg p-3">
          {error}
        </div>
      )}

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

      <div className="grid gap-3">
        {groups.length === 0 && (
          <p className="text-muted text-sm">You haven't joined or created any groups yet.</p>
        )}

        {groups.map((group, i) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            className="bg-surface border border-line rounded-xl p-5 transition-colors duration-300"
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="text-ink-text font-medium">{group.name}</h3>
                <p className="text-muted text-sm mt-1.5 font-mono">
                  {group.members?.map((m) => m.name).join(', ') || '—'}
                </p>
              </div>
              <button
                onClick={() => setSelectedGroupId(group.id)}
                className="text-gold text-xs font-mono uppercase tracking-wider shrink-0 hover:text-gold-soft"
              >
                + Add member
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
    </div>
  );
}

export default MyGroups;