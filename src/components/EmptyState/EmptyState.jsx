import { LuInbox } from 'react-icons/lu';
import './EmptyState.css';

export default function EmptyState({ icon: Icon = LuInbox, title = 'No data found', message = 'Try adjusting your filters or add some data to get started.' }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Icon size={40} />
      </div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-message">{message}</p>
    </div>
  );
}
