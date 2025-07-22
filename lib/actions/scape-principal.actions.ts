"use server";

import * as cheerio from "cheerio";
import { scrapeVehicleVersions } from "./versiones-vehiculo.actions";

export async function scrapeVehicleData(marca: string, modelo: string, ano?: string) {
  try {
    const baseUrl = `https://autos.mercadolibre.com.ar/${marca.toLowerCase()}/${modelo.toLowerCase()}`;
    const url = ano ? `${baseUrl}/${ano}` : baseUrl;
    
    console.log(`Scraping URL: ${url}`);
    
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
    
    // Extraer datos del sitio
    const vehicleData = {
      marca,
      modelo, 
      ...(ano && { ano }),
      url,
      scraped_at: new Date().toISOString()
    };
    
    // Tasa de conversión USD a ARS
    const USD_TO_ARS_RATE = 1300;
    
    // Array unificado para todos los vehículos
    const vehicles: Array<{
      title?: string,
      location?: string,
      year?: string,
      mileage?: string,
      originalPrice: string,
      currency: string,
      priceInARS: number
    }> = [];
    
    // Debug: Ver qué elementos encuentra
    console.log('Total elements found with .ui-search-item:', $('.ui-search-item').length);
    console.log('Total elements found with .poly-component:', $('.poly-component').length);
    console.log('Total elements found with .andes-card:', $('.andes-card').length);
    
    // Intentar múltiples selectores para encontrar los elementos de vehículos
    let vehicleElements = $('.ui-search-item');
    if (vehicleElements.length === 0) {
      vehicleElements = $('.poly-component');
    }
    if (vehicleElements.length === 0) {
      vehicleElements = $('.andes-card');
    }
    if (vehicleElements.length === 0) {
      vehicleElements = $('[data-testid="item"]');
    }
    
    console.log('Using selector with', vehicleElements.length, 'elements');
    
    // Extraer todos los datos de vehículos
    vehicleElements.each((_: number, vehicleElement: cheerio.Element) => {
      const $vehicle = $(vehicleElement);
      
      // Título - intentar múltiples selectores
      let title = $vehicle.find('.ui-search-item__title-label').text().trim();
      if (!title) title = $vehicle.find('.poly-component__title').text().trim();
      if (!title) title = $vehicle.find('h2').text().trim();
      if (!title) title = $vehicle.find('[data-testid="title"]').text().trim();
      
      // Ubicación - intentar múltiples selectores
      let location = $vehicle.find('.ui-search-item__group__element.ui-search-item__location').text().trim();
      if (!location) location = $vehicle.find('.poly-component__location').text().trim();
      if (!location) location = $vehicle.find('[data-testid="location"]').text().trim();
      
      // Precio
      let originalPrice = '';
      let currency = '';
      let priceInARS = 0;
      
      // Intentar múltiples selectores para precio
      const priceSelectors = [
        '.poly-price__current .andes-money-amount',
        '.andes-money-amount',
        '.price',
        '[data-testid="price"]'
      ];
      
      for (const selector of priceSelectors) {
        const priceElement = $vehicle.find(selector);
        if (priceElement.length > 0) {
          const currencyEl = priceElement.find('.andes-money-amount__currency-symbol');
          const fractionEl = priceElement.find('.andes-money-amount__fraction');
          
          if (currencyEl.length > 0 && fractionEl.length > 0) {
            currency = currencyEl.text().trim();
            const priceText = fractionEl.text().trim();
            originalPrice = `${currency}${priceText}`;
            
            if (priceText) {
              const numericPrice = parseFloat(priceText.replace(/[.,]/g, ''));
              if (currency === 'US$') {
                priceInARS = numericPrice * USD_TO_ARS_RATE;
              } else {
                priceInARS = numericPrice;
              }
              break;
            }
          } else {
            // Intentar extraer precio completo del texto
            const fullPriceText = priceElement.text().trim();
            if (fullPriceText) {
              originalPrice = fullPriceText;
              // Detectar moneda
              if (fullPriceText.includes('US$') || fullPriceText.includes('USD')) {
                currency = 'US$';
                const match = fullPriceText.match(/[\d.,]+/);
                if (match) {
                  const numericPrice = parseFloat(match[0].replace(/[.,]/g, ''));
                  priceInARS = numericPrice * USD_TO_ARS_RATE;
                  break;
                }
              } else if (fullPriceText.includes('$')) {
                currency = '$';
                const match = fullPriceText.match(/[\d.,]+/);
                if (match) {
                  priceInARS = parseFloat(match[0].replace(/[.,]/g, ''));
                  break;
                }
              }
            }
          }
        }
      }
      
      // Año y kilometraje
      let year = '';
      let mileage = '';
      
      const attributesList = $vehicle.find('.poly-component__attributes-list .poly-attributes_list');
      if (attributesList.length > 0) {
        const attributes = attributesList.find('.poly-attributes_list__item').map((_: number, item: cheerio.Element) => {
          return $(item).text().trim();
        }).get();
        
        attributes.forEach((attr: string) => {
          if (/^\d{4}$/.test(attr)) {
            year = attr;
          } else if (attr.includes('Km')) {
            mileage = attr;
          }
        });
      }
      
      // Debug: mostrar qué se encontró para cada vehículo
      console.log(`Vehicle ${_}: title="${title}", price="${originalPrice}", year="${year}", mileage="${mileage}"`);
      
      // Agregar vehículo (incluso sin precio para debug)
      if (title || originalPrice || year || mileage) {
        vehicles.push({
          title: title || undefined,
          location: location || undefined,
          year: year || undefined,
          mileage: mileage || undefined,
          originalPrice,
          currency,
          priceInARS
        });
      }
    });
    
    // Calcular estadísticas de precios en ARS
    const pricesInARS = vehicles.map(v => v.priceInARS).filter(price => price > 0);
    const priceStats = {
      min: pricesInARS.length > 0 ? Math.min(...pricesInARS) : 0,
      max: pricesInARS.length > 0 ? Math.max(...pricesInARS) : 0,
      average: pricesInARS.length > 0 ? pricesInARS.reduce((sum, price) => sum + price, 0) / pricesInARS.length : 0,
      count: pricesInARS.length
    };
    
    const scrapedData = {
      ...vehicleData,
      total_listings_found: vehicles.length,
      vehicles: vehicles.slice(0, 20), // Primeros 20 vehículos
      price_statistics_ars: {
        minimum: priceStats.min,
        maximum: priceStats.max,
        average: Math.round(priceStats.average),
        count: priceStats.count
      },
      usd_to_ars_rate: USD_TO_ARS_RATE
    };
    
    console.log("=== SCRAPED DATA ===");
    console.log(JSON.stringify(scrapedData, null, 2));
    console.log("==================");
    
    // Scraper versiones del vehículo (solo si hay año especificado)
    let versionsData = null;
    if (ano) {
      versionsData = await scrapeVehicleVersions(marca, modelo, ano);
    }
    
    return {
      ...scrapedData,
      versions_data: versionsData
    };
    
  } catch (error) {
    console.error("Error scraping vehicle data:", error);
    throw error;
  }
}