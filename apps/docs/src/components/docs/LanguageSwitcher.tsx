import { Button, Dropdown } from "antd";
import { useTranslation } from "react-i18next";
import { GlobalOutlined } from "@ant-design/icons";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const currentLang = i18n.language === "vi" ? "VI" : "EN";

  const items = [
    {
      key: "en",
      label: "English",
      disabled: i18n.language === "en",
    },
    {
      key: "vi",
      label: "Tiếng Việt",
      disabled: i18n.language === "vi",
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    i18n.changeLanguage(key);
  };

  return (
    <Dropdown
      menu={{ items, onClick: handleMenuClick }}
      placement="bottomRight"
      trigger={["click"]}
    >
      <Button
        type="text"
        size="small"
        className="flex items-center gap-1.5 px-2 font-medium text-slate-600 hover:text-blue-600"
        style={{ height: 32 }}
      >
        <GlobalOutlined style={{ fontSize: 16 }} />
        <span style={{ fontSize: 13 }}>{currentLang}</span>
      </Button>
    </Dropdown>
  );
}
