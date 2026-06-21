// Renders a multi-line text field while preserving the author's structure:
// - if every non-empty line starts with a bullet marker (-, *, •), it renders
//   a real <ul> bullet list
// - otherwise it renders a paragraph that keeps the line breaks the user typed
// Without this, descriptions collapse into a single run-on paragraph.

const BULLET = /^\s*[-*•]\s+/

export default function BulletText({ text, className = '' }: { text: string; className?: string }) {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
  const isBulleted = lines.length > 1 && lines.every((l) => BULLET.test(l))

  if (isBulleted) {
    return (
      <ul className={`list-disc pl-5 space-y-1 ${className}`}>
        {lines.map((line, i) => (
          <li key={i}>{line.replace(BULLET, '')}</li>
        ))}
      </ul>
    )
  }

  return <p className={`whitespace-pre-line ${className}`}>{text}</p>
}
