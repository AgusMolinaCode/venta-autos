"use server";

import * as cheerio from "cheerio";

export interface VehicleYear {
  year: string;
  url: string;
  resultsCount: number;
}

export async function scrapeVehicleYears(marca: string, modelo: string) {
  try {
    const url = `https://autos.mercadolibre.com.ar/${marca.toLowerCase()}/${modelo.toLowerCase()}`;
    
    console.log(`Scraping years from URL: ${url}`);
    
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
    
    const years: VehicleYear[] = [];
    
    // Buscar la seccion de anos
    $('.ui-search-filter-dl').each((_: number, element: cheerio.Element) => {
      const $section = $(element);
      const title = $section.find('.ui-search-filter-dt-title').text().trim();
      
      // Solo procesar si es la seccion de "Año"
      if (title === 'Ano' || title === 'Year' || title.includes('Año')) {
        $section.find('.ui-search-filter-container').each((_: number, yearElement: cheerio.Element) => {
          const $year = $(yearElement);
          const $link = $year.find('.ui-search-link');
          
          if ($link.length > 0) {
            const year = $link.find('.ui-search-filter-name').text().trim();
            const url = $link.attr('href') || '';
            const resultsText = $link.find('.ui-search-filter-results-qty').text().trim();
            
            // Extraer el numero de resultados (ej: "(453)" -> 453)
            const resultsMatch = resultsText.match(/\((\d+)\)/);
            const resultsCount = resultsMatch ? parseInt(resultsMatch[1], 10) : 0;
            
            if (year && /^\d{4}$/.test(year)) { // Solo anos validos (4 digitos)
              years.push({
                year,
                url,
                resultsCount
              });
            }
          }
        });
      }
    });
    
    const yearsData = {
      marca,
      modelo,
      scraped_at: new Date().toISOString(),
      total_years: years.length,
      years: years.sort((a, b) => parseInt(b.year) - parseInt(a.year)) // Ordenar por ano descendente
    };
    
    console.log("=== VEHICLE YEARS ===");
    console.log(JSON.stringify(yearsData, null, 2));
    console.log("=====================");
    
    return yearsData;
    
  } catch (error) {
    console.error("Error scraping vehicle years:", error);
    throw error;
  }
}