export const getClaudeSummary = async (optimizedStops, totalDistance, estimatedTime) => {
  const stops = optimizedStops.map(s => s.originalAddress);
  const numberOfStops = stops.length > 1 ? stops.length - 1 : 0;
  
  const aiSummary = `🚀 Delivery Briefing:
Start your journey from ${stops[0]}.
You have ${numberOfStops} stops to cover today.
Your optimized route covers a total distance of ${totalDistance.toFixed(1)} km.
Estimated time to complete all deliveries: ${Math.round(estimatedTime)} minutes.
First stop: ${stops[1] || 'None'} — then proceed as shown in the route above.
Tip: Follow the numbered stops in order for the most efficient delivery! 📦`;

  return {
    summary: aiSummary,
    provider: 'Mock'
  };
};