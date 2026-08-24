import { useState, useEffect } from 'react';
import { createAssignment } from '../../api/assignments';
import { getAllGroups } from '../../api/groups';
import toast from 'react-hot-toast';

function CreateAssignment({ onCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [onedriveLink, setOnedriveLink] = useState('');
  const [target, setTarget] = useState('all');
  const [allGroups, setAllGroups] = useState([]);
  const [selectedGroupIds, setSelectedGroupIds] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllGroups().then((res) => setAllGroups(res.data.groups));
  }, []);

  const toggleGroup = (id) => {
    setSelectedGroupIds((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (target === 'group' && selectedGroupIds.length === 0) {
    toast.error('Select at least one group, or switch to "All groups".');
    return;
  }

  setLoading(true);
  try {
    await createAssignment({
      title,
      description,
      dueDate,
      onedriveLink,
      target,
      groupIds: target === 'group' ? selectedGroupIds : undefined,
    });
    toast.success('Assignment created');
    setTitle('');
    setDescription('');
    setDueDate('');
    setOnedriveLink('');
    setTarget('all');
    setSelectedGroupIds([]);
    if (onCreated) onCreated();
  } catch (err) {
    toast.error(err.response?.data?.error || 'Failed to create assignment');
  } finally {
    setLoading(false);
  }
};

  const inputClass =
    'w-full px-4 py-2.5 rounded-lg bg-surface-high text-ink-text border border-line focus:outline-none focus:border-gold transition';

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-[11px] text-muted uppercase tracking-widest mb-1">New entry</p>
        <h1 className="font-display text-3xl text-ink-text">Create Assignment</h1>
      </div>

      <div className="bg-surface border border-line rounded-xl p-6 max-w-xl transition-colors duration-300">
        {error && (
          <div className="bg-rose/10 border border-rose/30 text-rose text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-mint/10 border border-mint/30 text-mint text-sm rounded-lg p-3 mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-muted text-xs font-mono uppercase tracking-wider mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={inputClass}
              placeholder="Assignment 1 — Data Structures"
            />
          </div>

          <div>
            <label className="block text-muted text-xs font-mono uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={inputClass}
              placeholder="Brief description of the assignment"
            />
          </div>

          <div>
            <label className="block text-muted text-xs font-mono uppercase tracking-wider mb-1.5">
              Due date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className={`${inputClass} [color-scheme:dark]`}
            />
          </div>

          <div>
            <label className="block text-muted text-xs font-mono uppercase tracking-wider mb-1.5">
              OneDrive submission link
            </label>
            <input
              type="url"
              value={onedriveLink}
              onChange={(e) => setOnedriveLink(e.target.value)}
              required
              className={inputClass}
              placeholder="https://onedrive.live.com/..."
            />
          </div>

          <div>
            <label className="block text-muted text-xs font-mono uppercase tracking-wider mb-2">
              Assign to
            </label>
            <div className="flex gap-4 mb-3">
              <label className="flex items-center gap-2 text-sm text-ink-text cursor-pointer">
                <input
                  type="radio"
                  checked={target === 'all'}
                  onChange={() => setTarget('all')}
                  className="accent-gold"
                />
                All groups
              </label>
              <label className="flex items-center gap-2 text-sm text-ink-text cursor-pointer">
                <input
                  type="radio"
                  checked={target === 'group'}
                  onChange={() => setTarget('group')}
                  className="accent-gold"
                />
                Specific groups
              </label>
            </div>

            {target === 'group' && (
              <div className="bg-surface-high border border-line rounded-lg p-3 max-h-48 overflow-y-auto space-y-1">
                {allGroups.length === 0 && (
                  <p className="text-muted text-sm">No groups exist yet.</p>
                )}
                {allGroups.map((g) => (
                  <label
                    key={g.id}
                    className="flex items-center gap-2 text-sm text-ink-text px-2 py-1.5 rounded hover:bg-surface cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedGroupIds.includes(g.id)}
                      onChange={() => toggleGroup(g.id)}
                      className="accent-gold"
                    />
                    {g.name}
                    <span className="text-muted text-xs font-mono ml-auto">
                      {g.members?.length || 0} members
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-gold hover:bg-gold-soft text-ink font-semibold px-5 py-2.5 rounded-lg text-sm transition disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create assignment'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateAssignment;