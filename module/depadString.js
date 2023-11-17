function depadString(str = '', cnln = 0) {
  // For each line, remove cnln

  var gr_ = () => {
    return str
      .split('\n')
      .map((line) => line.slice(cnln))
      .join('\n')
  }

  var lr_ = (am) => {
    return str
      .split('\n')
      .map((line) => ' '.repeat(am) + line)
      .join('\n')
  }

  if (cnln < 0) {
    // Neg, so add WS
    return lr_(-cnln)
  }

  else if (cnln < 1) {
    // Get lenth of whitespace on first line
    cnln = str.match(/^\s*/)[0].length
  }

  return gr_()
}

export default depadString;