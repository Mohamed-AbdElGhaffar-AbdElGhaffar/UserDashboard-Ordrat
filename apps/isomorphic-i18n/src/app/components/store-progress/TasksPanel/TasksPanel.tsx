'use client';

import Link from "next/link";
import { FaCheck, FaCheckCircle, FaClock, FaExclamation, FaExternalLinkAlt, FaShare } from "react-icons/fa";
import styles from './TasksPanal.module.css';

interface tasksProps {
  taskId: string,
  title: string,
  description: string,
  completed: boolean,
  link: string,
}

interface TasksPanelProps {
  lang: string;
  tasks: tasksProps[];
}

export default function TasksPanel({ lang, tasks }: TasksPanelProps) {
  const text = {
    currency: lang === 'ar' ? "ج.م" : "EGP",
  }
  
  return (
    <div className="tasks-panel bg-white rounded-xl p-6 shadow">
      <div className="panel-header border-b border-slate-200 pb-4 mb-5">
        <div className="panel-title text-lg font-semibold text-slate-800">
          {lang === 'ar' ? 'مهام الإعداد' : 'Setup Tasks'}
        </div>
      </div>

      <div className={`${styles.customScroll} tasks-list grid gap-3 max-h-[360px] overflow-y-auto scrollbar-thin scrollbar-thumb-rose-500 scrollbar-track-gray-100 pe-1`}>
        {tasks.map((task) => {
          const isCompleted = task.completed;
          return (
            <Link
              href={`${task.link}?demo=true`}
              key={task.taskId}
              className={`task-card flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
                isCompleted
                  ? 'bg-emerald-50 border-emerald-500 hover:bg-emerald-100'
                  : 'bg-white border-slate-200 hover:bg-rose-50 hover:border-rose-500'
              }`}
            >
              <div
                className={`task-icon w-10 h-10 flex items-center justify-center text-white rounded-md text-base ${
                  isCompleted ? 'bg-emerald-500' : 'bg-rose-600'
                }`}
              >
                {isCompleted ? <FaCheck /> : <FaExclamation />}
              </div>
              <div className="task-content flex-1">
                <div className="task-title text-sm font-medium text-slate-800 mb-1">
                  {task.title}
                </div>
                <div className="task-desc text-xs text-slate-500">
                  {task.description}
                </div>
              </div>
              <div
                className={`task-status hidden xs:flex items-center gap-2 text-xs font-medium ${
                  isCompleted ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {isCompleted ? <FaCheckCircle /> : <FaClock />}
                {isCompleted ? (lang === 'ar' ? 'مكتمل' : 'Completed') : lang === 'ar' ? 'في الانتظار' : 'Pending'}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}