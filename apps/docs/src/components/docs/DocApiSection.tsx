import { Typography } from "antd";
import { ApiTable } from "./ApiTable";
import type { ApiProp } from "./types";

const { Title, Paragraph, Text } = Typography;

interface DocApiSectionProps {
  title: string;
  customApiData?: ApiProp[];
  antdDocLink?: string;
}

export function DocApiSection({
  title,
  customApiData,
  antdDocLink,
}: DocApiSectionProps) {
  if (!customApiData && !antdDocLink) return null;

  return (
    <section id="api" className="docs-section">
      <Title
        level={2}
        style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}
      >
        API
      </Title>

      {customApiData && (
        <>
          <Paragraph
            style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}
          >
            Bảng liệt kê các thuộc tính tùy chỉnh (props) của{" "}
            <Text code>Nps{title}</Text>.
          </Paragraph>
          <ApiTable data={customApiData} />
        </>
      )}

      {antdDocLink && (
        <div className="docs-ant-ref-callout mt-8">
          <div className="docs-ant-ref-callout-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div className="docs-ant-ref-callout-body">
            <p className="docs-ant-ref-callout-title">
              Inherited props from Ant Design {title}
            </p>
            <p className="docs-ant-ref-callout-desc">
              This component fully inherits all properties from the original Ant
              Design component.
            </p>
            <a
              href={antdDocLink}
              target="_blank"
              rel="noopener noreferrer"
              className="docs-ant-ref-link"
            >
              View Ant Design {title} API Documentation
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
