type RouteInfo = {
  from: string;
  to: string;
  line: string;
};

type TransitData = {
  routes: RouteInfo[];
  price: string;
};

function extractTransitData(): TransitData {
  const data: RouteInfo[] = [];
  let groupIndex = 0;

  while (true) {
    const group = document.getElementById(`transit_group_${groupIndex}`);
    if (!group) break;

    const h2s = group.querySelectorAll<HTMLHeadingElement>("h2");
    const routeName =
      group.querySelector("a")?.textContent?.trim() ?? "路線名不明";

    if (h2s.length >= 2) {
      const from = h2s[0]?.textContent?.trim() ?? "";
      const to = h2s[h2s.length - 1]?.textContent?.trim() ?? "";
      data.push({ from, to, line: routeName });
    }

    groupIndex++;
  }

  const priceText =
    document.getElementsByClassName("value")[0]?.textContent ?? "料金不明";

  return { routes: data, price: priceText };
}

function createOverlay(data: TransitData): void {
  const existing = document.getElementById("transit-overlay");
  if (existing) existing.remove();

  const div = document.createElement("div");
  div.id = "transit-overlay";
  div.style.position = "fixed";
  div.style.top = "10px";
  div.style.right = "10px";
  div.style.background = "white";
  div.style.border = "1px solid #ccc";
  div.style.borderRadius = "8px";
  div.style.padding = "12px";
  div.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
  div.style.zIndex = "99999";
  div.style.maxWidth = "300px";
  div.style.fontFamily = "sans-serif";
  div.style.fontSize = "14px";
  div.style.lineHeight = "1.6";

  const html = data.routes
    .map(
      (r) => `
      <div>
        🚌 ${r.from} → ${r.to}<br />
        <span style="color: #555;">${r.line}</span>
      </div>
    `
    )
    .join('<hr style="margin:6px 0;" />');

  // 📋 コピー用テキスト
  const copyText =
    data.routes.map((r) => `${r.line} ${r.from} ~ ${r.to}`).join("\n") +
    `\n\n料金: ${data.price}`;

  div.innerHTML = `
    <strong>🚉 乗換情報</strong><br />
    ${html}
    <hr style="margin:6px 0;" />
    <strong>💰 ${data.price}</strong><br/>
    <hr style="margin:6px 0;" />
    <strong>💬 編集＆コピー:</strong><br />
  `;

  // textarea
  const textarea = document.createElement("textarea");
  textarea.value = copyText;
  textarea.style.width = "100%";
  textarea.style.height = "100px";
  textarea.style.marginTop = "6px";
  textarea.style.boxSizing = "border-box";
  textarea.style.fontSize = "13px";
  textarea.style.fontFamily = "monospace";
  textarea.style.padding = "6px";
  textarea.style.border = "1px solid #ccc";
  textarea.style.borderRadius = "4px";
  textarea.spellcheck = false;

  // button
  const button = document.createElement("button");
  button.textContent = "📋 コピー";
  button.style.marginTop = "8px";
  button.style.padding = "6px 10px";
  button.style.border = "1px solid #ccc";
  button.style.borderRadius = "4px";
  button.style.background = "#f0f0f0";
  button.style.cursor = "pointer";
  button.style.fontSize = "14px";

  button.onclick = () => {
    navigator.clipboard.writeText(textarea.value);
    button.textContent = "✅ コピー";
    setTimeout(() => {
      button.textContent = "📋 コピー";
    }, 2000);
  };

  div.appendChild(textarea);
  div.appendChild(button);
  document.body.appendChild(div);
}

let lastDataJSON = "";

function updateIfChanged(): void {
  const current = extractTransitData();
  const currentJSON = JSON.stringify(current);
  if (currentJSON !== lastDataJSON) {
    lastDataJSON = currentJSON;
    createOverlay(current);
  }
}

// 初回表示
updateIfChanged();

// DOM変更を監視してルート情報が変わったら更新
const observer = new MutationObserver(() => {
  updateIfChanged();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
