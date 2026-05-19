/**
 * Calculates the Levenshtein distance between two strings.
 * This represents the minimum number of single-character edits (insertions, deletions, or substitutions)
 * required to change one word into the other.
 */
export function levenshteinDistance(a: string, b: string): number {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];

    // Increment along the first column of each row
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    // Increment each column in the first row
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(
                        matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1 // deletion
                    )
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

/**
 * Normalizes a string by converting to lowercase and stripping non-alphanumeric characters.
 */
export function normalizeForSearch(str: string): string {
    return str.toLowerCase().replace(/[^a-z0-9\s]/g, "");
}

/**
 * Fuzzy matches a query against a target string.
 * Returns a score where lower is better (0 = exact match).
 * Returns -1 if it's completely unrelated.
 */
export function fuzzyMatchScore(query: string, target: string): number {
    const normQuery = normalizeForSearch(query);
    const normTarget = normalizeForSearch(target);

    // If query is an exact substring, that's a perfect match (score 0)
    if (normTarget.includes(normQuery)) {
        return 0;
    }

    // Split target into words
    const targetWords = normTarget.split(/\s+/);
    
    let bestScore = Infinity;

    for (const word of targetWords) {
        if (!word) continue;
        
        // If word contains query as substring, great
        if (word.includes(normQuery)) {
            return 0;
        }

        const distance = levenshteinDistance(normQuery, word);
        
        // Dynamic threshold based on query length:
        // - 1-3 chars: allow 0 typos (too short)
        // - 4-6 chars: allow 1 typo
        // - 7+ chars: allow 2 typos
        let allowedTypos = 0;
        if (normQuery.length >= 7) allowedTypos = 2;
        else if (normQuery.length >= 4) allowedTypos = 1;

        if (distance <= allowedTypos) {
            bestScore = Math.min(bestScore, distance);
        }
    }

    return bestScore === Infinity ? -1 : bestScore;
}
