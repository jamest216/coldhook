export interface PersonalizationInput {
  body: string
  subject: string
  firstName: string
  company: string
  trigger: string
}

export interface SpamInput {
  subject: string
  body: string
}

export interface SpamFlag {
  rule: string
  severity: "high" | "medium" | "low"
  deduction: number
  detail: string
}

export interface PersonalizationResult {
  score: number
  breakdown: {
    nameIdentity: number
    triggerContext: number
    subjectQuality: number
    ctaPresence: number
    lengthStructure: number
  }
}

export interface SpamResult {
  score: number
  flags: SpamFlag[]
  isClean: boolean
}

const SPAM_TRIGGER_PHRASES = [
  "act now",
  "limited time",
  "click here",
  "dear sir",
  "to whom it may concern",
  "100% free",
  "guaranteed",
  "risk-free",
  "no obligation",
  "order now",
  "exclusive offer",
  "this is not spam",
  "you've been selected",
]

const CTA_KEYWORDS = [
  "?",
  "chat",
  "call",
  "demo",
  "meet",
  "calendar",
  "time",
  "schedule",
  "connect",
  "talk",
  "discuss",
  "catch up",
  "quick",
  "minutes",
  "coffee",
  "zoom",
]

function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 3)
}

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length
}

function lastSentence(text: string): string {
  const sentences = text.split(/[.!?]\s*/).filter(Boolean)
  return sentences[sentences.length - 1]?.toLowerCase() ?? ""
}

export function computePersonalizationScore(
  input: PersonalizationInput
): PersonalizationResult {
  const { body, subject, firstName, company, trigger } = input
  const bodyLower = body.toLowerCase()

  // Name/identity (0-30)
  let nameIdentity = 0
  if (firstName.length > 0 && bodyLower.includes(firstName.toLowerCase())) {
    nameIdentity += 15
  }
  if (company.length > 0 && bodyLower.includes(company.toLowerCase())) {
    nameIdentity += 15
  }

  // Trigger/context (0-25)
  let triggerContext = 10 // baseline — AI prompt injects context
  const triggerWords = extractKeywords(trigger)
  const matchedTrigger = triggerWords.some((w) => bodyLower.includes(w))
  if (matchedTrigger) {
    triggerContext += 15
  }

  // Subject quality (0-20)
  const subjLen = subject.length
  let subjectQuality: number
  if (subjLen >= 30 && subjLen <= 60) {
    subjectQuality = 20
  } else if ((subjLen >= 20 && subjLen < 30) || (subjLen > 60 && subjLen <= 80)) {
    subjectQuality = 12
  } else {
    subjectQuality = 5
  }

  // CTA presence (0-15)
  const last = lastSentence(body)
  const hasCta = CTA_KEYWORDS.some((kw) => last.includes(kw))
  const ctaPresence = hasCta ? 15 : 0

  // Length & structure (0-10)
  const wc = wordCount(body)
  let lengthStructure: number
  if (wc < 120) {
    lengthStructure = 10
  } else if (wc < 200) {
    lengthStructure = 5
  } else {
    lengthStructure = 0
  }

  return {
    score: nameIdentity + triggerContext + subjectQuality + ctaPresence + lengthStructure,
    breakdown: { nameIdentity, triggerContext, subjectQuality, ctaPresence, lengthStructure },
  }
}

export function computeSpamScore(input: SpamInput): SpamResult {
  const { subject, body } = input
  const flags: SpamFlag[] = []
  let score = 100

  // ALL CAPS words
  const capsMatches = body.match(/\b[A-Z]{3,}\b/g) ?? []
  if (capsMatches.length > 2) {
    const ded = Math.min(capsMatches.length * 10, 30)
    score -= ded
    flags.push({
      rule: "Excessive ALL CAPS",
      severity: "medium",
      deduction: ded,
      detail: `${capsMatches.length} all-caps words found (e.g. "${capsMatches.slice(0, 3).join('", "')}")`,
    })
  }

  // Excessive punctuation
  const punctMatches = body.match(/(!!|\?\?|!\?)/g) ?? []
  if (punctMatches.length > 0) {
    const ded = Math.min(punctMatches.length * 10, 20)
    score -= ded
    flags.push({
      rule: "Excessive punctuation",
      severity: "medium",
      deduction: ded,
      detail: `${punctMatches.length} double-punctuation mark(s) found`,
    })
  }

  // Spam trigger phrases
  const bodyLower = body.toLowerCase()
  const matchedPhrases = SPAM_TRIGGER_PHRASES.filter((phrase) =>
    bodyLower.includes(phrase)
  )
  if (matchedPhrases.length > 0) {
    const ded = Math.min(matchedPhrases.length * 15, 45)
    score -= ded
    flags.push({
      rule: "Spam trigger phrases",
      severity: "high",
      deduction: ded,
      detail: `Found: "${matchedPhrases.join('", "')}"`,
    })
  }

  // Link-heavy
  const urlCount = (body.match(/https?:\/\//g) ?? []).length
  if (urlCount > 2) {
    score -= 10
    flags.push({
      rule: "Too many links",
      severity: "medium",
      deduction: 10,
      detail: `${urlCount} URLs found (keep it to 0–2)`,
    })
  }

  // ALL CAPS subject
  const alphaChars = subject.replace(/[^a-zA-Z]/g, "")
  if (alphaChars.length > 5) {
    const upperRatio =
      (alphaChars.match(/[A-Z]/g) ?? []).length / alphaChars.length
    if (upperRatio > 0.8) {
      score -= 20
      flags.push({
        rule: "Subject in ALL CAPS",
        severity: "high",
        deduction: 20,
        detail: "All-caps subjects trigger spam filters",
      })
    }
  }

  // Fake thread subject
  if (/^(RE|FWD):\s*/i.test(subject)) {
    score -= 15
    flags.push({
      rule: "Fake thread prefix",
      severity: "high",
      deduction: 15,
      detail: 'Subject starts with "RE:" or "FWD:" — looks deceptive',
    })
  }

  return {
    score: Math.max(0, score),
    flags,
    isClean: score >= 80,
  }
}

export function scoreEmail(
  persInput: PersonalizationInput,
  spamInput: SpamInput
): { personalization: PersonalizationResult; spam: SpamResult } {
  return {
    personalization: computePersonalizationScore(persInput),
    spam: computeSpamScore(spamInput),
  }
}
