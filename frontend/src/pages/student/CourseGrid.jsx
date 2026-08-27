import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ClipboardList, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { getEnrolledCourses } from '../../api/courses';
import { courseAccent } from '../../lib/courseColors';
import Skeleton from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';

function CourseGrid() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getEnrolledCourses()
      .then((res) => setCourses(res.data.courses))
      .catch(() => toast.error('Failed to load courses'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <p className="font-mono text-[11px] text-muted uppercase tracking-widest mb-1">Registry</p>
          <h1 className="font-display text-3xl text-ink-text">My Courses</h1>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-36 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-[11px] text-muted uppercase tracking-widest mb-1">Registry</p>
        <h1 className="font-display text-3xl text-ink-text">My Courses</h1>
      </div>

      {courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Not enrolled anywhere yet"
          body="Ask your professor to enroll you in a course by your email."
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {courses.map((c, i) => {
            const accent = courseAccent(c.id);
            return (
              <motion.button
                key={c.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                whileHover={{ y: -3 }}
                onClick={() => navigate(`/student/course/${c.id}`)}
                className="group text-left bg-surface border border-line rounded-xl overflow-hidden transition-colors duration-300 hover:border-line"
              >
                <div className={`h-1.5 w-full ${accent.bar}`} />
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className={`w-9 h-9 rounded-lg ${accent.soft} border ${accent.ring} flex items-center justify-center shrink-0`}>
                      <BookOpen size={16} className={accent.text} />
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-muted group-hover:text-ink-text group-hover:translate-x-0.5 transition-all shrink-0 mt-1.5"
                    />
                  </div>
                  <h3 className="font-display text-xl text-ink-text mb-1.5">{c.name}</h3>
                  <p className="text-muted text-sm line-clamp-2 min-h-[2.5rem]">
                    {c.description || 'No description provided.'}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CourseGrid;