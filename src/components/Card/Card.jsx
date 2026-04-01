import './Card.css';

export default function Card({ children, className = '', padding = true, hover = true, ...props }) {
  return (
    <div
      className={`card ${padding ? '' : 'no-padding'} ${hover ? 'card-hover' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
