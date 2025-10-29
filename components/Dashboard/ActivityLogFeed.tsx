import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { ActivityLog } from '../../types';

const ActivityLogFeed: React.FC = () => {
  const { activityLog } = useAppContext();

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `منذ ${Math.floor(interval)} سنة`;
    interval = seconds / 2592000;
    if (interval > 1) return `منذ ${Math.floor(interval)} شهر`;
    interval = seconds / 86400;
    if (interval > 1) return `منذ ${Math.floor(interval)} يوم`;
    interval = seconds / 3600;
    if (interval > 1) return `منذ ${Math.floor(interval)} ساعة`;
    interval = seconds / 60;
    if (interval > 1) return `منذ ${Math.floor(interval)} دقيقة`;
    return 'الآن';
  };

  return (
    <div className="bg-accent p-4 rounded-xl shadow-md border border-accent-light">
      <h3 className="text-lg font-bold text-text-main mb-4">آخر النشاطات</h3>
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {activityLog.length > 0 ? (
          activityLog.map((log) => (
            <div key={log.id} className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-accent-light flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-xs font-bold text-text-secondary">{log.username.substring(0, 2)}</span>
              </div>
              <div>
                <p className="text-sm text-text-main">
                  <span className="font-bold">{log.username}</span> {log.details}
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  {formatTimeAgo(log.timestamp)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-text-secondary text-center py-4">لا توجد نشاطات مسجلة.</p>
        )}
      </div>
    </div>
  );
};

export default ActivityLogFeed;
