const compareDistance = (a, b) => {
  // a should come before b in the sorted order
  if (a.distance < b.distance) {
    return -1;
    // a should come after b in the sorted order
  } else if (a.distance > b.distance) {
    return 1;
    // and and b are the same
  } else {
    return 0;
  }
};

export default compareDistance;
