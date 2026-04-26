/**
 * Nearest Neighbour + 2-opt TSP Algorithm
 * @param {number[][]} distanceMatrix - NxN matrix of distances
 * @param {number} startIndex - The starting node index
 * @returns {{route: number[], totalDistance: number}}
 */
/**
 * Nearest Neighbour + 2-opt TSP Algorithm (Priority Aware)
 * @param {number[][]} distanceMatrix - NxN matrix of distances
 * @param {boolean[]} priorityFlags - Array indicating if a node is high priority
 * @param {number} startIndex - The starting node index
 * @returns {{route: number[], totalDistance: number}}
 */
function solveTSP(distanceMatrix, priorityFlags, startIndex = 0) {
  const n = distanceMatrix.length;
  if (n === 0) return { route: [], totalDistance: 0 };
  if (n === 1) return { route: [0], totalDistance: 0 };

  // 1. Separate unvisited nodes into priority and normal
  const priorityUnvisited = new Set();
  const normalUnvisited = new Set();
  
  for (let i = 0; i < n; i++) {
    if (i === startIndex) continue;
    if (priorityFlags[i]) {
      priorityUnvisited.add(i);
    } else {
      normalUnvisited.add(i);
    }
  }

  let current = startIndex;
  let route = [current];
  
  // 2. Nearest Neighbour: Priority nodes first
  while (priorityUnvisited.size > 0) {
    let nearest = null;
    let minDistance = Infinity;
    
    for (const node of priorityUnvisited) {
      if (distanceMatrix[current][node] < minDistance) {
        minDistance = distanceMatrix[current][node];
        nearest = node;
      }
    }
    
    route.push(nearest);
    priorityUnvisited.delete(nearest);
    current = nearest;
  }

  // 3. Nearest Neighbour: Normal nodes second
  while (normalUnvisited.size > 0) {
    let nearest = null;
    let minDistance = Infinity;
    
    for (const node of normalUnvisited) {
      if (distanceMatrix[current][node] < minDistance) {
        minDistance = distanceMatrix[current][node];
        nearest = node;
      }
    }
    
    route.push(nearest);
    normalUnvisited.delete(nearest);
    current = nearest;
  }
  
  const calculateDistance = (path) => {
    let dist = 0;
    for (let i = 0; i < path.length - 1; i++) {
      dist += distanceMatrix[path[i]][path[i + 1]];
    }
    return dist;
  };

  // 4. 2-opt local search (Constrained by priority)
  // We only allow swaps that don't mix priority and normal groups
  const priorityEndIndex = priorityFlags.filter((p, i) => p && i !== startIndex).length;
  
  let improved = true;
  while (improved) {
    improved = false;
    
    // Opt 1: Optimize within priority segment
    if (priorityEndIndex > 1) {
      for (let i = 1; i < priorityEndIndex; i++) {
        for (let j = i + 1; j <= priorityEndIndex; j++) {
          if (tryTwoOpt(route, i, j, distanceMatrix)) improved = true;
        }
      }
    }
    
    // Opt 2: Optimize within normal segment
    const normalStartIndex = priorityEndIndex + 1;
    if (n - 1 > normalStartIndex) {
      for (let i = normalStartIndex; i < n - 1; i++) {
        for (let j = i + 1; j < n; j++) {
          if (tryTwoOpt(route, i, j, distanceMatrix)) improved = true;
        }
      }
    }
  }

  return {
    route,
    totalDistance: calculateDistance(route)
  };
}

function tryTwoOpt(route, i, j, distanceMatrix) {
  const d1 = distanceMatrix[route[i - 1]][route[i]];
  const d2 = j + 1 < route.length ? distanceMatrix[route[j]][route[j + 1]] : 0;
  const d3 = distanceMatrix[route[i - 1]][route[j]];
  const d4 = j + 1 < route.length ? distanceMatrix[route[i]][route[j + 1]] : 0;
  
  if (d3 + d4 < d1 + d2) {
    const reversedSegment = route.slice(i, j + 1).reverse();
    route.splice(i, reversedSegment.length, ...reversedSegment);
    return true;
  }
  return false;
}

/**
 * Calculate the optimal route using TSP approximation (Nearest Neighbour + 2-opt)
 * @param {Array<Object>} locations - The locations to visit
 * @param {Array<Array<Object>>} distanceMatrix - The distances between locations
 * @returns {Promise<Object>} - Optimized route details
 */
export const calculateOptimalRoute = async (locations, distanceMatrix) => {
  console.log('Optimizing route for', locations.length, 'stops with NN + 2-opt');
  
  // Convert distance matrix of objects to matrix of numbers
  const numericMatrix = distanceMatrix.map(row => row.map(cell => cell.distance));

  // Solve TSP starting from index 0 with priority flags
  const priorityFlags = locations.map(loc => !!loc.isPriority);
  const { route: routeIndices, totalDistance } = solveTSP(numericMatrix, priorityFlags, 0);
  
  // Calculate total duration based on optimized route
  let totalDuration = 0;
  for (let i = 0; i < routeIndices.length - 1; i++) {
    const from = routeIndices[i];
    const to = routeIndices[i + 1];
    totalDuration += distanceMatrix[from][to].duration;
  }

  const optimizedLocations = routeIndices.map(index => locations[index]);

  return {
    routeIndices,
    optimizedLocations,
    totalDistance,
    totalDuration
  };
};
