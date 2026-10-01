const script = `try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t}catch(e){}`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}