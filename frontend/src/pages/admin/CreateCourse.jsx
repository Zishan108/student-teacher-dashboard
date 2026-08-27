import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { createCourse, getTaughtCourses, enrollStudent } from '../../api/courses';
import { BookOpen } from 'lucide-react';
import { courseAccent } from '../../lib/courseColors';

function CreateCourse() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [enrollEmail, setEnrollEmail] = useState('');
  const [enrollingId, setEnrollingId] = useState(null);

  const fetchCourses = async () => {
    const res = await getTaughtCourses();
    setCourses(res.data.courses);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createCourse({ name, description });
      toast.success('Course created');
      setName('');
      setDescription('');
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (e, courseId) => {
    e.preventDefault();
    if (!enrollEmail.trim()) return;
    try {
      await enrollStudent(courseId, enrollEmail);
      toast.success('Student enrolled');
      setEnrollEmail('');
      setEnrollingId(null);
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to enroll student');
    }
  };

  const inputClass =
    'w-full px-4 py-2.5 rounded-lg bg-surface-high text-ink-text border border-line focus:outline-none focus:border-gold transition';

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-[11px] text-muted uppercase tracking-widest mb-1">Registry</p>
        <h1 className="font-display text-3xl text-ink-text">Courses</h1>
      </div>

      <div className="bg-surface border border-line rounded-xl p-6 max-w-xl transition-colors duration-300">
        <h3 className="text-ink-text font-medium mb-4">Create a course</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Course name (e.g. Data Structures)"
            required
          />
          <textarea
            className={inputClass}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows={2}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-gold hover:bg-gold-soft text-ink font-semibold px-5 py-2.5 rounded-lg text-sm transition disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create course'}
          </button>
        </form>
      </div>

      <div className="grid gap-3">
        {courses.map((c) => (
          <div key={c.id} className="bg-surface border border-line rounded-xl overflow-hidden transition-colors duration-300">
  <div className={`h-1 w-full ${courseAccent(c.id).bar}`} />
  <div className="p-5 flex justify-between items-start">
    <div className="flex gap-3">
      <div className={`w-9 h-9 rounded-lg ${courseAccent(c.id).soft} border ${courseAccent(c.id).ring} flex items-center justify-center shrink-0`}>
        <BookOpen size={16} className={courseAccent(c.id).text} />
      </div>
      <div>
        <h4 className="text-ink-text font-medium">{c.name}</h4>
        <p className="text-muted text-sm mt-1">{c.description}</p>
        <p className="text-muted text-xs mt-2 font-mono">
          {c.students?.length || 0} student(s) · {c.assignments?.length || 0} assignment(s)
        </p>
      </div>
    </div>
    <button
      onClick={() => setEnrollingId(c.id)}
      className="text-gold text-xs font-mono uppercase tracking-wider hover:text-gold-soft shrink-0"
    >
      + Enroll
    </button>
  </div>

                {enrollingId === c.id && (
      <div className="px-5 pb-5">
        <form onSubmit={(e) => handleEnroll(e, c.id)} className="flex gap-2 pt-4 border-t border-line">
          <input
            type="email"
            value={enrollEmail}
            onChange={(e) => setEnrollEmail(e.target.value)}
            placeholder="Student's email"
            className="flex-1 px-3 py-2 rounded-lg bg-surface-high text-ink-text text-sm border border-line focus:outline-none focus:border-gold transition"
          />
          <button type="submit" className="bg-mint/20 text-mint border border-mint/30 px-3 py-2 rounded-lg text-sm hover:bg-mint/30 transition">
            Enroll
          </button>
          <button type="button" onClick={() => setEnrollingId(null)} className="text-muted text-sm px-2">
            Cancel
          </button>
        </form>
      </div>
    )}
  </div>
))}
      </div>
    </div>
  );
}

export default CreateCourse;