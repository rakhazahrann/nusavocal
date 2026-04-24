export const normalizeSpeechText = (value?: string | null) =>
  (value || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

export const calculateLevenshteinDistance = (a: string, b: string) => {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let i = 0; i < rows; i += 1) matrix[i][0] = i;
  for (let j = 0; j < cols; j += 1) matrix[0][j] = j;

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
};

export const calculateWordOverlap = (a: string, b: string) => {
  if (!a || !b) return 0;

  const sourceWords = a.split(" ").filter(Boolean);
  const targetWords = b.split(" ").filter(Boolean);
  if (!sourceWords.length || !targetWords.length) return 0;

  const sourceSet = new Set(sourceWords);
  const targetSet = new Set(targetWords);
  let matches = 0;

  sourceSet.forEach((word) => {
    if (targetSet.has(word)) matches += 1;
  });

  return matches / Math.max(sourceSet.size, targetSet.size);
};

export const getMatchScore = (spoken: string, expected: string) => {
  const normalizedSpoken = normalizeSpeechText(spoken);
  const normalizedExpected = normalizeSpeechText(expected);

  if (!normalizedSpoken || !normalizedExpected) return 0;
  if (normalizedSpoken === normalizedExpected) return 1;

  const overlap = calculateWordOverlap(normalizedSpoken, normalizedExpected);
  const maxLength = Math.max(normalizedSpoken.length, normalizedExpected.length);
  const levenshtein =
    maxLength > 0
      ? 1 -
        calculateLevenshteinDistance(normalizedSpoken, normalizedExpected) /
          maxLength
      : 0;
  const inclusion =
    normalizedSpoken.includes(normalizedExpected) ||
    normalizedExpected.includes(normalizedSpoken)
      ? 0.9
      : 0;

  return Math.max(overlap, levenshtein, inclusion);
};
