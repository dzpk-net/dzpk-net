/**
 * 把本周精选写进账号主页。
 *
 * 数据和 dzpk-net/weekly 用的是同一个端点 https://dzpk.net/weekly.json —— 主站算好的
 * 结构化摘要。两个仓库各自去取、各自渲染,而不是让主页去抓 weekly 仓库的 Markdown:
 * 那样就得跨仓库拿写权限,得往这里塞一个 PAT。各取各的,两边都只用内置的 GITHUB_TOKEN,
 * 仓库里一个密钥都不用存。
 *
 * 主页和周报仓库的取舍不同。周报要全:每个主题五条、带摘要。主页是账号的门面,访客
 * 停留几秒,所以每个主题只取最有分量的一条,一共八条,扫一眼就知道这周发生了什么,
 * 想看全的点进周报仓库。
 *
 * 「完整周报」故意指向 weekly 仓库的首页而不是某一期的文件:那一期可能因为内容太少被
 * 跳过,也可能还没提交完,而仓库首页永远存在、而且总是嵌着最新一期。
 *
 * 用法:
 *   node scripts/build-profile.mjs                    # 取线上数据
 *   node scripts/build-profile.mjs --from report.json  # 用本地文件,排版调试时用
 */

import { readFile, writeFile } from 'node:fs/promises'
import process from 'node:process'

const FEED_URL = 'https://dzpk.net/weekly.json'
const WEEKLY_REPO = 'https://github.com/dzpk-net/weekly'
const README = 'README.md'
const START = '<!-- weekly:start -->'
const END = '<!-- weekly:end -->'
/** 主页列几条。够看出这周的广度,又不至于让访客滚半天。 */
const HEADLINES = 8
/** 少于这个数说明上游数据出了问题,宁可让主页留着上一期。 */
const MIN_TOPICS = 3

async function loadReport(from) {
  if (from) {
    return JSON.parse(await readFile(from, 'utf8'))
  }

  // 端点缓存一小时,而这里一周只来一次。带个参数绕开,免得刚改了上游逻辑还拿到旧结果。
  const response = await fetch(`${FEED_URL}?t=${Date.now()}`, { headers: { 'user-agent': 'dzpk-profile/1' } })

  if (!response.ok) {
    throw new Error(`${FEED_URL} 返回 ${response.status}`)
  }

  return response.json()
}

/** 2026-08-03T10:00:00+00:00 → 8 月 3 日。按 UTC 读,和主站的时间戳一致。 */
function formatDay(iso) {
  const date = new Date(iso)

  return `${date.getUTCMonth() + 1} 月 ${date.getUTCDate()} 日`
}

/** 标题来自频道正文,里面出现过 `[`、`*`、`_`,不转义会把一行拆成半个链接或莫名的斜体。 */
function escapeMarkdown(text) {
  return text.replace(/[\\`*_[\]<>|]/g, char => `\\${char}`)
}

function render(report) {
  const lines = [
    '## 本周精选',
    '',
    `> ${formatDay(report.from)} – ${formatDay(report.to)} · 本周更新 ${report.total} 篇 · [完整周报](${WEEKLY_REPO})`,
    '',
  ]

  // 每个主题取头一条。topics 已按分量排好,posts 里第一条是该主题最新的。
  for (const topic of report.topics.slice(0, HEADLINES)) {
    const post = topic.posts[0]

    lines.push(`- **[${escapeMarkdown(post.title)}](${post.url})** · [${escapeMarkdown(topic.tag)}](${topic.url})`)
  }

  lines.push('', `按主题看全部 ${report.topics.length} 个栏目：[${report.label} 周报](${WEEKLY_REPO})`)

  return lines.join('\n')
}

/** 把两个标记之间整段换掉。找不到标记就报错,别悄悄什么都不做。 */
function replaceRegion(readme, content) {
  const from = readme.indexOf(START)
  const to = readme.indexOf(END)

  if (from < 0 || to < 0) {
    throw new Error(`README 里找不到 ${START} … ${END} 标记`)
  }

  return `${readme.slice(0, from + START.length)}\n${content}\n${readme.slice(to)}`
}

const at = process.argv.indexOf('--from')
const report = await loadReport(at >= 0 ? process.argv[at + 1] : undefined)

if ((report.topics?.length ?? 0) < MIN_TOPICS) {
  console.info(`只分出 ${report.topics?.length ?? 0} 个主题,不足 ${MIN_TOPICS} 个,主页保持原样`)
  process.exit(0)
}

await writeFile(README, replaceRegion(await readFile(README, 'utf8'), render(report)), 'utf8')

console.info(`已更新主页:${report.label},列出 ${Math.min(report.topics.length, HEADLINES)} 条,共 ${report.topics.length} 个栏目`)
