/**
 * Tests: VehicleBrand Domain Entity
 * Tests unitarios para la entidad VehicleBrand
 */

import { VehicleBrand } from '@/domain/entities/vehicle-brand';

describe('VehicleBrand', () => {
  describe('constructor', () => {
    it('should create a valid VehicleBrand', () => {
      const brand = new VehicleBrand('Toyota', 'toyota', 'Toyota Motor');
      
      expect(brand.name).toBe('Toyota');
      expect(brand.slug).toBe('toyota');
      expect(brand.displayName).toBe('Toyota Motor');
    });

    it('should use name as displayName when not provided', () => {
      const brand = new VehicleBrand('Ford', 'ford');
      
      expect(brand.getDisplayName()).toBe('Ford');
    });

    it('should throw error for empty name', () => {
      expect(() => {
        new VehicleBrand('', 'toyota');
      }).toThrow('Brand name cannot be empty');
    });

    it('should throw error for empty slug', () => {
      expect(() => {
        new VehicleBrand('Toyota', '');
      }).toThrow('Brand slug cannot be empty');
    });

    it('should throw error for invalid slug format', () => {
      expect(() => {
        new VehicleBrand('Toyota', 'Toyota_Motors');
      }).toThrow('Brand slug must be lowercase with hyphens only');
    });
  });

  describe('getDisplayName', () => {
    it('should return displayName when provided', () => {
      const brand = new VehicleBrand('BMW', 'bmw', 'BMW Group');
      
      expect(brand.getDisplayName()).toBe('BMW Group');
    });

    it('should return name when displayName not provided', () => {
      const brand = new VehicleBrand('Honda', 'honda');
      
      expect(brand.getDisplayName()).toBe('Honda');
    });
  });

  describe('equals', () => {
    it('should return true for brands with same slug', () => {
      const brand1 = new VehicleBrand('Toyota', 'toyota');
      const brand2 = new VehicleBrand('TOYOTA', 'toyota', 'Toyota Motors');
      
      expect(brand1.equals(brand2)).toBe(true);
    });

    it('should return false for brands with different slug', () => {
      const brand1 = new VehicleBrand('Toyota', 'toyota');
      const brand2 = new VehicleBrand('Honda', 'honda');
      
      expect(brand1.equals(brand2)).toBe(false);
    });
  });

  describe('fromApiData', () => {
    it('should create VehicleBrand from API data', () => {
      const apiData = {
        name: 'Volkswagen',
        slug: 'volkswagen',
        displayName: 'Volkswagen Group'
      };
      
      const brand = VehicleBrand.fromApiData(apiData);
      
      expect(brand.name).toBe('Volkswagen');
      expect(brand.slug).toBe('volkswagen');
      expect(brand.displayName).toBe('Volkswagen Group');
    });

    it('should handle API data without displayName', () => {
      const apiData = {
        name: 'Chevrolet',
        slug: 'chevrolet'
      };
      
      const brand = VehicleBrand.fromApiData(apiData);
      
      expect(brand.name).toBe('Chevrolet');
      expect(brand.slug).toBe('chevrolet');
      expect(brand.displayName).toBeUndefined();
    });
  });

  describe('toJson', () => {
    it('should serialize brand with displayName', () => {
      const brand = new VehicleBrand('Mercedes-Benz', 'mercedes-benz', 'Mercedes-Benz Group');
      const json = brand.toJson();
      
      expect(json).toEqual({
        name: 'Mercedes-Benz',
        slug: 'mercedes-benz',
        displayName: 'Mercedes-Benz Group'
      });
    });

    it('should serialize brand without displayName', () => {
      const brand = new VehicleBrand('Audi', 'audi');
      const json = brand.toJson();
      
      expect(json).toEqual({
        name: 'Audi',
        slug: 'audi'
      });
    });
  });

  describe('validation edge cases', () => {
    it('should accept valid slug with hyphens', () => {
      expect(() => {
        new VehicleBrand('Land Rover', 'land-rover');
      }).not.toThrow();
    });

    it('should accept slug with numbers', () => {
      expect(() => {
        new VehicleBrand('BMW X3', 'bmw-x3');
      }).not.toThrow();
    });

    it('should reject slug with uppercase', () => {
      expect(() => {
        new VehicleBrand('Toyota', 'Toyota');
      }).toThrow();
    });

    it('should reject slug with spaces', () => {
      expect(() => {
        new VehicleBrand('Land Rover', 'land rover');
      }).toThrow();
    });

    it('should reject slug with special characters', () => {
      expect(() => {
        new VehicleBrand('D.S.', 'd.s.');
      }).toThrow();
    });
  });
});