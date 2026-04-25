export type StyleScores = Record<string, number>;

export function calculateScores(answers: { styleId: string }[]): {
  dominant: string;
  scores: StyleScores;
} {
  const scores: StyleScores = {};
  const firstSeen: Record<string, number> = {};

  answers.forEach(({ styleId }, index) => {
    scores[styleId] = (scores[styleId] ?? 0) + 1;
    if (firstSeen[styleId] === undefined) firstSeen[styleId] = index;
  });

  let dominant = "";
  let maxScore = 0;
  let earliestFirst = Infinity;

  for (const [styleId, score] of Object.entries(scores)) {
    if (
      score > maxScore ||
      (score === maxScore && firstSeen[styleId] < earliestFirst)
    ) {
      dominant = styleId;
      maxScore = score;
      earliestFirst = firstSeen[styleId];
    }
  }

  return { dominant, scores };
}
