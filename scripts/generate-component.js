import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Process name
const args = process.argv.slice(2);
let inputName = args[0];

if (!inputName) {
  console.error("\x1b[31mError: Please provide a component name.\x1b[0m");
  console.log("Usage: npm run gen:component <ComponentName>");
  console.log("Example: npm run gen:component InputNumber");
  process.exit(1);
}

// Strip leading 'nps' or 'Nps' if any
let baseName = inputName.trim();
if (baseName.toLowerCase().startsWith("nps")) {
  baseName = baseName.slice(3);
}
baseName = baseName.replace(/^[-_]+/, "");

if (!baseName) {
  console.error("\x1b[31mError: Invalid component name.\x1b[0m");
  process.exit(1);
}

// Casing helper functions
function toPascalCase(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
    .replace(/\s+/g, "")
    .replace(/-+/g, "")
    .replace(/_+/g, "");
}

function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

function toCamelCase(str) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

const pascalName = toPascalCase(baseName);
const folderName = toKebabCase(baseName);
const camelName = toCamelCase(baseName);

console.log(`Generating component:`);
console.log(`- Folder: packages/ui/src/components/${folderName}`);
console.log(`- Component: Nps${pascalName}`);
console.log(`- Docs Route: /components/${folderName}`);

// Define paths
const rootDir = path.resolve(__dirname, "..");
const uiPackageDir = path.join(rootDir, "packages", "ui");
const componentDir = path.join(uiPackageDir, "src", "components", folderName);
const uiIndexFile = path.join(uiPackageDir, "src", "index.ts");

const docsAppDir = path.join(rootDir, "apps", "docs");
const docsPageDir = path.join(
  docsAppDir,
  "src",
  "pages",
  "components",
  folderName,
);
const docsAppFile = path.join(docsAppDir, "src", "App.tsx");
const docsNavFile = path.join(docsAppDir, "src", "config", "navigation.ts");
const docsI18nFile = path.join(docsAppDir, "src", "i18n", "index.ts");

// Create component directories
if (!fs.existsSync(componentDir)) {
  fs.mkdirSync(componentDir, { recursive: true });
}

// 2. Create packages/ui files
// NpsComponent.tsx
const componentContent = `import { ${pascalName} } from "antd";
import { twMerge } from "tailwind-merge";
import type { Nps${pascalName}Props } from "./types";

export function Nps${pascalName}({ className, ...props }: Nps${pascalName}Props) {
  return (
    <${pascalName}
      className={twMerge("", className)}
      {...props}
    />
  );
}
`;
fs.writeFileSync(
  path.join(componentDir, `Nps${pascalName}.tsx`),
  componentContent,
  "utf8",
);

// types.ts
const typesContent = `import { type ${pascalName}Props } from "antd";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Nps${pascalName}Props extends ${pascalName}Props {
  // Add custom props here
}
`;
fs.writeFileSync(path.join(componentDir, "types.ts"), typesContent, "utf8");

// index.ts
const indexContent = `export * from "./Nps${pascalName}";
export * from "./types";
`;
fs.writeFileSync(path.join(componentDir, "index.ts"), indexContent, "utf8");

// NpsComponent.test.tsx
const testContent = `import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Nps${pascalName} } from "./index";

describe("Nps${pascalName}", () => {
  it("renders correctly", () => {
    render(<Nps${pascalName} data-testid="test-component" />);
    expect(screen.getByTestId("test-component")).toBeInTheDocument();
  });
});
`;
fs.writeFileSync(
  path.join(componentDir, `Nps${pascalName}.test.tsx`),
  testContent,
  "utf8",
);

// Update UI src/index.ts
let uiIndexContent = fs.readFileSync(uiIndexFile, "utf8");
const uiExportLine = `export * from "./components/${folderName}";`;
if (!uiIndexContent.includes(uiExportLine)) {
  // Add export line above the last empty lines or at the end
  uiIndexContent = uiIndexContent.trim() + `\n${uiExportLine}\n`;
  fs.writeFileSync(uiIndexFile, uiIndexContent, "utf8");
  console.log(`- Updated packages/ui/src/index.ts`);
}

// 3. Create docs page files
if (!fs.existsSync(docsPageDir)) {
  fs.mkdirSync(docsPageDir, { recursive: true });
}

// docs page index.tsx
const docsPageContent = `import { Nps${pascalName} } from "@namphuongtechnologi/nps-ui";
import { ComponentDoc } from "../../../components/docs/ComponentDoc";
import type { ExampleConfig, ApiProp } from "../../../components/docs/types";
import { useTranslation } from "react-i18next";
import { SEO } from "../../../components/docs/SEO";

export function ${pascalName}Page() {
  const { t } = useTranslation("${camelName}");

  const examples: ExampleConfig[] = [
    {
      id: "ex-basic",
      title: t("examples.basic.title"),
      desc: t("examples.basic.desc"),
      preview: (
        <Nps${pascalName} />
      ),
      code: \`<Nps${pascalName} />\`,
    },
  ];

  const customApiData: ApiProp[] = [];

  return (
    <>
      <SEO title="${pascalName}" description={t("description")} />
      <ComponentDoc
        title="${pascalName}"
        version="0.0.1"
        description={t("description")}
        importSnippet={\`import { Nps${pascalName} } from "@namphuongtechnologi/nps-ui";\`}
        whenToUse={t("whenToUse.items", { returnObjects: true }) as string[]}
        examples={examples}
        customApiData={customApiData}
        antdDocLink="https://ant.design/components/${folderName}#api"
      />
    </>
  );
}

export const ${camelName}AnchorItems = [
  { key: "ex-basic", href: "#ex-basic", title: "Basic" },
];
`;
fs.writeFileSync(path.join(docsPageDir, "index.tsx"), docsPageContent, "utf8");

// docs page locales.ts
const docsLocalesContent = `export const ${camelName}Locales = {
  en: {
    description:
      "Nps${pascalName} is a wrapper component based on ${pascalName} from Ant Design v5.",
    whenToUse: {
      title: "When to Use",
      items: [
        "Use when you need a ${pascalName} component.",
      ],
    },
    examples: {
      title: "Examples",
      subtitle: "Example usage of the ${pascalName} component.",
      basic: {
        title: "Basic",
        desc: "Provides basic usage of Nps${pascalName}.",
      },
    },
  },
  vi: {
    description:
      "Nps${pascalName} là một thành phần bao bọc dựa trên ${pascalName} từ Ant Design v5.",
    whenToUse: {
      title: "Khi nào cần sử dụng",
      items: [
        "Sử dụng khi cần một thành phần ${pascalName}.",
      ],
    },
    examples: {
      title: "Ví dụ",
      subtitle: "Các mẫu ví dụ sử dụng thành phần ${pascalName}.",
      basic: {
        title: "Cơ bản",
        desc: "Cung cấp cách dùng cơ bản của Nps${pascalName}.",
      },
    },
  },
};
`;
fs.writeFileSync(
  path.join(docsPageDir, "locales.ts"),
  docsLocalesContent,
  "utf8",
);

// 4. Update docs App.tsx
if (fs.existsSync(docsAppFile)) {
  let appContent = fs.readFileSync(docsAppFile, "utf8");

  // Add import
  const importTarget =
    'import { ButtonPage, buttonAnchorItems } from "./pages/components/button";';
  const importReplacement = `${importTarget}\nimport { ${pascalName}Page, ${camelName}AnchorItems } from "./pages/components/${folderName}";`;
  if (!appContent.includes(`./pages/components/${folderName}`)) {
    appContent = appContent.replace(importTarget, importReplacement);
  }

  // Add page route in pageMap
  const routeTarget = `  "/components/button": {
    path: "/components/button",
    anchorItems: buttonAnchorItems,
    content: <ButtonPage />,
  },`;
  const routeReplacement = `${routeTarget}\n  "/components/${folderName}": {
    path: "/components/${folderName}",
    anchorItems: ${camelName}AnchorItems,
    content: <${pascalName}Page />,
  },`;
  if (!appContent.includes(`"/components/${folderName}":`)) {
    appContent = appContent.replace(routeTarget, routeReplacement);
  }

  fs.writeFileSync(docsAppFile, appContent, "utf8");
  console.log(`- Updated apps/docs/src/App.tsx`);
}

// 5. Update docs navigation.ts
if (fs.existsSync(docsNavFile)) {
  let navContent = fs.readFileSync(docsNavFile, "utf8");

  const navTarget = `  {
    key: "/components/button",
    label: "Button",
    path: "/components/button",
  },`;
  const navReplacement = `${navTarget}\n  {\n    key: "/components/${folderName}",\n    label: "${pascalName}",\n    path: "/components/${folderName}",\n  },`;

  if (!navContent.includes(`"/components/${folderName}"`)) {
    navContent = navContent.replace(navTarget, navReplacement);
  }

  fs.writeFileSync(docsNavFile, navContent, "utf8");
  console.log(`- Updated apps/docs/src/config/navigation.ts`);
}

// 6. Update docs i18n/index.ts
if (fs.existsSync(docsI18nFile)) {
  let i18nContent = fs.readFileSync(docsI18nFile, "utf8");

  // Import
  const i18nImportTarget =
    'import { buttonLocales } from "../pages/components/button/locales";';
  const i18nImportReplacement = `${i18nImportTarget}\nimport { ${camelName}Locales } from "../pages/components/${folderName}/locales";`;
  if (!i18nContent.includes(`../pages/components/${folderName}/locales`)) {
    i18nContent = i18nContent.replace(i18nImportTarget, i18nImportReplacement);
  }

  // English resource
  const enTarget = "        button: buttonLocales.en,";
  const enReplacement = `${enTarget}\n        ${camelName}: ${camelName}Locales.en,`;
  if (!i18nContent.includes(`        ${camelName}: ${camelName}Locales.en,`)) {
    i18nContent = i18nContent.replace(enTarget, enReplacement);
  }

  // Vietnamese resource
  const viTarget = "        button: buttonLocales.vi,";
  const viReplacement = `${viTarget}\n        ${camelName}: ${camelName}Locales.vi,`;
  if (!i18nContent.includes(`        ${camelName}: ${camelName}Locales.vi,`)) {
    i18nContent = i18nContent.replace(viTarget, viReplacement);
  }

  fs.writeFileSync(docsI18nFile, i18nContent, "utf8");
  console.log(`- Updated apps/docs/src/i18n/index.ts`);
}

console.log(
  `\n\x1b[32mSuccess: Scaffolded component Nps${pascalName} successfully!\x1b[0m`,
);
console.log(
  `Please run 'npm run format' to format the newly generated/modified files.`,
);
