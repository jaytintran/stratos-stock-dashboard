import TradingViewWidget from "@/components/TradingViewWidget";
import {
	MARKET_OVERVIEW_WIDGET_CONFIG,
	HEATMAP_WIDGET_CONFIG,
	TOP_STORIES_WIDGET_CONFIG,
	MARKET_DATA_WIDGET_CONFIG,
} from "@/lib/constants";

const scriptUrl = "https://s3.tradingview.com/external-embedding/embed-widget-";

const Home = () => {
	return (
		<div className="home-wrapper flex min-h-screen ">
			<section className="home-container">
				<div className="md:col-span-1 xl:col-span-1">
					<TradingViewWidget
						scriptUrl={`${scriptUrl}market-overview.js`}
						config={MARKET_OVERVIEW_WIDGET_CONFIG}
						title="Market Overview"
						className="custom-chart"
						height={600}
					/>
				</div>

				<div className="md:col-span-1 xl:col-span-2">
					<TradingViewWidget
						scriptUrl={`${scriptUrl}stock-heatmap.js`}
						config={HEATMAP_WIDGET_CONFIG}
						title="Stock Heatmap"
						className="custom-chart"
						height={600}
					/>
				</div>
			</section>

			<section className="home-container">
				<div className="h-full md:col-span-1 xl:col-span-1">
					<TradingViewWidget
						scriptUrl={`${scriptUrl}timeline.js`}
						config={TOP_STORIES_WIDGET_CONFIG}
						height={600}
					/>
				</div>

				<div className="h-full md:col-span-1 xl:col-span-2">
					<TradingViewWidget
						scriptUrl={`${scriptUrl}market-quotes.js`}
						config={MARKET_DATA_WIDGET_CONFIG}
						height={600}
					/>
				</div>
			</section>
		</div>
	);
};

export default Home;
