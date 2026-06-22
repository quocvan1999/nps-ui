import { Typography } from "antd";
import { CodeBlock } from "./CodeBlock";
import type { ExampleConfig } from "./types";

const { Title, Paragraph } = Typography;

interface DocExampleSectionProps {
  example: ExampleConfig;
}

export function DocExampleSection({ example }: DocExampleSectionProps) {
  return (
    <section key={example.id} id={example.id} className="docs-section">
      <Title
        level={3}
        style={{ fontSize: 16, marginBottom: 4, fontWeight: 600 }}
      >
        {example.title}
      </Title>
      <Paragraph style={{ color: "#64748b", marginBottom: 16, fontSize: 14 }}>
        {example.desc}
      </Paragraph>
      <div className="docs-example-card">
        <div className="docs-preview-surface">{example.preview}</div>
        <div className="docs-example-code">
          <CodeBlock code={example.code} lang="tsx" />
        </div>
      </div>
    </section>
  );
}
