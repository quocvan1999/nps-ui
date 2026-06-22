import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { Anchor, Layout, Menu } from "antd";
import { HistoryOutlined } from "@ant-design/icons";
import { BrandLockup } from "./Brand";
import { GUIDE_NAV, COMPONENT_NAV } from "../../config/navigation";
import { CURRENT_VERSION } from "../../config/versions";
import { EXTERNAL_LINKS } from "../../config/links";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { DocsAnchorItem, DocsLayoutProps } from "./types";

const { Sider, Content } = Layout;

const TOPBAR_H = 64;

/** Custom scroll-spy */
function useActiveAnchor(items: DocsAnchorItem[]) {
  const [activeHref, setActiveHref] = useState<string>(items[0]?.href ?? "");
  const rafId = useRef<number>(0);

  const compute = useCallback(() => {
    const threshold = TOPBAR_H + 16;
    let current = "";

    for (const item of items) {
      const id = item.href.replace("#", "");
      const el = document.getElementById(id);
      if (!el) continue;
      const top = el.getBoundingClientRect().top;
      if (top <= threshold) {
        current = item.href;
      }
    }

    setActiveHref(current || (items[0]?.href ?? ""));
  }, [items]);

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, [compute]);

  return activeHref;
}

/** Sidebar state on mobile */
function useMobileSider() {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((v) => !v);
  const close = () => setOpen(false);
  return { open, toggle, close };
}

export function DocsLayout({
  currentPath,
  onNavigate,
  anchorItems,
  children,
}: DocsLayoutProps) {
  const activeAnchor = useActiveAnchor(anchorItems);
  const {
    open: siderOpen,
    toggle: toggleSider,
    close: closeSider,
  } = useMobileSider();

  const handleClick =
    (path: string) => (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      onNavigate(path);
      closeSider();
    };

  const handleMenuClick = ({ key }: { key: string }) => {
    if (typeof key === "string" && key.startsWith("/")) {
      onNavigate(key);
      closeSider();
    }
  };

  const { t, i18n } = useTranslation("common");

  // Convert nav config to Ant Menu items
  const guideMenuItems = GUIDE_NAV.map((item) => ({
    key: item.path ?? item.key,
    label: t(
      item.key.split("/").pop() === "getting-started"
        ? "gettingStarted"
        : "guide",
    ),
  }));

  const componentMenuItems = COMPONENT_NAV.map((item) => ({
    key: item.path ?? item.key,
    label: item.label, // These are product names, usually keep as is or translate if needed
  }));
  /* 
  Actually Button is fine as "Button", but if we had "Bảng" vs "Table" we'd use:
  label: t(`components.${item.key.split('/').pop()}`)
*/

  const isHomePage = currentPath === "/";

  const SiderContent = () => (
    <div className="docs-sider-inner">
      {/* Guide */}
      <div className="docs-sider-heading">{t("guide")}</div>
      <Menu
        mode="inline"
        selectedKeys={[currentPath]}
        items={guideMenuItems}
        className="docs-menu"
        onClick={handleMenuClick}
      />

      {/* Components */}
      <div className="docs-sider-heading">{t("components")}</div>
      <Menu
        mode="inline"
        selectedKeys={[currentPath]}
        items={componentMenuItems}
        className="docs-menu"
        onClick={handleMenuClick}
      />

      {/* More */}
      <div className="docs-sider-heading">{t("more")}</div>
      <Menu
        mode="inline"
        selectedKeys={[currentPath]}
        items={[
          {
            key: "/changelog",
            label: (
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <HistoryOutlined style={{ fontSize: 13 }} />
                {t("changelog")}
              </span>
            ),
          },
        ]}
        className="docs-menu"
        onClick={handleMenuClick}
      />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* ═══ Topbar ═══════════════════════════════════════════ */}
      <header className="docs-topbar sticky top-0 z-20">
        <div className="docs-topbar-inner">
          {/* Mobile hamburger + brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Hamburger — only on < xl */}
            <button
              id="mobile-menu-toggle"
              className="docs-hamburger xl:hidden"
              onClick={toggleSider}
              aria-label="Toggle menu"
            >
              <span
                className={`docs-hamburger-line ${siderOpen ? "open" : ""}`}
              />
              <span
                className={`docs-hamburger-line ${siderOpen ? "open" : ""}`}
              />
              <span
                className={`docs-hamburger-line ${siderOpen ? "open" : ""}`}
              />
            </button>

            {/* Brand */}
            <a
              id="brand-home"
              href="/"
              className="docs-brand-lockup"
              onClick={handleClick("/")}
            >
              <BrandLockup />
            </a>
          </div>

          {/* Primary Nav */}

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Language Switcher */}
            <LanguageSwitcher />

            <div className="w-[1px] h-4 bg-slate-200 mx-1" />

            {/* Version Badge (static) */}
            <span id="version-badge" className="docs-version-badge">
              {CURRENT_VERSION.label}
            </span>

            {/* NPM icon */}
            <a
              id="nav-npm"
              className="docs-nav-link-icon"
              href={EXTERNAL_LINKS.NPM}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="NPM"
              title="NPM package"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                style={{ display: "block", flexShrink: 0 }}
              >
                <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474C23.214 24 24 23.214 24 22.237V1.763C24 .786 23.214 0 22.237 0H1.763ZM5.13 5.323l13.837.019-.009 13.836-3.464-.013.01-10.39h-3.456l-.012 10.379-6.903-.013L5.13 5.323Z" />
              </svg>
            </a>

            {/* GitHub icon */}
            <a
              id="nav-github"
              className="docs-nav-link-icon"
              href={EXTERNAL_LINKS.GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              title="GitHub"
            >
              <svg
                width="18"
                height="18"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
                style={{ display: "block", flexShrink: 0 }}
              >
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* ═══ Mobile Sider Overlay ══════════════════════════════ */}
      {siderOpen && (
        <div
          className="docs-mobile-overlay xl:hidden"
          onClick={closeSider}
          aria-hidden="true"
        />
      )}
      <div
        className={`docs-mobile-sider xl:hidden ${siderOpen ? "is-open" : ""}`}
      >
        <SiderContent />
      </div>

      {/* ═══ Body ════════════════════════════════════════════════ */}
      <Layout hasSider className="flex-1 !bg-white">
        {/* Desktop Sider */}
        <Sider
          width={256}
          theme="light"
          className="docs-sider hidden xl:block"
          style={{ overflow: "visible" }}
        >
          <SiderContent />
        </Sider>

        {/* Content */}
        <Content
          className="px-4 py-8 lg:px-10 !bg-white"
          style={{ overflow: "visible" }}
        >
          {isHomePage ? (
            // Homepage: full width, no right anchor
            <div className="mx-auto max-w-[900px]">{children}</div>
          ) : (
            <div
              className="mx-auto grid max-w-[1200px] gap-10 2xl:grid-cols-[minmax(0,1fr)_224px]"
              style={{ alignItems: "start" }}
            >
              <main className="min-w-0">{children}</main>

              {/* Right anchor */}
              <aside
                className="hidden 2xl:block"
                style={{
                  position: "sticky",
                  top: TOPBAR_H + 16,
                  alignSelf: "start",
                }}
              >
                {anchorItems.length > 0 && (
                  <div className="docs-anchor-wrap">
                    <div className="docs-anchor-title">
                      {t("i18n.anchorTitle", {
                        defaultValue:
                          i18n.language === "vi"
                            ? "Nội dung trang này"
                            : "On this page",
                      })}
                    </div>
                    <Anchor
                      className="docs-anchor"
                      items={anchorItems}
                      affix={false}
                      getCurrentAnchor={() => activeAnchor}
                    />
                  </div>
                )}
              </aside>
            </div>
          )}
        </Content>
      </Layout>
    </div>
  );
}
