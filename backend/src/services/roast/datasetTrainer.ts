import * as fs from 'fs';
import * as path from 'path';

export interface RoastPattern {
  input: string;
  response: string;
  keywords: string[];
  intensity: 'funny' | 'brutal' | 'sarcastic';
}

export interface TrainedModel {
  patterns: RoastPattern[];
  keywordMap: Map<string, RoastPattern[]>;
  responseTemplates: string[];
}

class RoastDatasetTrainer {
  private patterns: RoastPattern[] = [];
  private keywordMap: Map<string, RoastPattern[]> = new Map();
  private responseTemplates: string[] = [];

  // Common roast keywords to extract
  private readonly KEYWORDS = [
    'face', 'personality', 'IQ', 'hairline', 'humor', 'breath', 'energy',
    'useful', 'sharp', 'slower', 'proof', 'wi-fi', 'wifi', 'crayon',
    'bowling', 'dial-up', 'microwave', 'battery', 'AI', 'shadow',
    'existence', 'mute', 'charisma', 'brick', 'internet', 'phone'
  ];

  /**
   * Load and parse CSV dataset
   */
  loadDataset(csvPath: string): void {
    try {
      const csvContent = fs.readFileSync(csvPath, 'utf-8');
      const lines = csvContent.split('\n').slice(1); // Skip header
      
      lines.forEach((line, index) => {
        if (!line.trim()) return;
        
        // Parse CSV line (handle commas in quotes)
        const match = line.match(/^"?([^"]*)"?,?"?([^"]*)"?$/);
        if (!match) return;
        
        const [, input, response] = match;
        if (!input || !response) return;
        
        const keywords = this.extractKeywords(input);
        const intensity = this.determineIntensity(input, response);
        
        const pattern: RoastPattern = {
          input: input.trim(),
          response: response.trim(),
          keywords,
          intensity
        };
        
        this.patterns.push(pattern);
        
        // Map keywords to patterns
        keywords.forEach(keyword => {
          if (!this.keywordMap.has(keyword)) {
            this.keywordMap.set(keyword, []);
          }
          this.keywordMap.get(keyword)!.push(pattern);
        });
        
        // Add response to templates
        if (!this.responseTemplates.includes(response.trim())) {
          this.responseTemplates.push(response.trim());
        }
      });
      
      console.log(`✅ Trained model with ${this.patterns.length} roast patterns`);
      console.log(`📊 Mapped ${this.keywordMap.size} unique keywords`);
      console.log(`💬 Generated ${this.responseTemplates.length} response templates`);
      
    } catch (error) {
      console.error('❌ Error loading dataset:', error);
      throw error;
    }
  }

  /**
   * Extract keywords from text
   */
  private extractKeywords(text: string): string[] {
    const lowerText = text.toLowerCase();
    const found: string[] = [];
    
    this.KEYWORDS.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        found.push(keyword);
      }
    });
    
    // Also extract significant words (longer than 4 chars)
    const words = text.toLowerCase().match(/\b[a-z]{5,}\b/g) || [];
    words.forEach(word => {
      if (!found.includes(word) && found.length < 10) {
        found.push(word);
      }
    });
    
    return found;
  }

  /**
   * Determine roast intensity based on content
   */
  private determineIntensity(input: string, response: string): 'funny' | 'brutal' | 'sarcastic' {
    const text = (input + ' ' + response).toLowerCase();
    
    const brutalWords = ['destroyed', 'obliterate', 'annihilate', 'failed', 'mistake', 'worst', 'awful'];
    const sarcasticWords = ['at least', 'good luck', 'rich coming', 'interesting', 'bold', 'impressive'];
    const funnyWords = ['lol', 'haha', 'giving', 'energy', 'vibe', 'like'];
    
    let brutalScore = 0;
    let sarcasticScore = 0;
    let funnyScore = 0;
    
    brutalWords.forEach(word => { if (text.includes(word)) brutalScore++; });
    sarcasticWords.forEach(word => { if (text.includes(word)) sarcasticScore++; });
    funnyWords.forEach(word => { if (text.includes(word)) funnyScore++; });
    
    if (brutalScore > sarcasticScore && brutalScore > funnyScore) return 'brutal';
    if (sarcasticScore > funnyScore) return 'sarcastic';
    return 'funny';
  }

  /**
   * Find best matching roast response based on user input
   */
  findBestRoast(userInput: string, intensity?: 'funny' | 'brutal' | 'sarcastic'): string | null {
    const keywords = this.extractKeywords(userInput);
    
    if (keywords.length === 0) {
      // Random roast if no keywords match
      return this.getRandomRoast(intensity);
    }
    
    // Find patterns that match the most keywords
    const scoredPatterns: { pattern: RoastPattern, score: number }[] = [];
    
    this.patterns.forEach(pattern => {
      let score = 0;
      
      keywords.forEach(keyword => {
        if (pattern.keywords.includes(keyword)) {
          score += 2;
        }
      });
      
      // Bonus for matching intensity
      if (intensity && pattern.intensity === intensity) {
        score += 3;
      }
      
      // Check for similar content
      const lowerInput = userInput.toLowerCase();
      const lowerPattern = pattern.input.toLowerCase();
      const commonWords = lowerInput.split(' ').filter(word => 
        word.length > 3 && lowerPattern.includes(word)
      ).length;
      score += commonWords;
      
      if (score > 0) {
        scoredPatterns.push({ pattern, score });
      }
    });
    
    if (scoredPatterns.length === 0) {
      return this.getRandomRoast(intensity);
    }
    
    // Sort by score and pick from top 5 randomly for variety
    scoredPatterns.sort((a, b) => b.score - a.score);
    const topPatterns = scoredPatterns.slice(0, 5);
    const selected = topPatterns[Math.floor(Math.random() * topPatterns.length)];
    
    return selected.pattern.response;
  }

  /**
   * Get random roast from dataset
   */
  private getRandomRoast(intensity?: 'funny' | 'brutal' | 'sarcastic'): string {
    let filteredPatterns = this.patterns;
    
    if (intensity) {
      filteredPatterns = this.patterns.filter(p => p.intensity === intensity);
    }
    
    if (filteredPatterns.length === 0) {
      filteredPatterns = this.patterns;
    }
    
    const randomPattern = filteredPatterns[Math.floor(Math.random() * filteredPatterns.length)];
    return randomPattern.response;
  }

  /**
   * Get trained model data
   */
  getModel(): TrainedModel {
    return {
      patterns: this.patterns,
      keywordMap: this.keywordMap,
      responseTemplates: this.responseTemplates
    };
  }

  /**
   * Get statistics
   */
  getStats() {
    const intensityCounts = {
      funny: this.patterns.filter(p => p.intensity === 'funny').length,
      brutal: this.patterns.filter(p => p.intensity === 'brutal').length,
      sarcastic: this.patterns.filter(p => p.intensity === 'sarcastic').length
    };
    
    return {
      totalPatterns: this.patterns.length,
      uniqueKeywords: this.keywordMap.size,
      responseTemplates: this.responseTemplates.length,
      intensityDistribution: intensityCounts
    };
  }
}

// Singleton instance
let trainerInstance: RoastDatasetTrainer | null = null;

export function getTrainer(): RoastDatasetTrainer {
  if (!trainerInstance) {
    trainerInstance = new RoastDatasetTrainer();
    
    // Load dataset - use absolute path
    const datasetPath = 'C:\\Users\\Mahalakshmi Mohan\\Downloads\\offensive_roasting_dataset_5000.csv';
    try {
      trainerInstance.loadDataset(datasetPath);
    } catch (error) {
      console.warn('⚠️  Could not load dataset, using fallback roasts');
      console.error('Dataset load error:', error);
    }
  }
  
  return trainerInstance;
}

export default RoastDatasetTrainer;
