import { Browser } from "@wailsio/runtime";

export default function ExternalLink({
  href,
  children,
  className = "",
  ...props
}) {
  const handleClick = (e) => {
    e.preventDefault();
    let url = href;
    if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }
    Browser.OpenURL(url).catch((err) => {
      console.error("Failed to open link:", err);
    });
  };

  return (
    <a href={href} onClick={handleClick} {...props} className={className}>
      {children}
      <sup className="font-semibold">[↗]</sup>
    </a>
  );
}
