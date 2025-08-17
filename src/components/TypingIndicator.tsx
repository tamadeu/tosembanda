export const TypingIndicator = () => {
  return (
    <div className="flex items-end gap-2 justify-start">
      <div className="flex items-center justify-center gap-1.5 p-3 rounded-lg bg-muted">
        <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></span>
      </div>
    </div>
  );
};