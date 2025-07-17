import React, { useRef, useImperativeHandle, forwardRef } from 'react';

const QuizLayout = forwardRef<HTMLDivElement, { children: React.ReactNode }>((props, ref) => {
  const topRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => topRef.current as HTMLDivElement);
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">
      <div ref={topRef} className="max-w-4xl mx-auto px-4 py-8">
        {props.children}
      </div>
    </div>
  );
});
QuizLayout.displayName = 'QuizLayout';
export default QuizLayout; 