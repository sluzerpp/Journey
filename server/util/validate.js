function validateState(state) {
  switch (state) {
    case 'AVAILABLE': break;
    case 'UNAVAILABLE': break;
    case 'ACCEPTED': break;
    case 'COMPLETED': break;
    default: {
      return false;
    }
  }
  return true;
}

function validateDifficult(difficult) {
  switch(difficult) {
    case 'EASY': break;
    case 'MEDIUM': break;
    case 'HARD': break;
    default: {
      return false;
    }
  }
  return true;
}

module.exports = {
  validateState,
  validateDifficult
}