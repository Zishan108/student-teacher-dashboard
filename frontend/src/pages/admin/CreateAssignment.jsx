import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { createAssignment } from '../../api/assignments';
import { getAllGroups } from '../../api/groups';
import { getTaughtCourses } from '../../api/courses';

function CreateAssignment({ onCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [onedriveLink, setOnedriveLink] = useState('');
  const [target, setTarget] = useState('all');
  const [submissionType, setSubmissionType] = useState('group');
  const [courseId, setCourseId] = useState('');
  const [courses, setCourses] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [selectedGroupIds, setSelectedGroupIds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTaughtCourses().then((res) => setCourses(res.data.courses));
    getAllGroups().then((res) => setAllGroups(res.data.groups));
  }, []);

  const toggleGroup = (id) => {
    setSelectedGroupIds((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!courseId) {
      toast.error('Select a course for this assignment');
      return;
    }
    if (submissionType === 'group' && target === 'group' && selectedGroupIds.length === 0) {
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
        submissionType,
        courseId,
        groupIds: submissionType === 'group' && target === 'group' ? selectedGroupIds : undefined,
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

  // groups filtered to the selected course, since assignments target groups within one course
  const groupsInCourse = allGroups.filter((g) => g.courseId === Number(courseId));

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-[11px] text-muted uppercase tracking-widest mb-1">New entry</p>
        <h1 className="font-display text-3xl text-ink-text">Create Assignment</h1>
      </div>

      <div className="bg-surface border border-line rounded-xl p-6 max-w-xl transition-colors duration-300">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-muted text-xs font-mono uppercase tracking-wider mb-1.5">
              Course
            </label>
            <select
              value={courseId}
              onChange={(e) => {
                setCourseId(e.target.value);
                setSelectedGroupIds([]);
              }}
              required
              className={inputClass}
            >
              <option value="">Select course...</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {courses.length === 0 && (
              <p className="text-muted text-xs mt-1.5">
                Create a course first, under the Courses tab.
              </p>
            )}
          </div>

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
              Submission type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-ink-text cursor-pointer">
                <input
                  type="radio"
                  checked={submissionType === 'group'}
                  onChange={() => setSubmissionType('group')}
                  className="accent-gold"
                />
                Group
              </label>
              <label className="flex items-center gap-2 text-sm text-ink-text cursor-pointer">
                <input
                  type="radio"
                  checked={submissionType === 'individual'}
                  onChange={() => setSubmissionType('individual')}
                  className="accent-gold"
                />
                Individual
              </label>
            </div>
          </div>

          {submissionType === 'group' && (
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
                  All groups in course
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
                  {groupsInCourse.length === 0 && (
                    <p className="text-muted text-sm">No groups in this course yet.</p>
                  )}
                  {groupsInCourse.map((g) => (
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
          )}

          {submissionType === 'individual' && (
            <p className="text-muted text-xs bg-surface-high border border-line rounded-lg p-3">
              Every student enrolled in the selected course gets an individual submission slot.
            </p>
          )}

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