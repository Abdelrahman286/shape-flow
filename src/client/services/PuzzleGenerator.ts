export interface PuzzleConfig {
  level: number;
  pieceCount: number;
  rotationIncrement: number;
  seed: number;
}

export interface PuzzlePiece {
  id: string;
  svgPath: string;
  currentRotation: number;
  correctRotation: number;
  position: { x: number; y: number };
  correctPosition: { x: number; y: number };
  color: string;
  connections: string[]; // IDs of connecting pieces
}

export interface GeneratedPuzzle {
  pieces: PuzzlePiece[];
  completeSvg: string;
  patternShapes: string;
  dimensions: { width: number; height: number };
}

class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  nextFloat(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }
}

export class PuzzleGenerator {
  generate(config: PuzzleConfig): GeneratedPuzzle {
    const random = new SeededRandom(config.seed);
    const dimensions = { width: 400, height: 400 };
    
    // Generate one beautiful abstract shape
    const mainShape = this.generateAbstractShape(random, dimensions);
    
    // Split the shape into organic puzzle pieces
    const pieces = this.createPuzzlePieces(mainShape, config, random, dimensions);
    
    const completeSvg = `<svg viewBox="0 0 ${dimensions.width} ${dimensions.height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${dimensions.width}" height="${dimensions.height}" fill="#f0fdf4"/>
      ${mainShape}
    </svg>`;
    
    return {
      pieces,
      completeSvg,
      patternShapes: mainShape,
      dimensions,
    };
  }

  private generateAbstractShape(random: SeededRandom, dimensions: { width: number; height: number }): string {
    const { width, height } = dimensions;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Generate a single beautiful abstract shape with curves
    const shapeType = random.nextInt(0, 4);
    const colors = this.generateColorPalette(random);
    const mainColor = colors[0];
    const accentColor = colors[1] || colors[0];
    
    switch (shapeType) {
      case 0:
        return this.generateFlowerShape(random, centerX, centerY, mainColor, accentColor);
      case 1:
        return this.generateButterflyShape(random, centerX, centerY, mainColor, accentColor);
      case 2:
        return this.generateStarburstShape(random, centerX, centerY, mainColor, accentColor);
      case 3:
        return this.generateOrganicBlobShape(random, centerX, centerY, mainColor, accentColor);
      case 4:
        return this.generateMandalaShape(random, centerX, centerY, mainColor, accentColor);
      default:
        return this.generateFlowerShape(random, centerX, centerY, mainColor, accentColor);
    }
  }

  private generateColorPalette(random: SeededRandom): string[] {
    const greenShades = [
      '#4ade80', '#22c55e', '#10b981', '#059669',
      '#6ee7b7', '#34d399', '#5eead4', '#2dd4bf',
      '#86efac', '#a7f3d0', '#6ee7b7', '#14b8a6'
    ];
    
    const count = random.nextInt(3, 5);
    const palette: string[] = [];
    
    for (let i = 0; i < count; i++) {
      palette.push(greenShades[random.nextInt(0, greenShades.length - 1)]);
    }
    
    return palette;
  }

  private generateFlowerShape(random: SeededRandom, cx: number, cy: number, mainColor: string, accentColor: string): string {
    const petalCount = random.nextInt(6, 12);
    const petalLength = random.nextFloat(80, 120);
    const petalWidth = random.nextFloat(30, 50);
    
    let path = '';
    
    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2;
      const petalCx = cx + Math.cos(angle) * (petalLength * 0.6);
      const petalCy = cy + Math.sin(angle) * (petalLength * 0.6);
      
      const x1 = cx + Math.cos(angle - 0.3) * petalWidth;
      const y1 = cy + Math.sin(angle - 0.3) * petalWidth;
      const x2 = cx + Math.cos(angle + 0.3) * petalWidth;
      const y2 = cy + Math.sin(angle + 0.3) * petalWidth;
      const tipX = cx + Math.cos(angle) * petalLength;
      const tipY = cy + Math.sin(angle) * petalLength;
      
      path += `M ${x1} ${y1} Q ${petalCx} ${petalCy} ${tipX} ${tipY} Q ${petalCx} ${petalCy} ${x2} ${y2} `;
    }
    
    const centerRadius = random.nextFloat(20, 35);
    
    return `
      <path d="${path}" fill="${mainColor}" stroke="${accentColor}" stroke-width="3" opacity="0.8"/>
      <circle cx="${cx}" cy="${cy}" r="${centerRadius}" fill="${accentColor}" stroke="${mainColor}" stroke-width="2"/>
    `;
  }

  private generateButterflyShape(random: SeededRandom, cx: number, cy: number, mainColor: string, accentColor: string): string {
    const wingSpan = random.nextFloat(140, 180);
    const wingHeight = random.nextFloat(100, 130);
    
    // Left wing
    const leftWing = `M ${cx} ${cy} 
                     Q ${cx - wingSpan/3} ${cy - wingHeight/2} ${cx - wingSpan/2} ${cy - wingHeight/3}
                     Q ${cx - wingSpan/2} ${cy} ${cx - wingSpan/3} ${cy + wingHeight/4}
                     Q ${cx - wingSpan/4} ${cy + wingHeight/2} ${cx} ${cy}`;
    
    // Right wing (mirrored)
    const rightWing = `M ${cx} ${cy}
                      Q ${cx + wingSpan/3} ${cy - wingHeight/2} ${cx + wingSpan/2} ${cy - wingHeight/3}
                      Q ${cx + wingSpan/2} ${cy} ${cx + wingSpan/3} ${cy + wingHeight/4}
                      Q ${cx + wingSpan/4} ${cy + wingHeight/2} ${cx} ${cy}`;
    
    // Body
    const bodyLength = wingHeight * 0.8;
    const body = `M ${cx} ${cy - bodyLength/2} L ${cx} ${cy + bodyLength/2}`;
    
    return `
      <path d="${leftWing}" fill="${mainColor}" stroke="${accentColor}" stroke-width="2" opacity="0.8"/>
      <path d="${rightWing}" fill="${mainColor}" stroke="${accentColor}" stroke-width="2" opacity="0.8"/>
      <path d="${body}" stroke="${accentColor}" stroke-width="6" stroke-linecap="round"/>
      <circle cx="${cx}" cy="${cy - bodyLength/3}" r="8" fill="${accentColor}"/>
    `;
  }

  private generateStarburstShape(random: SeededRandom, cx: number, cy: number, mainColor: string, accentColor: string): string {
    const rayCount = random.nextInt(8, 16);
    const innerRadius = random.nextFloat(30, 50);
    const outerRadius = random.nextFloat(120, 160);
    
    let path = '';
    const points: string[] = [];
    
    for (let i = 0; i < rayCount * 2; i++) {
      const angle = (i / (rayCount * 2)) * Math.PI * 2;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      points.push(`${x},${y}`);
    }
    
    const centerRadius = random.nextFloat(15, 25);
    
    return `
      <polygon points="${points.join(' ')}" fill="${mainColor}" stroke="${accentColor}" stroke-width="3" opacity="0.8"/>
      <circle cx="${cx}" cy="${cy}" r="${centerRadius}" fill="${accentColor}"/>
    `;
  }

  private generateOrganicBlobShape(random: SeededRandom, cx: number, cy: number, mainColor: string, accentColor: string): string {
    const pointCount = random.nextInt(8, 12);
    const baseRadius = random.nextFloat(80, 120);
    
    let path = '';
    const points: Array<{x: number, y: number}> = [];
    
    // Generate organic points
    for (let i = 0; i < pointCount; i++) {
      const angle = (i / pointCount) * Math.PI * 2;
      const radiusVariation = random.nextFloat(0.7, 1.3);
      const radius = baseRadius * radiusVariation;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      points.push({x, y});
    }
    
    // Create smooth curves between points
    path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 0; i < pointCount; i++) {
      const current = points[i];
      const next = points[(i + 1) % pointCount];
      const controlDistance = random.nextFloat(20, 40);
      
      const midX = (current.x + next.x) / 2;
      const midY = (current.y + next.y) / 2;
      
      path += ` Q ${midX + random.nextFloat(-controlDistance, controlDistance)} ${midY + random.nextFloat(-controlDistance, controlDistance)} ${next.x} ${next.y}`;
    }
    
    path += ' Z';
    
    return `
      <path d="${path}" fill="${mainColor}" stroke="${accentColor}" stroke-width="4" opacity="0.8"/>
    `;
  }

  private generateMandalaShape(random: SeededRandom, cx: number, cy: number, mainColor: string, accentColor: string): string {
    const layers = random.nextInt(3, 5);
    let shapes = '';
    
    for (let layer = 0; layer < layers; layer++) {
      const radius = 30 + layer * 25;
      const petalCount = 6 + layer * 2;
      const petalSize = random.nextFloat(15, 25);
      
      for (let i = 0; i < petalCount; i++) {
        const angle = (i / petalCount) * Math.PI * 2 + (layer * 0.2);
        const petalX = cx + Math.cos(angle) * radius;
        const petalY = cy + Math.sin(angle) * radius;
        
        const color = layer % 2 === 0 ? mainColor : accentColor;
        shapes += `<circle cx="${petalX}" cy="${petalY}" r="${petalSize}" fill="${color}" opacity="0.7"/>`;
      }
    }
    
    // Center circle
    shapes += `<circle cx="${cx}" cy="${cy}" r="20" fill="${accentColor}" stroke="${mainColor}" stroke-width="3"/>`;
    
    return shapes;
  }

  private createPuzzlePieces(
    mainShape: string,
    config: PuzzleConfig,
    random: SeededRandom,
    dimensions: { width: number; height: number }
  ): PuzzlePiece[] {
    const { width, height } = dimensions;
    const { pieceCount, rotationIncrement } = config;
    
    // Generate colors for pieces
    const colors = this.generateColorPalette(random);
    
    // Create random organic pieces that divide the main shape
    const organicPieces = this.generateOrganicPieces(pieceCount, random, dimensions);
    
    const pieces: PuzzlePiece[] = [];
    
    for (let i = 0; i < organicPieces.length; i++) {
      const organicPiece = organicPieces[i];
      
      // Assign random initial rotation (multiple of rotationIncrement)
      const rotationSteps = Math.floor(360 / rotationIncrement);
      const randomSteps = random.nextInt(1, rotationSteps - 1);
      const currentRotation = randomSteps * rotationIncrement;
      
      // Keep pieces within safe bounds and visible on screen
      const margin = 80; // Safe margin from edges
      const scatterRadius = 30; // Small scatter radius
      const angle = random.nextFloat(0, Math.PI * 2);
      const distance = random.nextFloat(5, scatterRadius);
      
      let scatteredX = organicPiece.correctPosition.x + Math.cos(angle) * distance;
      let scatteredY = organicPiece.correctPosition.y + Math.sin(angle) * distance;
      
      // Ensure pieces stay within safe bounds
      scatteredX = Math.max(margin, Math.min(width - margin, scatteredX));
      scatteredY = Math.max(margin, Math.min(height - margin, scatteredY));
      
      pieces.push({
        id: `piece-${i}`,
        svgPath: organicPiece.path,
        currentRotation,
        correctRotation: 0,
        position: { x: scatteredX, y: scatteredY },
        correctPosition: organicPiece.correctPosition,
        color: colors[i % colors.length],
        connections: organicPiece.connections,
      });
    }
    
    return pieces;
  }

  private generateOrganicPieces(
    pieceCount: number,
    random: SeededRandom,
    dimensions: { width: number; height: number }
  ): Array<{path: string, correctPosition: {x: number, y: number}, connections: string[]}> {
    const { width, height } = dimensions;
    
    if (pieceCount <= 4) {
      return this.createOrganicQuadrants(pieceCount, random, dimensions);
    } else if (pieceCount <= 8) {
      return this.createOrganicRadialPieces(pieceCount, random, dimensions);
    } else {
      return this.createOrganicGridPieces(pieceCount, random, dimensions);
    }
  }

  private createOrganicQuadrants(
    pieceCount: number,
    random: SeededRandom,
    dimensions: { width: number; height: number }
  ): Array<{path: string, correctPosition: {x: number, y: number}, connections: string[]}> {
    const { width, height } = dimensions;
    const centerX = width / 2;
    const centerY = height / 2;
    const pieces: Array<{path: string, correctPosition: {x: number, y: number}, connections: string[]}> = [];
    
    // Create organic curved divisions
    const curveVariation = random.nextFloat(30, 60);
    
    for (let i = 0; i < pieceCount; i++) {
      let path: string;
      let correctPos: {x: number, y: number};
      
      switch (i) {
        case 0: // Top-left
          path = `M 0 0 
                  Q ${centerX - curveVariation} ${random.nextFloat(0, 30)} ${centerX + random.nextFloat(-20, 20)} ${centerY - curveVariation}
                  Q ${random.nextFloat(0, 30)} ${centerY - curveVariation} 0 ${centerY + random.nextFloat(-20, 20)}
                  Z`;
          correctPos = { x: centerX / 2, y: centerY / 2 };
          break;
        case 1: // Top-right
          path = `M ${centerX + random.nextFloat(-20, 20)} ${centerY - curveVariation}
                  Q ${centerX + curveVariation} ${random.nextFloat(0, 30)} ${width} 0
                  L ${width} ${centerY + random.nextFloat(-20, 20)}
                  Q ${width - random.nextFloat(0, 30)} ${centerY - curveVariation} ${centerX + random.nextFloat(-20, 20)} ${centerY - curveVariation}
                  Z`;
          correctPos = { x: centerX + centerX / 2, y: centerY / 2 };
          break;
        case 2: // Bottom-left
          path = `M 0 ${centerY + random.nextFloat(-20, 20)}
                  Q ${random.nextFloat(0, 30)} ${centerY + curveVariation} ${centerX + random.nextFloat(-20, 20)} ${centerY + curveVariation}
                  Q ${centerX - curveVariation} ${height - random.nextFloat(0, 30)} 0 ${height}
                  Z`;
          correctPos = { x: centerX / 2, y: centerY + centerY / 2 };
          break;
        case 3: // Bottom-right
          path = `M ${centerX + random.nextFloat(-20, 20)} ${centerY + curveVariation}
                  Q ${width - random.nextFloat(0, 30)} ${centerY + curveVariation} ${width} ${centerY + random.nextFloat(-20, 20)}
                  L ${width} ${height}
                  Q ${centerX + curveVariation} ${height - random.nextFloat(0, 30)} ${centerX + random.nextFloat(-20, 20)} ${centerY + curveVariation}
                  Z`;
          correctPos = { x: centerX + centerX / 2, y: centerY + centerY / 2 };
          break;
        default:
          path = `M 0 0 L ${width} 0 L ${width} ${height} L 0 ${height} Z`;
          correctPos = { x: centerX, y: centerY };
      }
      
      pieces.push({
        path,
        correctPosition: correctPos,
        connections: [] // Simplified - no explicit connections needed
      });
    }
    
    return pieces;
  }

  private createOrganicRadialPieces(
    pieceCount: number,
    random: SeededRandom,
    dimensions: { width: number; height: number }
  ): Array<{path: string, correctPosition: {x: number, y: number}, connections: string[]}> {
    const { width, height } = dimensions;
    const centerX = width / 2;
    const centerY = height / 2;
    const pieces: Array<{path: string, correctPosition: {x: number, y: number}, connections: string[]}> = [];
    const baseRadius = Math.min(width, height) * 0.35;
    
    for (let i = 0; i < pieceCount; i++) {
      const startAngle = (i / pieceCount) * Math.PI * 2;
      const endAngle = ((i + 1) / pieceCount) * Math.PI * 2;
      const midAngle = (startAngle + endAngle) / 2;
      
      // Add some organic variation to the radius
      const radiusVariation1 = random.nextFloat(0.8, 1.2);
      const radiusVariation2 = random.nextFloat(0.8, 1.2);
      
      const x1 = centerX + Math.cos(startAngle) * baseRadius * radiusVariation1;
      const y1 = centerY + Math.sin(startAngle) * baseRadius * radiusVariation1;
      const x2 = centerX + Math.cos(endAngle) * baseRadius * radiusVariation2;
      const y2 = centerY + Math.sin(endAngle) * baseRadius * radiusVariation2;
      
      // Create organic curved piece instead of perfect arc
      const controlRadius = baseRadius * random.nextFloat(0.6, 0.9);
      const controlX = centerX + Math.cos(midAngle) * controlRadius;
      const controlY = centerY + Math.sin(midAngle) * controlRadius;
      
      const path = `M ${centerX} ${centerY}
                   L ${x1} ${y1}
                   Q ${controlX} ${controlY} ${x2} ${y2}
                   Z`;
      
      const centerDistance = baseRadius * 0.6;
      const correctPos = {
        x: centerX + Math.cos(midAngle) * centerDistance,
        y: centerY + Math.sin(midAngle) * centerDistance
      };
      
      pieces.push({
        path,
        correctPosition: correctPos,
        connections: []
      });
    }
    
    return pieces;
  }

  private createOrganicGridPieces(
    pieceCount: number,
    random: SeededRandom,
    dimensions: { width: number; height: number }
  ): Array<{path: string, correctPosition: {x: number, y: number}, connections: string[]}> {
    const { width, height } = dimensions;
    const cols = Math.ceil(Math.sqrt(pieceCount));
    const rows = Math.ceil(pieceCount / cols);
    const pieceWidth = width / cols;
    const pieceHeight = height / rows;
    const pieces: Array<{path: string, correctPosition: {x: number, y: number}, connections: string[]}> = [];
    
    for (let i = 0; i < pieceCount; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      
      const baseX = col * pieceWidth;
      const baseY = row * pieceHeight;
      const centerX = baseX + pieceWidth / 2;
      const centerY = baseY + pieceHeight / 2;
      
      // Create organic shape with random curves
      const path = this.createOrganicShape(baseX, baseY, pieceWidth, pieceHeight, random);
      
      pieces.push({
        path,
        correctPosition: { x: centerX, y: centerY },
        connections: []
      });
    }
    
    return pieces;
  }

  private createOrganicShape(x: number, y: number, width: number, height: number, random: SeededRandom): string {
    const points = 6; // Number of control points
    const path: string[] = [];
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const radiusX = width / 2;
    const radiusY = height / 2;
    
    // Generate organic points around the perimeter
    const organicPoints: Array<{x: number, y: number}> = [];
    
    for (let i = 0; i < points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const variation = random.nextFloat(0.6, 1.0); // Less extreme variation
      const px = centerX + Math.cos(angle) * radiusX * variation;
      const py = centerY + Math.sin(angle) * radiusY * variation;
      organicPoints.push({x: px, y: py});
    }
    
    // Create smooth curved path
    path.push(`M ${organicPoints[0].x} ${organicPoints[0].y}`);
    
    for (let i = 0; i < points; i++) {
      const current = organicPoints[i];
      const next = organicPoints[(i + 1) % points];
      
      // Add gentle curves between points
      const controlDistance = random.nextFloat(15, 30);
      const midAngle = Math.atan2(next.y - current.y, next.x - current.x) + random.nextFloat(-0.5, 0.5);
      const controlX = (current.x + next.x) / 2 + Math.cos(midAngle) * controlDistance;
      const controlY = (current.y + next.y) / 2 + Math.sin(midAngle) * controlDistance;
      
      path.push(`Q ${controlX} ${controlY} ${next.x} ${next.y}`);
    }
    
    path.push('Z');
    return path.join(' ');
  }






}
