"use server";

// Finnhub API configuration
const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";
const NEXT_PUBLIC_FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

// Type definitions for Finnhub API responses
interface FinnhubNewsArticle {
	id?: number;
	category?: string;
	datetime: number;
	headline: string;
	image?: string;
	related?: string;
	source: string;
	summary: string;
	url: string;
}

interface FormattedNewsArticle {
	id: string;
	headline: string;
	summary: string;
	source: string;
	url: string;
	datetime: number;
	image?: string;
	symbol?: string;
}

/**
 * Generic fetch function for Finnhub API with caching options
 * @param url - Full URL to fetch
 * @param revalidateSeconds - Optional cache revalidation time in seconds
 * @returns Parsed JSON response
 */
export const fetchJSON = async <T>(
	url: string,
	revalidateSeconds?: number
): Promise<T> => {
	const fetchOptions: RequestInit = revalidateSeconds
		? {
				cache: "force-cache",
				next: { revalidate: revalidateSeconds },
		  }
		: {
				cache: "no-store",
		  };

	const response = await fetch(url, fetchOptions);

	if (!response.ok) {
		throw new Error(
			`Finnhub API error: ${response.status} ${response.statusText}`
		);
	}

	return response.json();
};

/**
 * Validate if a news article has all required fields
 */
const isValidArticle = (article: FinnhubNewsArticle): boolean => {
	return !!(
		article.headline &&
		article.summary &&
		article.url &&
		article.datetime &&
		article.source
	);
};

/**
 * Format a Finnhub article to our standard format
 */
const formatArticle = (
	article: FinnhubNewsArticle,
	symbol?: string
): FormattedNewsArticle => {
	return {
		id: article.id?.toString() || article.url,
		headline: article.headline,
		summary: article.summary,
		source: article.source,
		url: article.url,
		datetime: article.datetime,
		image: article.image,
		symbol,
	};
};

/**
 * Get news articles - either for specific symbols (watchlist) or general market news
 * @param symbols - Optional array of stock symbols to fetch news for
 * @returns Array of formatted news articles (max 6)
 */
export const getNews = async (
	symbols?: string[]
): Promise<FormattedNewsArticle[]> => {
	try {
		if (!NEXT_PUBLIC_FINNHUB_API_KEY) {
			throw new Error("Finnhub API key is not configured");
		}

		// Calculate date range for last 5 days
		const toDate = new Date();
		const fromDate = new Date();
		fromDate.setDate(fromDate.getDate() - 5);

		const toDateStr = toDate.toISOString().split("T")[0];
		const fromDateStr = fromDate.toISOString().split("T")[0];

		// If symbols are provided, fetch company news with round-robin
		if (symbols && symbols.length > 0) {
			// Clean and uppercase symbols
			const cleanSymbols = symbols
				.map((s) => s.trim().toUpperCase())
				.filter((s) => s.length > 0);

			if (cleanSymbols.length === 0) {
				// Fallback to general news if no valid symbols
				return getNews();
			}

			const articles: FormattedNewsArticle[] = [];
			const maxRounds = 6; // Maximum 6 rounds
			let round = 0;

			// Round-robin through symbols, taking one article per round
			while (articles.length < 6 && round < maxRounds) {
				const symbolIndex = round % cleanSymbols.length;
				const symbol = cleanSymbols[symbolIndex];

				try {
					const url = `${FINNHUB_BASE_URL}/company-news?symbol=${symbol}&from=${fromDateStr}&to=${toDateStr}&token=${NEXT_PUBLIC_FINNHUB_API_KEY}`;
					const news = await fetchJSON<FinnhubNewsArticle[]>(url);

					// Find the first valid article we haven't added yet
					const validArticle = news.find(
						(article) =>
							isValidArticle(article) &&
							!articles.some((a) => a.url === article.url)
					);

					if (validArticle) {
						articles.push(formatArticle(validArticle, symbol));
					}
				} catch (error) {
					console.error(`Error fetching news for ${symbol}:`, error);
				}

				round++;
			}

			// Sort by datetime (most recent first)
			articles.sort((a, b) => b.datetime - a.datetime);

			return articles;
		}

		// No symbols provided - fetch general market news
		const url = `${FINNHUB_BASE_URL}/news?category=general&token=${NEXT_PUBLIC_FINNHUB_API_KEY}`;
		const news = await fetchJSON<FinnhubNewsArticle[]>(url);

		// Deduplicate by id/url/headline and validate
		const seen = new Set<string>();
		const uniqueArticles: FormattedNewsArticle[] = [];

		for (const article of news) {
			if (!isValidArticle(article)) continue;

			const key = article.id?.toString() || article.url || article.headline;
			if (seen.has(key)) continue;

			seen.add(key);
			uniqueArticles.push(formatArticle(article));

			// Stop after collecting 6 articles
			if (uniqueArticles.length >= 6) break;
		}

		// Sort by datetime (most recent first)
		uniqueArticles.sort((a, b) => b.datetime - a.datetime);

		return uniqueArticles;
	} catch (error) {
		console.error("Failed to fetch news:", error);
		throw new Error("Failed to fetch news");
	}
};
