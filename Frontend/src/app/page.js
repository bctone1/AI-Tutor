// app/page.js
import fs from 'fs';
import path from 'path';

export default function HomePage() {
  const htmlPath = path.join(process.cwd(), 'public', 'ai-tutur_main.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');

  return (
    <main className="p-8">
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </main>
  );
}
