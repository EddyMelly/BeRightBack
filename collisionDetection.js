export function detectCollision(bullet, gameObject) {
  let bottomOfBullet = bullet.position.y + bullet.size;
  let topOfBullet = bullet.position.y;

  let topOfObject = gameObject.position.y;
  let leftOfObject = gameObject.position.x;
  let rightOfObject = gameObject.position.x + gameObject.width;
  let bottomOfObject = gameObject.position.y + gameObject.height;

  //if the bottom of the bullet is greater than the top of the object AND the top of the bullet is less than or equal to the bottom of the object
  if (
    bottomOfBullet >= topOfObject &&
    topOfBullet <= bottomOfObject &&
    bullet.position.x >= leftOfObject &&
    bullet.position.x + bullet.size <= rightOfObject
  ) {
    return true;
  } else {
    return false;
  }
}

export function zombieCollision(zombie, gameObject) {
  let bottomOfZombie = zombie.position.y + zombie.size;

  let topOfObject = gameObject.position.y;
  let leftOfObject = gameObject.position.x;
  let rightOfObject = gameObject.position.x + gameObject.width;
  let bottomOfObject = gameObject.position.y + gameObject.height;

  //if the bottom of the bullet is greater than the top of the object AND the top of the bullet is less than or equal to the bottom of the object
  if (
    bottomOfZombie >= topOfObject &&
    zombie.position.x + zombie.size / 2 >= leftOfObject &&
    zombie.position.x + zombie.size <= rightOfObject
  ) {
    return true;
  } else {
    return false;
  }
}

export function zombieBulletCollision(zombie, bullet) {
  //if top of bullet is less than bottom of zombie
  if (
    bullet.position.y <= zombie.position.y + zombie.size &&
    bullet.position.x >= zombie.position.x &&
    bullet.position.x <= zombie.position.x + zombie.size &&
    bullet.position.y >= zombie.position.y
  ) {
    return true;
  } else {
    return false;
  }
}
