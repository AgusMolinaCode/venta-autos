"use server";

import * as cheerio from "cheerio";

export interface VehicleVersion {
  name: string;
  url: string;
  resultsCount: number;
}

export async function scrapeVehicleVersions(marca: string, modelo: string, ano: string) {
  try {
    const url = `https://autos.mercadolibre.com.ar/${marca.toLowerCase()}/${modelo.toLowerCase()}/${ano}`;
    
    console.log(`Scraping versions from URL: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const versions: VehicleVersion[] = [];
    
    // Buscar la seccion de versiones
    $('.ui-search-filter-dl').each((_: number, element: cheerio.Element) => {
      const $section = $(element);
      const title = $section.find('.ui-search-filter-dt-title').text().trim();
      
      // Solo procesar si es la seccion de "Versiones"
      if (title === 'Versiones') {
        $section.find('.ui-search-filter-container').each((_: number, versionElement: cheerio.Element) => {
          const $version = $(versionElement);
          const $link = $version.find('.ui-search-link');
          
          if ($link.length > 0) {
            const name = $link.find('.ui-search-filter-name').text().trim();
            const url = $link.attr('href') || '';
            const resultsText = $link.find('.ui-search-filter-results-qty').text().trim();
            
            // Extraer el numero de resultados (ej: "(33)" -> 33)
            const resultsMatch = resultsText.match(/\((\d+)\)/);
            const resultsCount = resultsMatch ? parseInt(resultsMatch[1], 10) : 0;
            
            if (name) {
              versions.push({
                name,
                url,
                resultsCount
              });
            }
          }
        });
      }
    });
    
    const versionsData = {
      marca,
      modelo,
      ano,
      scraped_at: new Date().toISOString(),
      total_versions: versions.length,
      versions: versions.sort((a, b) => b.resultsCount - a.resultsCount)
    };
    
    console.log("=== VEHICLE VERSIONS ===");
    console.log(JSON.stringify(versionsData, null, 2));
    console.log("========================");
    
    return versionsData;
    
  } catch (error) {
    console.error("Error scraping vehicle versions:", error);
    throw error;
  }
}