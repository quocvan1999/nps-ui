import { NpsAlert } from "@namphuongtechnologi/nps-ui";
import { ComponentDoc } from "../../../components/docs/ComponentDoc";
import type { ExampleConfig, ApiProp } from "../../../components/docs/types";
import { useTranslation } from "react-i18next";
import { SEO } from "../../../components/docs/SEO";

export function AlertPage() {
  const { t } = useTranslation("alert");

  const examples: ExampleConfig[] = [
    {
      id: "ex-basic",
      title: t("examples.basic.title"),
      desc: t("examples.basic.desc"),
      preview: <NpsAlert />,
      code: `<NpsAlert />`,
    },
  ];

  const customApiData: ApiProp[] = [];

  return (
    <>
      <SEO title="Alert" description={t("description")} />
      <ComponentDoc
        title="Alert"
        version="0.0.1"
        description={t("description")}
        importSnippet={`import { NpsAlert } from "@namphuongtechnologi/nps-ui";`}
        whenToUse={t("whenToUse.items", { returnObjects: true }) as string[]}
        examples={examples}
        customApiData={customApiData}
        antdDocLink="https://ant.design/components/alert#api"
      />
    </>
  );
}

export const alertAnchorItems = [
  { key: "ex-basic", href: "#ex-basic", title: "Basic" },
];
