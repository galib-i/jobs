import { Browser } from "@wailsio/runtime";

export default function ExternalLink({ href, children, ...props }) {
  const handleClick = (e) => {
    e.preventDefault();
    Browser.OpenURL(href).catch((err) => {
      console.error("Failed to open link:", err);
    });
  };

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
