import { describe, it, expect } from 'vitest';
import { createShip, hitShip, isShipSunk } from './Ship';

describe('Ship Functional', () => {
  it('should be initialized with a size', () => {
    const ship = createShip('Test', 5);
    expect(ship.size).toBe(5);
    expect(ship.hits).toBe(0);
  });

  it('should accept a hit', () => {
    const ship = createShip('Test', 3);
    const updatedShip = hitShip(ship);
    expect(updatedShip.hits).toBe(1);
    expect(ship.hits).toBe(0);
  });

  it('should not register hits greater than size', () => {
    let ship = createShip('Test', 2);
    ship = hitShip(ship);
    ship = hitShip(ship);
    ship = hitShip(ship); 
    expect(ship.hits).toBe(2);
  });

  it('should report sunk when hits equal size', () => {
    let ship = createShip('Test', 2);
    expect(isShipSunk(ship)).toBe(false);
    ship = hitShip(ship);
    expect(isShipSunk(ship)).toBe(false);
    ship = hitShip(ship);
    expect(isShipSunk(ship)).toBe(true);
  });
});
