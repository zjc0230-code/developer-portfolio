/** 将 site.json 渲染为 web/index.html */

export function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function liList(items) {
  if (!items?.length) return '';
  return `<ul class="plain">${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
}

function renderIndustryDetail(ind, alt) {
  const capRows = ind.capabilityMap
    .map(
      (r) =>
        `<tr><td>${esc(r.domain)}</td><td>${esc(r.points)}</td><td>${esc(r.results)}</td></tr>`,
    )
    .join('');

  const cross =
    ind.crossLinks?.length > 0
      ? `<p class="cross-links">关联：${ind.crossLinks
          .map((link, i) => {
            const sep = i > 0 ? ' · ' : '';
            return link.industryId
              ? `${sep}<a href="#industry-${esc(link.industryId)}">${esc(link.name)}</a>`
              : `${sep}<span>${esc(link.name)}</span>`;
          })
          .join('')}</p>`
      : '';

  const tech =
    ind.techSolutions?.length > 0
      ? `<div class="l3-block">
      <h3 class="l3-title">技术方案（L3）</h3>
      <div class="l3-list">${ind.techSolutions
        .map(
          (t) => `<article class="card l3-item">
        <h4>${esc(t.title)}</h4>
        <p>${esc(t.summary)}</p>
        <code class="doc-path">${esc(t.docPath)}</code>
      </article>`,
        )
        .join('')}</div></div>`
      : '';

  const projects =
    ind.projects?.length > 0
      ? `<div class="l3-block">
      <h3 class="l3-title">项目经验（L3）</h3>
      <div class="l3-list">${ind.projects
        .map((p) => {
          const tags = p.tags?.length
            ? `<div class="tags">${p.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>`
            : '';
          return `<article class="card l3-item">
        <div class="proj-head">
          <h4>${esc(p.title)}</h4>
          ${p.period ? `<span class="proj-period">${esc(p.period)}</span>` : ''}
        </div>
        ${p.role ? `<p class="proj-role">${esc(p.role)}</p>` : ''}
        <p>${esc(p.oneLiner)}</p>
        ${tags}
        <code class="doc-path">${esc(p.docPath)}</code>
      </article>`;
        })
        .join('')}</div></div>`
      : '';

  return `<section id="industry-${esc(ind.id)}" class="section industry-detail${alt ? ' alt' : ''}">
  <div class="container">
    <h2 class="section-title">${esc(ind.name)}</h2>
    <p class="industry-overview">${esc(ind.overview)}</p>
    <div class="industry-grid">
      <div class="card"><h4>行业格局</h4><p>${esc(ind.landscape)}</p></div>
      <div class="card"><h4>核心挑战</h4>${liList(ind.problems)}</div>
    </div>
    <div class="card framework-card">
      <h4>解决方案框架</h4>
      <p>${esc(ind.frameworkSummary)}</p>
      ${ind.principles?.length ? liList(ind.principles.slice(0, 4)) : ''}
    </div>
    ${
      capRows
        ? `<div class="cap-table-wrap"><h4>能力地图</h4>
      <table class="cap-table"><thead><tr><th>能力域</th><th>实践要点</th><th>代表成果</th></tr></thead>
      <tbody>${capRows}</tbody></table></div>`
        : ''
    }
    ${cross}
    ${tech}
    ${projects}
  </div>
</section>`;
}

export function renderIndexHtml(site) {
  const { l1, l2, readingPath } = site;
  const {
    profile,
    tagline,
    summary,
    highlights,
    metrics,
    intents,
    experience,
    skills,
    education,
    showcaseIntro,
    featuredProjects,
  } = l1;
  const featured = l2.industries.filter((i) => i.featured);
  const platform = l2.platform;

  const title = `${profile.name} · 个人主页`;
  const desc = l1.summary?.slice(0, 120) ?? '';

  const pathHtml = readingPath
    .map((step, i) => (i > 0 ? `<span class="path-sep">→</span>` : '') + `<span>${esc(step)}</span>`)
    .join('');

  const metricsHtml = metrics?.length
    ? `<div class="metrics">${metrics
        .map(
          (m) => `<div class="metric"><div class="metric-value">${esc(m.value)}</div><div class="metric-label">${esc(m.label)}</div></div>`,
        )
        .join('')}</div>`
    : '';

  const highlightsBlock = highlights?.length
    ? `<ul class="highlights">${highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>`
    : '';

  const showcaseIntroHtml = showcaseIntro
    ? `<p class="showcase-intro">${esc(showcaseIntro)}</p>`
    : '';

  const featuredProjHtml = featuredProjects?.length
    ? `<section class="featured-projects">
      <h2 class="featured-projects-title">精选技术案例</h2>
      <div class="featured-projects-grid">${featuredProjects
        .map(
          (p) => `<article class="card featured-project-card">
        <span class="featured-project-industry">${esc(p.industry)}</span>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.highlight)}</p>
        <code class="doc-path">${esc(p.docPath)}</code>
      </article>`,
        )
        .join('')}</div>
    </section>`
    : '';

  const cardsHtml = featured
    .map(
      (ind) => `<a href="#industry-${esc(ind.id)}" class="industry-card card">
      <span class="industry-card-tag">L2</span>
      <h3>${esc(ind.shortName)}</h3>
      <p class="industry-card-name">${esc(ind.name)}</p>
      <p class="industry-card-summary">${esc(ind.cardSummary)}</p>
      <span class="industry-card-cta">${ind.projects.length} 个项目 · ${ind.techSolutions.length} 篇技术方案</span>
    </a>`,
    )
    .join('');

  const industriesHtml = featured
    .map((ind, i) => renderIndustryDetail(ind, i % 2 === 1))
    .join('\n');

  const platformHtml = platform
    ? `<section id="platform" class="section platform-section">
  <div class="container">
    <h2 class="section-title">技术底座</h2>
    <p class="section-desc">${esc(platform.name)} — 支撑游戏、虚拟人、电商等业务线的横切能力</p>
    <div class="card platform-card">
      <p>${esc(platform.overview)}</p>
      <p>${esc(platform.landscape)}</p>
      ${
        platform.capabilityMap?.length
          ? `<div class="platform-metrics">${platform.capabilityMap
              .map(
                (r) => `<div class="platform-metric"><span class="pm-label">${esc(r.domain)}</span><span class="pm-value">${esc(r.results)}</span></div>`,
              )
              .join('')}</div>`
          : ''
      }
      ${
        platform.projects?.length
          ? `<div class="platform-projects"><h4>相关项目经验</h4><ul class="plain">${platform.projects
              .map(
                (p) =>
                  `<li><strong>${esc(p.title)}</strong>${p.period ? `（${esc(p.period)}）` : ''} — ${esc(p.oneLiner)}</li>`,
              )
              .join('')}</ul></div>`
          : ''
      }
    </div>
  </div>
</section>`
    : '';

  const expHtml = experience
    .map(
      (exp) => `<article class="card exp-card">
      <div class="exp-head">
        <div>
          <h3>${esc(exp.company)}</h3>
          <p class="exp-role">${esc(exp.role)}</p>
          ${exp.department ? `<p class="exp-dept">${esc(exp.department)}</p>` : ''}
        </div>
        <span class="exp-period">${esc(exp.period)}</span>
      </div>
      ${exp.summary ? `<p class="exp-summary">${esc(exp.summary)}</p>` : ''}
      ${liList(exp.achievements)}
    </article>`,
    )
    .join('');

  const skillsHtml = skills
    .map(
      (s) => `<div class="skill-block card"><h4>${esc(s.category)}</h4><ul>${s.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></div>`,
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="css/main.css" />
</head>
<body>
  <header class="header">
    <div class="header-inner container">
      <a href="#" class="logo">${esc(profile.name)}</a>
      <nav class="nav">
        <a href="#about">简介</a>
        <a href="#industries">产业</a>
        <a href="#platform">技术底座</a>
        <a href="#experience">经历</a>
        <a href="#contact">联系</a>
      </nav>
    </div>
  </header>

  <main>
    <section id="about" class="hero">
      <div class="container hero-inner">
        <p class="hero-label">${esc(profile.company)}</p>
        <h1>${esc(profile.name)}</h1>
        <p class="hero-en">${esc(profile.nameEn)}</p>
        <p class="hero-title">${esc(profile.title)}</p>
        <p class="hero-tagline">${esc(tagline)}</p>
        <p class="hero-summary">${esc(summary)}</p>
        ${showcaseIntroHtml}
        <div class="hero-meta">
          <span>${esc(profile.location)}</span><span>·</span><span>${esc(profile.years)} 经验</span>
        </div>
        ${highlightsBlock}
        ${metricsHtml}
      </div>
    </section>

    <section class="section path-section">
      <div class="container"><p class="path-hint">推荐阅读：${pathHtml}</p></div>
    </section>

    ${
      featuredProjHtml
        ? `<section class="section featured-projects-section"><div class="container">${featuredProjHtml}</div></section>`
        : ''
    }

    <section id="industries" class="section">
      <div class="container">
        <h2 class="section-title">专业产业方向</h2>
        <p class="section-desc">宏观行业理解（L2）→ 技术方案 → 项目经验（L3）</p>
        <div class="industry-cards">${cardsHtml}</div>
      </div>
    </section>

    ${industriesHtml}

    ${platformHtml}

    <section class="section">
      <div class="container">
        <h2 class="section-title">求职意向</h2>
        <div class="card intent-card">
          <p><strong>目标职位：</strong>${esc(intents.roles.join(' / '))}</p>
          <p><strong>工作地点：</strong>${esc(intents.location)} · <strong>状态：</strong>${esc(intents.status)}</p>
          <p class="intent-focus">${esc(intents.focus)}</p>
        </div>
      </div>
    </section>

    <section id="experience" class="section">
      <div class="container">
        <h2 class="section-title">工作经历</h2>
        ${expHtml}
      </div>
    </section>

    <section id="skills" class="section">
      <div class="container">
        <h2 class="section-title">技术能力</h2>
        <div class="skills-grid">${skillsHtml}</div>
      </div>
    </section>

    <section id="education" class="section">
      <div class="container">
        <h2 class="section-title">教育背景</h2>
        <div class="card">
          <h3>${esc(education.school)}</h3>
          <p>${esc(education.major)} · ${esc(education.degree)}</p>
          <p class="edu-period">${esc(education.period)}</p>
          ${education.honors?.length ? `<h4 class="sub-title">荣誉</h4>${liList(education.honors)}` : ''}
          ${education.activities?.length ? `<h4 class="sub-title">校园经历</h4>${liList(education.activities)}` : ''}
        </div>
      </div>
    </section>

    <section id="contact" class="section contact-section">
      <div class="container">
        <h2 class="section-title">联系方式</h2>
        <div class="contact-grid">
          <div class="card contact-item">
            <span class="contact-label">邮箱</span>
            <a href="mailto:${esc(profile.email)}">${esc(profile.email)}</a>
          </div>
          <div class="card contact-item">
            <span class="contact-label">Gmail</span>
            <a href="mailto:${esc(profile.emailAlt)}">${esc(profile.emailAlt)}</a>
          </div>
          <div class="card contact-item">
            <span class="contact-label">手机 / 微信</span>
            <a href="tel:${esc(profile.phone)}">${esc(profile.phone)}</a>
          </div>
          <div class="card contact-item">
            <span class="contact-label">所在地</span>
            <span>${esc(profile.location)}</span>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="container footer-inner">
      <p>© ${new Date().getFullYear()} ${esc(profile.name)}. 个人作品集</p>
      <p class="muted">由 docs/ 同步生成 · 纯静态 HTML</p>
    </div>
  </footer>
</body>
</html>`;
}
