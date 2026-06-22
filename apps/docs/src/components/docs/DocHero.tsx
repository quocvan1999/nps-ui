import { Tag, Typography } from "antd";
import { CodeBlock } from "./CodeBlock";
import type { ReactNode } from "react";

const { Title } = Typography;

interface DocHeroProps {
  title: string;
  version?: string;
  description: ReactNode;
  importSnippet: string;
}

export function DocHero({
  title,
  version,
  description,
  importSnippet,
}: DocHeroProps) {
  return (
    <section id="overview" className="docs-section">
      <div className="flex items-center gap-3 mb-3">
        <Title
          style={{
            margin: 0,
            fontSize: 38,
            fontWeight: 700,
            letterSpacing: -0.5,
          }}
        >
          {title}
        </Title>
        {version && (
          <Tag color="blue" style={{ marginTop: 4 }}>
            v{version}
          </Tag>
        )}
      </div>
      <div style={{ fontSize: 16, color: "#475569", maxWidth: 640 }}>
        {description}
      </div>

      <div className="mt-5">
        <CodeBlock code={importSnippet} lang="tsx" />
      </div>
    </section>
  );
}
