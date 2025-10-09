"use client";
import { useEffect, useRef } from "react";

const useTradingViewWidget = (
	scriptUrl: string,
	config: Record<string, unknown>,
	height = 600
) => {
	const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		if (container.dataset.loaded) return;

		// Set container HTML like TradingView expects
		container.innerHTML = `
			<div class="tradingview-widget-container__widget" style="height: ${height}px; width: 100%;"></div>
		`;

		// Create the script element with config
		const script = document.createElement("script");
		script.src = scriptUrl;
		script.type = "text/javascript";
		script.async = true;
		script.innerHTML = JSON.stringify(config);

		// Clear container and append elements
		container.appendChild(script);
		container.dataset.loaded = "true";

		return () => {
			if (container) {
				container.innerHTML = "";
				delete container.dataset.loaded;
			}
		};
	}, [scriptUrl, config, height]);

	return containerRef;
};

export default useTradingViewWidget;
