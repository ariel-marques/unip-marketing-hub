// Script to change header style on scroll
window.addEventListener("scroll", function () {
  const nav = header.querySelector("nav");
  const logo = document.getElementById("logo-unip");

  if (window.scrollY > 30) {
    header.classList.add("scrolled");
    nav.classList.remove("bg-azul-naval");
    logo.src = "/assets/img/logo/logo-unip-azul.svg";
  } else {
    header.classList.remove("scrolled");
    nav.classList.add("bg-azul-naval");
    logo.src = "/assets/img/logo/logo-unip.svg";
  }
});

// Script to download all files in a card as a ZIP
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".download-all").forEach((button) => {
    button.addEventListener("click", async () => {
      // evita duplo clique enquanto está baixando
      if (button.dataset.loading === "true") return;

      const card = button.closest(".card");
      if (!card) return;

      const files = Array.from(card.querySelectorAll("ul.list-materiais a"))
        .map((a) => a.getAttribute("href"))
        .filter((href) => href && !href.startsWith("#"));

      if (!files.length) {
        alert("Nenhum arquivo disponível para download neste card.");
        return;
      }

      // 🧾 nome da pasta / arquivo zip
      const folderName =
        button.dataset.folderName ||
        "materiais-marketing";

      // 🔁 estado de loading no botão
      const originalHtml = button.innerHTML;
      const originalMinWidth = button.style.minWidth;
      const width = button.offsetWidth;

      button.dataset.loading = "true";
      button.disabled = true;
      button.style.minWidth = width + "px"; // evita "pular" o layout

      button.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Preparando download...
      `;

      try {
        const zip = new JSZip();
        const folder = zip.folder(folderName);

        for (const fileUrl of files) {
          try {
            const response = await fetch(fileUrl);
            if (!response.ok) {
              console.warn("Erro ao baixar:", fileUrl, response.status);
              continue;
            }
            const blob = await response.blob();
            const fileName = fileUrl.split("/").pop() || "arquivo.bin";
            folder.file(fileName, blob);
          } catch (error) {
            console.warn("Erro ao adicionar arquivo:", fileUrl, error);
          }
        }

        const zipBlob = await zip.generateAsync({ type: "blob" });
        saveAs(zipBlob, `${folderName}.zip`);

        // Se quiser dar um feedback de sucesso, pode trocar o texto rapidamente:
        // button.innerHTML = "Download iniciado!";
      } catch (error) {
        console.error(error);
        alert("Ocorreu um erro ao preparar o download. Tente novamente.");
      } finally {
        // 🔚 volta o botão ao estado normal
        button.dataset.loading = "false";
        button.disabled = false;
        button.innerHTML = originalHtml;
        button.style.minWidth = originalMinWidth;
      }
    });
  });
});




// Script for searching materials

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("materialSearch");
  const resultsBox = document.getElementById("searchResults");
  const header = document.getElementById("topo"); // header fixo

  if (!searchInput || !resultsBox) return;

  const STOPWORDS = ["de", "da", "do", "das", "dos"];

  const normalize = (str) =>
    str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const normalizeForMatch = (str) => {
    const base = normalize(str);
    const parts = base.split(/\s+/).filter((p) => p.length > 0);
    const filtered = parts.filter((p) => !STOPWORDS.includes(p));
    return filtered.join(" ");
  };

  function scrollToElement(el) {
    if (!el) return;

    const headerHeight = header ? header.offsetHeight : 0;
    const extra = 16; // margem de respiro

    const rect = el.getBoundingClientRect();
    const targetY = rect.top + window.pageYOffset - headerHeight - extra;

    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
  }

  const records = [];

  // 🔹 Captura todas as seções de campanhas
  const campaignSections = document.querySelectorAll('section[id^="materiais-"]');

  campaignSections.forEach((section) => {
    const campaignTitleEl = section.querySelector("h3");
    if (!campaignTitleEl) return;

    const campaignName = campaignTitleEl.textContent.trim();
    const campaignMatch = normalizeForMatch(campaignName);
    const campaignCardEl = section.querySelector(".card");

    // ➕ 1. Campanha
    records.push({
      type: "campaign",
      campaignName,
      match: campaignMatch,
      el: campaignCardEl || campaignTitleEl,
    });

    // ➕ 2. Materiais gerais (Offline / Online / OOH)
    const generalBlocks = section.querySelectorAll(".category-materiais");
    generalBlocks.forEach((categoryTitleEl) => {
      const catText = categoryTitleEl.textContent.trim().toLowerCase();
      if (
        catText.includes("offline") ||
        catText.includes("on-line") ||
        catText.includes("online") ||
        catText.includes("ooh")
      ) {
        const ul = categoryTitleEl.nextElementSibling;
        if (!ul || !ul.classList.contains("list-materiais")) return;

        ul.querySelectorAll("li a").forEach((link) => {
          const materialName = link.textContent.trim();
          const materialMatch = normalizeForMatch(materialName);

          const card = link.closest(".card") || section;

          records.push({
            type: "material",
            campaignName,
            materialName,
            match: materialMatch,
            el: card,
          });
        });
      }
    });

    // ➕ 3. Materiais por unidade (Campus ...)
    const unitBlocks = section.querySelectorAll(".category-materiais");
    unitBlocks.forEach((unitTitleEl) => {
      const unitTitle = unitTitleEl.textContent.trim();
      const normalizedUnit = normalizeForMatch(unitTitle);

      const isStandardCategory =
        normalizedUnit === "offline" ||
        normalizedUnit === "on-line" ||
        normalizedUnit === "online" ||
        normalizedUnit === "ooh";

      if (isStandardCategory) return; // evita duplicar com materiais gerais

      const ul = unitTitleEl.nextElementSibling;
      if (!ul || !ul.classList.contains("list-materiais")) return;

      ul.querySelectorAll("li a").forEach((link) => {
        const materialName = link.textContent.trim();
        const matchCombined = normalizeForMatch(
          `${campaignName} ${unitTitle} ${materialName}`
        );

        const card = link.closest(".card") || section;

        records.push({
          type: "unit-material",
          campaignName,
          unitName: unitTitle,
          materialName,
          match: matchCombined,
          el: card,
        });
      });
    });
  });

  // 🔍 Busca
  searchInput.addEventListener("input", (e) => {
    const raw = e.target.value;
    const q = normalizeForMatch(raw);

    if (q.length < 2) {
      resultsBox.innerHTML = "";
      resultsBox.classList.add("d-none");
      return;
    }

    let matches = records.filter((item) => item.match.includes(q));

    // 🔧 Evita duplicatas — se existir material e unit-material com o mesmo nome, mantém só o da campanha
    const unique = new Map();
    matches.forEach((item) => {
      const key = `${item.campaignName}-${item.materialName || ""}`;
      if (!unique.has(key) || item.type === "material") {
        unique.set(key, item);
      }
    });
    matches = Array.from(unique.values());

    if (!matches.length) {
      resultsBox.innerHTML = `<div class="p-2 text-muted small">Nenhum resultado encontrado.</div>`;
      resultsBox.classList.remove("d-none");
      return;
    }

    // monta resultados
    resultsBox.innerHTML = matches
      .map((item, idx) => {
        if (item.type === "campaign") {
          return `
            <div class="search-item" data-idx="${idx}">
              <div>
                <strong>${item.campaignName}</strong><br>
                <small>Ir para campanha</small>
              </div>
              <span class="badge-type">campanha</span>
            </div>
          `;
        } else if (item.type === "material") {
          return `
            <div class="search-item" data-idx="${idx}">
              <div>
                <strong>${item.campaignName}</strong><br>
                <small>${item.materialName}</small>
              </div>
              <span class="badge-type">material</span>
            </div>
          `;
        } else {
          return `
            <div class="search-item" data-idx="${idx}">
              <div>
                <strong>${item.campaignName}</strong><br>
                <small>${item.unitName} / ${item.materialName}</small>
              </div>
              <span class="badge-type">unidade</span>
            </div>
          `;
        }
      })
      .join("");

    resultsBox.classList.remove("d-none");

    // Clique no resultado
    resultsBox.querySelectorAll(".search-item").forEach((el) => {
      el.addEventListener("click", () => {
        const idx = el.getAttribute("data-idx");
        const item = matches[idx];

        // 👇 esconde primeiro, deixa o layout "assentar"
        resultsBox.classList.add("d-none");

        if (item && item.el) {
          // espera 1 frame para o layout atualizar sem o box
          setTimeout(() => {
            scrollToElement(item.el);
          }, 0);
        }
      });
    });
  });
});


// botão voltar ao topo
document.addEventListener("DOMContentLoaded", () => {
  const backToTop = document.getElementById("backToTop");
  if (!backToTop) return;

  // começa escondido
  backToTop.style.display = "none";

  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      backToTop.style.display = "block";
    } else {
      backToTop.style.display = "none";
    }
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
});


// Script para transformar lista de comunicados em accordion
document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("lista-comunicados");
  if (!list) return;

  const artigos = Array.from(list.querySelectorAll("article.comunicado"));
  if (!artigos.length) return;

  list.classList.add("comunicados-list");

  const accordionItems = [];
  const hoje = new Date();

  // mesmo helper da home
  function parseDate(str) {
    if (!str) return null;

    // ISO 2026-01-04
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
      return new Date(str + "T00:00:00");
    }

    // dd/mm/yyyy
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
      const [d, m, y] = str.split("/");
      return new Date(+y, +m - 1, +d);
    }

    const d = new Date(str);
    return isNaN(d.getTime()) ? null : d;
  }

  artigos.forEach((art, index) => {
    const h3 = art.querySelector("h3");
    const time = art.querySelector("time");
    const paragraphs = Array.from(art.querySelectorAll("p"));

    // garantia de id pra poder ancorar da home
    if (!art.id) art.id = `comunicado-${index + 1}`;

    art.classList.add("comunicado-item");
    art.style.position = "relative"; // só por segurança

    // HEADER
    const header = document.createElement("div");
    header.className = "comunicado-header";

    const titleEl = document.createElement("div");
    titleEl.className = "comunicado-titulo";
    titleEl.textContent = h3 ? h3.textContent.trim() : "Comunicado";

    const dateEl = document.createElement("div");
    dateEl.className = "comunicado-data";
    dateEl.textContent = time ? `Publicado em ${time.textContent.trim()}` : "";

    header.appendChild(titleEl);
    header.appendChild(dateEl);

    // BODY
    const body = document.createElement("div");
    body.className = "comunicado-body";

    const bodyContent = document.createElement("div");
    bodyContent.className = "comunicado-body-content";
    paragraphs.forEach((p) => bodyContent.appendChild(p));
    body.appendChild(bodyContent);

    // limpa e remonta
    art.innerHTML = "";
    art.appendChild(header);
    art.appendChild(body);

    // 🔔 badge "Novo" (da página, NÃO o da home)
    const dateStr =
      time?.getAttribute("datetime") || time?.textContent.trim() || "";
    const dateObj = parseDate(dateStr);

    if (dateObj) {
      const diffDays =
        (hoje.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays <= 7) {
        const badge = document.createElement("span");
        badge.className = "badge-novo"; // usa o pequeno da página
        badge.textContent = "Novo";
        // colamos no título, fica bonito e usa o margin-left do CSS
        titleEl.appendChild(badge);
      }
    }

    accordionItems.push(art);
  });

  // abre/fecha
  function openItem(item, doScroll = false) {
    const body = item.querySelector(".comunicado-body");
    const content = item.querySelector(".comunicado-body-content");

    accordionItems.forEach((i) => {
      i.classList.remove("is-open");
      const b = i.querySelector(".comunicado-body");
      if (b) b.style.maxHeight = 0;
    });

    item.classList.add("is-open");
    if (body && content) {
      body.style.maxHeight = content.scrollHeight + "px";
    }

    if (doScroll) {
      setTimeout(() => {
        item.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    }
  }

  // clique
  accordionItems.forEach((item) => {
    const header = item.querySelector(".comunicado-header");
    header.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");
      if (isOpen) {
        item.classList.remove("is-open");
        const b = item.querySelector(".comunicado-body");
        if (b) b.style.maxHeight = 0;
      } else {
        openItem(item, true);
      }
    });
  });

  // se vier com #id da home, abre o certo
  const hash = window.location.hash ? window.location.hash.substring(1) : "";
  if (hash) {
    const target = accordionItems.find((it) => it.id === hash);
    if (target) {
      openItem(target, true);
      return;
    }
  }

  // senão abre o primeiro
  if (accordionItems.length) {
    openItem(accordionItems[0], false);
  }
});