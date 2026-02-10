export const createShip = (name, size) => ({
  name,
  size,
  hits: 0
});

export const hitShip = (ship) => {
  if (ship.hits < ship.size) {
    return { ...ship, hits: ship.hits + 1 };
  }
  return ship;
};

export const isShipSunk = (ship) => ship.hits >= ship.size;
